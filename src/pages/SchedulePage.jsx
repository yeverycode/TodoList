// src/pages/SchedulePage.jsx
import { useEffect, useMemo, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';

import '../styles/base.css';
import '../styles/app.css';
import '../styles/detail.css'; // 상세 페이지 전용(타이포/패널/그리드/버튼 등)

import useSchedule from '../hooks/useSchedule';
import ScheduleToolbar from '../components/schedule/ScheduleToolbar';
import EventInput from '../components/schedule/EventInput';
import EventList from '../components/schedule/EventList';
import MonthCalendar from '../components/schedule/MonthCalendar';
import { requestNotifyPermission, showNotification, startDueWatcher } from '../services/notify';
import { formatYMD } from '../utils/date';

// import logo from '../assets/momentum-logo.png';

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

  // 접근성 있는 날짜 라벨
  const dateObj = new Date(selectedDate);
  const dateLabel = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${['일','월','화','수','목','금','토'][dateObj.getDay()]})`;

  // 빠른 액션
  const jumpToday = () => {
    const now = new Date();
    setSelectedDate(formatYMD(now));
  };

  return (
    <>
      <OneHeader />

      <main className="detail">
        {/* 상단 강조 헤더 */}
        <header className="detail-head">
          {/* <div className="logo" aria-hidden="true">
            <img src={logo} alt="" />
          </div> */}
          <h1 tabIndex={-1} ref={h1Ref}>일정</h1>
          <span className="eyebrow">SCHEDULE</span>
        </header>

        {/* 안내 문구 제거, 빠른 액션만 유지 */}
        <div className="quick-actions" role="group" aria-label="빠른 액션">
          <button className="btn outline btn--sm" onClick={jumpToday} aria-label="오늘로 이동">
            오늘로 이동
          </button>
          <span className="muted qa-hint">달력에서 날짜를 클릭해 당일 일정을 관리하세요.</span>
        </div>

        {/* 2열: 왼쪽 달력 / 오른쪽 당일 일정 */}
        <section className="grid-2" style={{ marginTop: 8 }}>
          {/* 왼쪽: 월간 달력 패널 */}
          <aside className="panel" aria-label="월간 달력">
            <h2 className="hl">달력</h2>
            <MonthCalendar
              valueYMD={selectedDate}
              onChange={setSelectedDate}
              countsByDate={countsByDate}
            />
          </aside>

          {/* 오른쪽: 당일 타임라인 패널 */}
          <section className="panel" aria-label="선택한 날짜의 일정">
            <div className="panel-head" style={{ marginBottom: 10 }}>
              <h2 className="hl" style={{ marginBottom: 6 }}>{dateLabel}</h2>
            </div>

            {/* 툴바 */}
            <ScheduleToolbar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              exportData={exportEvents}
              importData={importEvents}
            />

            {/* 입력 */}
            <EventInput selectedDate={selectedDate} onAdd={addEvent} />

            {/* 리스트 */}
            <EventList
              items={todaysEvents}
              selectedDate={selectedDate}
              onRemove={removeEvent}
              onReorder={reorderEvent}
              dragSourceRef={dragSourceRef}
            />
          </section>
        </section>
      </main>

      <OneFooter />
    </>
  );
}
