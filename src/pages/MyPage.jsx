import { useEffect, useMemo, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';

import '../styles/base.css';
import '../styles/app.css';
import '../styles/detail.css';
import '../styles/mypage.css';

import useTodos from '../hooks/useTodos';
import useSchedule from '../hooks/useSchedule';

import ProfileCard from '../components/mypage/ProfileCard';
import StatsBlock from '../components/mypage/StatsBlock';

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

    // 최근 7일 완료 개수
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

      <main className="detail gradient">
        {/* 상단 강조 헤더 */}
        <header className="detail-head">
          <h1 tabIndex={-1} ref={h1Ref}>마이페이지</h1>
          <span className="eyebrow">MYPAGE</span>
        </header>

        {/* Glass/Gradient 스타일 적용된 보드형 2열 레이아웃 */}
        <section className="mypage-grid board elevate glass" aria-label="마이페이지 콘텐츠">
          <ProfileCard />
          <StatsBlock
            total={stats.total}
            done={stats.done}
            open={stats.open}
            rate={stats.rate}
            days={stats.days}
            eventTotal={stats.eventTotal}
          />
        </section>
      </main>

      <OneFooter />
    </>
  );
}
