import { useEffect, useMemo, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';
import '../styles/base.css';
import '../styles/app.css';

import useTodos from '../hooks/useTodos';
import useSchedule from '../hooks/useSchedule';

import ProfileCard from '../components/mypage/ProfileCard';
import StatsBlock from '../components/mypage/StatsBlock';
import BackupPanel from '../components/mypage/BackupPanel';

export default function MyPage() {
  const h1Ref = useRef(null);
  const { todos = [] } = useTodos() || {};
  const { events = {} } = useSchedule() || {};

  // 통계 계산
  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    const open = total - done;
    const rate = total ? Math.round((done / total) * 100) : 0;

    // 최근 7일 완료 개수 (doneAt: YYYY-MM-DD 또는 Date 가능)
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const count = todos.filter(
        t => t.doneAt && String(t.doneAt).slice(0, 10) === key
      ).length;
      return { date: key, count };
    });

    const eventDates = Object.keys(events);
    const eventTotal = eventDates.reduce(
      (acc, d) => acc + (Array.isArray(events[d]) ? events[d].length : 0),
      0
    );

    return { total, done, open, rate, days, eventTotal };
  }, [todos, events]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();
  }, []);

  return (
    <>
      <OneHeader compact />
      <main className="section">
        <div className="container">
          <h1 tabIndex={-1} ref={h1Ref}>마이페이지</h1>
          <p className="muted">프로필 관리 · 완료율 통계 · 데이터 백업/복원</p>

          <div className="mypage-grid">
            {/* 내부 컴포넌트에서 .panel/.panel-head 구조를 사용하도록 구현 */}
            <ProfileCard />

            <StatsBlock
              total={stats.total}
              done={stats.done}
              open={stats.open}
              rate={stats.rate}
              days={stats.days}
              eventTotal={stats.eventTotal}
            />

            <BackupPanel />
          </div>
        </div>
      </main>
      <OneFooter />
    </>
  );
}
