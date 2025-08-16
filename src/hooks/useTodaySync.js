import { useEffect, useRef } from 'react';
import { formatYMD } from '../utils/date';

/**
 * @param {{
 *  events: any[],
 *  addTodo: (todo)=>void,
 *  toggleTodoDone: (id:boolean)=>void, // (id, done) or similar internal
 *  todos: any[],
 *  updateEventDone: (ev:any, done:boolean)=>void
 * }} params
 */
export default function useTodaySync({ events, addTodo, toggleTodoDone, todos, updateEventDone }) {
  const today = formatYMD(new Date());
  const hydratedRef = useRef(false);

  useEffect(() => {
    // 1) 오늘 일정 → Todo 생성 (중복 방지)
    const todaysEvents = events.filter(ev => {
      const ymd = ev.__isOccurrence ? ev.__occurrenceDateYMD : ev.dateYMD;
      return ymd === today;
    });

    todaysEvents.forEach(ev => {
      const exists = todos.some(td => td.source?.type==='event' && td.source.eventId===ev.id && td.source.ymd===today);
      if (!exists) {
        addTodo({
          title: ev.title,
          category: ev.category,
          done: !!ev.done,
          source: { type:'event', eventId: ev.id, ymd: today },
        });
      }
    });

    hydratedRef.current = true;
  }, [events, todos, addTodo, today]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    // 2) Todo 완료 상태 → Event 완료 상태 반영 (양방향)
    const todayTodosFromEvent = todos.filter(td => td.source?.type==='event' && td.source.ymd===today);
    todayTodosFromEvent.forEach(td => {
      const ev = events.find(e => e.id === td.source.eventId);
      if (!ev) return;
      if (!!ev.done !== !!td.done) {
        updateEventDone(ev, td.done); // 내부에서 발생일 고려
      }
    });
  }, [todos, events, updateEventDone, today, toggleTodoDone]);
}
