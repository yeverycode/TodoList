// src/pages/SchedulePage.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';

import '../styles/base.css';
import '../styles/app.css';
import '../styles/detail.css';
import '../styles/schedule.css';

import useSchedule from '../hooks/useSchedule';
import ScheduleToolbar from '../components/schedule/ScheduleToolbar';
import EventInput from '../components/schedule/EventInput';
import MonthCalendar from '../components/schedule/MonthCalendar';
import CategoryChips from '../components/schedule/CategoryChips';
import DayBuckets from '../components/schedule/DayBuckets';

import { requestNotifyPermission, showNotification, startDueWatcher } from '../services/notify';
import { formatYMD } from '../utils/date';

export default function SchedulePage() {
  const h1Ref = useRef(null);
  const [category, setCategory] = useState('all');

  // 초기 카테고리(라벨 그대로 사용)
  const [categories, setCategories] = useState([
    { value:'study', label:'공부' },
    { value:'workout', label:'운동' },
    { value:'parttime', label:'알바' },
    { value:'etc', label:'기타' },
  ]);
  const addCategory = (label) => {
    const trimmed = (label || '').trim();
    if (!trimmed) return;
    const exists = categories.some(c => c.label === trimmed);
    if (exists) { setCategory(trimmed); return; }
    const value = trimmed; // 라벨을 값으로 사용 (필터 매칭 간단)
    const next = [...categories, { value, label: trimmed }];
    setCategories(next);
    setCategory(value);
  };

  const {
    selectedDate, setSelectedDate,
    addEvent, removeEvent,
    getEventsByDate,
    reorderEvent, dragSourceRef,
    getDueNow,
    toggleEventDone,
    countsByDateForMonth, // { [ymd]: { pending, done } }
  } = useSchedule();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();

    requestNotifyPermission();

    const stop = startDueWatcher(
      getDueNow,
      (ev) => {
        showNotification('일정 알림', {
          body: `${ev.time || ''} ${ev.title}`.trim(),
          tag: `${ev.ymd}-${ev.id}`,
        });
      },
      30000
    );
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countsByDate = useMemo(
    () => countsByDateForMonth(selectedDate),
    [selectedDate, countsByDateForMonth]
  );

  const todaysEventsAll = useMemo(
    () => getEventsByDate(new Date(selectedDate)),
    [selectedDate, getEventsByDate]
  );

  const todaysEvents = useMemo(() => {
    if (category === 'all') return todaysEventsAll;
    // value와 label이 동일한 구조를 허용하므로 둘 다 체크
    return todaysEventsAll.filter(ev => ev.category === category || ev.category === categories.find(c=>c.value===category)?.label);
  }, [todaysEventsAll, category, categories]);

  const dateObj = new Date(selectedDate);
  const dateLabel = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${['일','월','화','수','목','금','토'][dateObj.getDay()]})`;

  const jumpToday = () => setSelectedDate(formatYMD(new Date()));
  const onToggleDone = (ev) => {
    const occYMD = ev.__occurrenceDateYMD;
    toggleEventDone(ev, !ev.done, occYMD);
  };

  return (
    <>
      <OneHeader />

      <main className="detail">
        <header className="detail-head">
          <h1 tabIndex={-1} ref={h1Ref}>일정</h1>
          <span className="eyebrow">SCHEDULE</span>
        </header>

        <div className="quick-actions" role="group" aria-label="빠른 액션">
          <button className="btn outline btn--sm" onClick={jumpToday} aria-label="오늘로 이동">
            오늘로 이동
          </button>
          <span className="muted qa-hint">달력에서 날짜를 클릭해 당일 일정을 관리하세요.</span>
        </div>

        {/* 좌: 달력(더 넓게) / 우: 날짜별 관리 */}
        <section className="grid-2 schedule-two-col" style={{ marginTop: 8 }}>
          <aside className="panel" aria-label="월간 달력">
            <h2 className="hl"> </h2>
            <MonthCalendar
              valueYMD={selectedDate}
              onChange={setSelectedDate}
              countsByDate={countsByDate}
            />
          </aside>

          <section className="panel" aria-label="선택한 날짜의 일정">
            <div className="panel-head" style={{ marginBottom: 10 }}>
              <h2 className="hl" style={{ marginBottom: 6 }}>{dateLabel}</h2>
            </div>

            {/* 날짜 선택만 남기고, IO 버튼 제거된 간소툴바 */}
            <ScheduleToolbar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              hideIO
            />

            {/* 입력 — 카테고리 옵션 전달 */}
            <EventInput
              selectedDate={selectedDate}
              onAdd={addEvent}
              categoryOptions={categories}
            />

            {/* 카테고리 칩 + 직접 추가 */}
            <CategoryChips
              value={category}
              onChange={setCategory}
              options={categories}
              onAddCategory={addCategory}
            />

            {/* 날짜별 버킷: 동일 높이로 정렬됨 */}
            <DayBuckets
              items={todaysEvents}
              category="all"
              onToggleDone={onToggleDone}
              onRemove={(id)=>removeEvent(id)}
              onReorder={(from,to)=>reorderEvent(selectedDate, from, to)}
              dragSourceRef={dragSourceRef}
              categoryOptions={categories}
            />
          </section>
        </section>
      </main>

      <OneFooter />
    </>
  );
}
