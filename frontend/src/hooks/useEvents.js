import { useMemo, useState } from 'react';
import { formatYMD } from '../utils/date';
import { v4 as uuid } from 'uuid';

function expandOccurrences(ev, rangeYMD) {
  // 단순 전개: 현재 달 중심으로 반복 발생일을 펼쳐서 반환
  // rangeYMD = { start:'YYYY-MM-DD', end:'YYYY-MM-DD' } (옵션)
  const base = [{
    ...ev,
    __isOccurrence: false,
    __occurrenceDateYMD: ev.dateYMD,
  }];

  if (!ev.repeat || ev.repeat.freq === 'none') return base;

  const until = ev.repeat.until || ev.dateYMD;
  const start = new Date(ev.dateYMD);
  const end = new Date(until);

  const out = [];
  const push = (d) => out.push({
    ...ev,
    __isOccurrence: true,
    __occurrenceDateYMD: formatYMD(d),
  });

  let cur = new Date(start);
  // 첫 원본 포함
  push(cur);

  const step = (d) => {
    const nd = new Date(d);
    if (ev.repeat.freq === 'daily') nd.setDate(nd.getDate() + (ev.repeat.interval || 1));
    if (ev.repeat.freq === 'weekly') nd.setDate(nd.getDate() + 7 * (ev.repeat.interval || 1));
    if (ev.repeat.freq === 'monthly') nd.setMonth(nd.getMonth() + (ev.repeat.interval || 1));
    return nd;
  };

  while (true) {
    cur = step(cur);
    if (cur > end) break;
    push(cur);
  }

  // base(원본) + 발생들 합치기
  return out.map(o => o.__occurrenceDateYMD === ev.dateYMD
    ? { ...o, __isOccurrence:false }
    : o
  );
}

export default function useEvents() {
  const [events, setEvents] = useState(() => []);

  // 추가
  const addEvent = (dateObj, title, time, repeat, category='etc') => {
    const ymd = formatYMD(dateObj);
    const id = uuid();
    setEvents(prev => [...prev, {
      id, title, time, dateYMD: ymd, category,
      done: false,
      repeat: repeat || { freq:'none' },
      exceptions: {}, // 예: 특정 발생일 상태 저장용 { [ymd]: { done:true } }
    }]);
  };

  // 삭제
  const removeEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  // 완료 토글 (발생일 고려)
  const toggleEventDone = (ev, done, occurrenceYMD) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== ev.id) return e;
      const next = { ...e };
      if (occurrenceYMD && occurrenceYMD !== e.dateYMD) {
        next.exceptions = { ...(e.exceptions||{}), [occurrenceYMD]: { ...(e.exceptions?.[occurrenceYMD]||{}), done } };
      } else {
        next.done = done;
      }
      return next;
    }));
  };

  // 날짜별 정렬 (원본 날짜만 정렬)
  const reorderEvent = (dateYMD, from, to) => {
    setEvents(prev => {
      const list = prev.filter(e => e.dateYMD === dateYMD);
      const others = prev.filter(e => e.dateYMD !== dateYMD);
      const arr = [...list];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return [...others, ...arr];
    });
  };

  // 화면에 뿌릴 때: 반복 전개 + 예외 반영
  const expanded = useMemo(() => {
    const flat = [];
    events.forEach(ev => {
      const occs = expandOccurrences(ev);
      occs.forEach(o => {
        const ymd = o.__occurrenceDateYMD || o.dateYMD;
        const ex = ev.exceptions?.[ymd];
        flat.push({
          ...o,
          done: typeof ex?.done === 'boolean' ? ex.done : (o.__isOccurrence ? ev.done : ev.done),
        });
      });
    });
    return flat;
  }, [events]);

  // 달력 점수 집계
  const countsByDate = useMemo(() => {
    const map = {};
    expanded.forEach(ev => {
      const ymd = ev.__occurrenceDateYMD || ev.dateYMD;
      if (!map[ymd]) map[ymd] = { pending:0, done:0 };
      if (ev.done) map[ymd].done += 1;
      else map[ymd].pending += 1;
    });
    return map;
  }, [expanded]);

  return {
    events: expanded,
    addEvent,
    removeEvent,
    toggleEventDone,
    reorderEvent,
    countsByDate,
  };
}
