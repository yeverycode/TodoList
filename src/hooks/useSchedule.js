// src/hooks/useSchedule.js
import { useEffect, useRef, useState } from 'react';
import { formatYMD } from '../utils/date';
import { loadEvents, saveEvents } from '../services/jsonStore';
import { v4 as uuid } from 'uuid';

// 안전한 객체/배열 보장
const ensureObj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const ensureArr = (v) => (Array.isArray(v) ? v : []);

const makeId = () =>
  (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : uuid());

// 이벤트: { id, title, time?, order?, repeat?: { freq:'none'|'daily'|'weekly'|'monthly', interval?:number, until?: 'YYYY-MM-DD' } }
const normalizeEvent = (x) => ({
  id: x?.id || makeId(),
  title: String(x?.title || '').trim(),
  time: x?.time ? String(x.time).trim() : undefined,
  order: Number.isFinite(x?.order) ? x.order : 0,
  repeat: x?.repeat && typeof x.repeat === 'object'
    ? {
        freq: ['daily','weekly','monthly'].includes(x.repeat.freq) ? x.repeat.freq : 'none',
        interval: Number.isFinite(x.repeat.interval) && x.repeat.interval > 0 ? x.repeat.interval : 1,
        until: x.repeat.until ? formatYMD(x.repeat.until) : undefined,
      }
    : { freq: 'none', interval: 1, until: undefined },
});

const compareTimeOrder = (a, b) => {
  const ta = a.time || '';
  const tb = b.time || '';
  const tcmp = ta.localeCompare(tb);
  if (tcmp !== 0) return tcmp;
  return (a.order ?? 0) - (b.order ?? 0);
};

const addDays = (d, n) => {
  const dd = new Date(d);
  dd.setDate(dd.getDate() + n);
  return dd;
};

// 반복 일정 전개: baseDate에 등록된 반복 이벤트가 date에 발생하는지
function occursOn(date, baseDate, repeat) {
  if (!repeat || repeat.freq === 'none') return false;
  const target = new Date(date);
  const base = new Date(baseDate);
  const until = repeat.until ? new Date(repeat.until) : null;

  // until 날짜 포함
  if (until && target > addDays(until, 0)) return false;

  const interval = repeat.interval || 1;

  if (repeat.freq === 'daily') {
    const diff = Math.floor((target - base) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff % interval === 0;
  }
  if (repeat.freq === 'weekly') {
    if (target.getDay() !== base.getDay()) return false;
    const diffWeeks = Math.floor((target - base) / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks >= 0 && diffWeeks % interval === 0;
  }
  if (repeat.freq === 'monthly') {
    // 매월 같은 '일' 기준
    const sameDay = target.getDate() === base.getDate();
    if (!sameDay) return false;
    const months = (target.getFullYear() - base.getFullYear()) * 12 + (target.getMonth() - base.getMonth());
    return months >= 0 && months % interval === 0;
  }
  return false;
}

export default function useSchedule() {
  const [events, setEvents] = useState(() => ensureObj(loadEvents()));
  const [selectedDate, setSelectedDate] = useState(() => formatYMD(new Date()));
  const dragSourceRef = useRef(null); // 드래그 시작 인덱스 저장

  // 저장
  useEffect(() => {
    saveEvents(ensureObj(events));
  }, [events]);

  // CRUD
  const addEvent = (date, title, time, repeat) => {
    const t = title?.trim();
    if (!t) return;
    const d = formatYMD(date);
    const list = ensureArr(events[d]);
    const newItem = normalizeEvent({ id: makeId(), title: t, time, order: list.length, repeat });
    setEvents((prev) => ({ ...ensureObj(prev), [d]: [...list, newItem] }));
  };

  const removeEvent = (date, id) => {
    const d = formatYMD(date);
    const list = ensureArr(events[d]).filter((e) => e.id !== id);
    setEvents((prev) => ({ ...ensureObj(prev), [d]: list.map((x, i) => ({ ...x, order: i })) }));
  };

  // 해당 날짜의 "원본" 이벤트(반복 미전개)
  const getBaseEventsByDate = (date) => ensureArr(events[formatYMD(date)]).map(normalizeEvent);

  // 해당 날짜에 실제로 표시될 목록(반복 전개 포함)
  const getEventsByDate = (date) => {
    const d = new Date(date);
    const baseList = getBaseEventsByDate(d);

    // 다른 날짜의 반복 이벤트 전개
    const repeats = Object.entries(events).flatMap(([k, arr]) =>
      ensureArr(arr)
        .filter(ev => ev?.repeat && ev.repeat.freq !== 'none')
        .map(ev => ({ ev: normalizeEvent(ev), baseDay: k }))
    );

    const occFromRepeats = repeats
      .filter(({ ev, baseDay }) => occursOn(d, baseDay, ev.repeat))
      .map(({ ev }) => ({ ...ev, __isOccurrence: true }));

    const full = [...baseList, ...occFromRepeats];
    return full.sort(compareTimeOrder);
  };

  // 드래그 정렬(같은 날짜 내)
  const reorderEvent = (date, fromIndex, toIndex) => {
    const d = formatYMD(date);
    const list = ensureArr(events[d]);
    if (
      fromIndex === toIndex ||
      fromIndex < 0 || toIndex < 0 ||
      fromIndex >= list.length || toIndex >= list.length
    ) return;

    const cloned = [...list];
    const [moved] = cloned.splice(fromIndex, 1);
    cloned.splice(toIndex, 0, moved);
    const reindexed = cloned.map((x, i) => ({ ...x, order: i }));
    setEvents((prev) => ({ ...ensureObj(prev), [d]: reindexed }));
  };

  // JSON Import/Export
  const exportEvents = () => ensureObj(events);
  const importEvents = (obj) => {
    const incoming = ensureObj(obj);
    const normalized = Object.fromEntries(
      Object.entries(incoming).map(([k, arr]) => {
        const list = ensureArr(arr).map(normalizeEvent).filter(x => x.title);
        list.sort(compareTimeOrder).forEach((x, i) => (x.order = i)); // order 보정
        return [formatYMD(k), list];
      })
    );
    setEvents(normalized);
  };

  // 알림 대상 계산: 현재 HH:MM과 일치하는 이벤트
  const getDueNow = () => {
    const now = new Date();
    const ymd = formatYMD(now);
    const list = getEventsByDate(now).filter(x => x.time);
    const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    return list.filter(x => x.time === hhmm).map(x => ({ ...x, ymd }));
  };

  return {
    events, selectedDate, setSelectedDate,
    addEvent, removeEvent, getBaseEventsByDate, getEventsByDate,
    exportEvents, importEvents,
    reorderEvent, dragSourceRef,
    getDueNow,
  };
}
