// src/pages/SchedulePage.jsx
import { useEffect, useMemo, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';

/** 스타일 분리를 적용했다면 이렇게:
 *  import '../styles/base.css';
 *  import '../styles/app.css';
 *  아직 분리 전이라면 기존 onepage.css 유지 가능 */
import '../styles/onepage.css';

import useSchedule from '../hooks/useSchedule';
import ScheduleToolbar from '../components/schedule/ScheduleToolbar';
import EventInput from '../components/schedule/EventInput';
import EventList from '../components/schedule/EventList';
import MonthCalendar from '../components/schedule/MonthCalendar';
import { requestNotifyPermission, showNotification, startDueWatcher } from '../services/notify';
import { formatYMD } from '../utils/date';

export default function SchedulePage() {
  const h1Ref = useRef(null);
  const {
    selectedDate, setSelectedDate,
    addEvent, removeEvent, getBaseEventsByDate, getEventsByDate,
    exportEvents, importEvents,
    reorderEvent, dragSourceRef,
    getDueNow,
  } = useSchedule();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();

    // 알림 권한 요청(선택)
    requestNotifyPermission();

    // 화면 열려 있을 때만 due 체크(30초 주기)
    const stop = startDueWatcher(
      getDueNow,
      (ev) => {
        showNotification('일정 알림', {
          body: `${ev.time || ''} ${ev.title}`.trim(),
          tag: `${ev.ymd}-${ev.id}`, // 중복 방지
        });
      },
      30000
    );
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 월간 뱃지: 해당 날짜 base 이벤트(반복분 제외) 개수
  const countsByDate = useMemo(() => {
    const base = {};
    const today = new Date(selectedDate);
    const y = today.getFullYear(), m = today.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const ymd = formatYMD(d);
      base[ymd] = getBaseEventsByDate(d).length;
    }
    return base;
  }, [selectedDate, getBaseEventsByDate]);

  const todaysEvents = useMemo(
    () => getEventsByDate(new Date(selectedDate)),
    [selectedDate, getEventsByDate]
  );

  return (
    <>
      <OneHeader />
      <main className="section pale">
        <div className="container">
          <h1 tabIndex={-1} ref={h1Ref}>일정</h1>
          <p className="muted">월간 달력 · 드래그 정렬 · 반복 일정 · 알림 지원</p>

          {/* 월간 달력 */}
          <MonthCalendar
            valueYMD={selectedDate}
            onChange={setSelectedDate}
            countsByDate={countsByDate}
          />

          {/* 툴바 / 입력 / 리스트 */}
          <ScheduleToolbar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            exportData={exportEvents}
            importData={importEvents}
          />

          <EventInput selectedDate={selectedDate} onAdd={addEvent} />

          <EventList
            items={todaysEvents}
            selectedDate={selectedDate}
            onRemove={removeEvent}
            onReorder={reorderEvent}
            dragSourceRef={dragSourceRef}
          />
        </div>
      </main>
      <OneFooter />
    </>
  );
}
