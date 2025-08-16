// src/hooks/useSchedule.js
import { useCallback, useRef, useState } from 'react';
import { formatYMD } from '../utils/date';

function uid(){ return Math.random().toString(36).slice(2,10); }

// 반복 발생 전개
function expandOccurrences(ev) {
  const base = [{
    ...ev,
    __isOccurrence: false,
    __occurrenceDateYMD: ev.dateYMD,
  }];
  const rep = ev.repeat || { freq:'none' };
  if (rep.freq === 'none') return base;

  const start = new Date(ev.dateYMD);
  const end = new Date(rep.until || ev.dateYMD);
  const out = [];

  const push = (d) => out.push({
    ...ev,
    __isOccurrence: true,
    __occurrenceDateYMD: formatYMD(d),
  });

  let cur = new Date(start);
  push(cur); // 원본 포함

  const step = (d) => {
    const nd = new Date(d);
    const k = rep.interval || 1;
    if (rep.freq === 'daily') nd.setDate(nd.getDate() + k);
    if (rep.freq === 'weekly') nd.setDate(nd.getDate() + 7*k);
    if (rep.freq === 'monthly') nd.setMonth(nd.getMonth() + k);
    return nd;
  };

  while (true) {
    cur = step(cur);
    if (cur > end) break;
    push(cur);
  }

  return out.map(o => o.__occurrenceDateYMD === ev.dateYMD ? { ...o, __isOccurrence:false } : o);
}

export default function useSchedule(){
  const [selectedDate, setSelectedDate] = useState(()=> formatYMD(new Date()));
  const [events, setEvents] = useState(()=> {
    try{
      const raw = localStorage.getItem('planit.events.v2');
      return raw ? JSON.parse(raw) : [];
    }catch{return [];}
  });
  const dragSourceRef = useRef(null);

  const persist = (next) => {
    setEvents(next);
    try{ localStorage.setItem('planit.events.v2', JSON.stringify(next)); }catch{}
  };

  const addEvent = useCallback((dateObj, title, time, repeat, category='etc')=>{
    const ymd = formatYMD(dateObj);
    const ev = {
      id: uid(),
      title, time, dateYMD: ymd, category,
      repeat: repeat || { freq:'none' },
      done: false,
      exceptions: {}, // { [ymd]: { done:boolean } }
      createdAt: Date.now(),
    };
    persist([...events, ev]);
  }, [events]);

  const removeEvent = useCallback((id)=>{
    persist(events.filter(e => e.id !== id));
  }, [events]);

  const reorderEvent = useCallback((dateYMD, from, to)=>{
    const base = events.filter(e => e.dateYMD === dateYMD);
    const others = events.filter(e => e.dateYMD !== dateYMD);
    const arr = [...base];
    const [moved] = arr.splice(from,1);
    arr.splice(to,0,moved);
    persist([...others, ...arr]);
  }, [events]);

  const getEventsByDate = useCallback((dateObj)=>{
    const ymdTarget = formatYMD(dateObj);
    const flat = [];
    events.forEach(ev => {
      const occs = expandOccurrences(ev);
      occs.forEach(o => {
        const d = o.__occurrenceDateYMD || o.dateYMD;
        if (d !== ymdTarget) return;
        const ex = ev.exceptions?.[d];
        const done = typeof ex?.done === 'boolean' ? ex.done : (o.__isOccurrence ? ev.done : ev.done);
        flat.push({ ...o, done, ymd:d });
      });
    });
    const order = events.filter(e => e.dateYMD === ymdTarget).map(e => e.id);
    flat.sort((a,b)=>{
      const ai = order.indexOf(a.id), bi = order.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return flat;
  }, [events]);

  const toggleEventDone = useCallback((ev, done, occurrenceYMD)=>{
    persist(events.map(e => {
      if (e.id !== ev.id) return e;
      const next = { ...e };
      const occ = occurrenceYMD || e.dateYMD;
      if (occ && occ !== e.dateYMD){
        next.exceptions = { ...(e.exceptions||{}), [occ]: { ...(e.exceptions?.[occ]||{}), done } };
      } else {
        next.done = done;
      }
      return next;
    }));
  }, [events]);

  const countsByDateForMonth = useCallback((selectedYMD)=>{
    const d = new Date(selectedYMD);
    const y = d.getFullYear(), m = d.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);

    const map = {};
    for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate()+1)){
      const ymd = formatYMD(cur);
      map[ymd] = { pending:0, done:0 };
    }
    events.forEach(ev=>{
      expandOccurrences(ev).forEach(o=>{
        const ymd = o.__occurrenceDateYMD || o.dateYMD;
        if (!(ymd in map)) return;
        const ex = ev.exceptions?.[ymd];
        const done = typeof ex?.done === 'boolean' ? ex.done : (o.__isOccurrence ? ev.done : ev.done);
        if (done) map[ymd].done += 1;
        else map[ymd].pending += 1;
      });
    });
    return map;
  }, [events]);

  const getDueNow = useCallback(()=>{
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const t = `${hh}:${mm}`;
    return getEventsByDate(now).filter(ev => !ev.done && ev.time && ev.time.slice(0,5) === t);
  }, [getEventsByDate]);

  const exportEvents = useCallback(()=> events, [events]);
  const importEvents = useCallback((data)=>{
    if (!Array.isArray(data)) return;
    const cleaned = data.map(d=>({
      id: d.id || uid(),
      title: d.title || '',
      time: d.time || '',
      dateYMD: d.dateYMD,
      category: d.category || 'etc',
      repeat: d.repeat || { freq:'none' },
      done: !!d.done,
      exceptions: d.exceptions || {},
      createdAt: d.createdAt || Date.now()
    })).filter(d => d.dateYMD && d.title);
    persist(cleaned);
  }, []);

  return {
    selectedDate, setSelectedDate,
    addEvent, removeEvent, reorderEvent, toggleEventDone,
    getEventsByDate, countsByDateForMonth,
    getDueNow,
    exportEvents, importEvents,
    dragSourceRef,
  };
}
