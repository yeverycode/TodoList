// src/pages/MyPage.jsx
import { useEffect, useMemo, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';

import '../styles/base.css';
import '../styles/app.css';
import '../styles/detail.css'; // 상세 페이지 전용 스타일(타이포/패널/그리드/버튼 등)
import '../styles/mypage.css';

import useTodos from '../hooks/useTodos';
import useSchedule from '../hooks/useSchedule';

import ProfileCard from '../components/mypage/ProfileCard';
import StatsBlock from '../components/mypage/StatsBlock';
import BackupPanel from '../components/mypage/BackupPanel';

// import logo from '../assets/momentum-logo.png';

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

      <main className="detail">
        {/* 상단 강조 헤더 */}
        <header className="detail-head">
          {/* <div className="logo" aria-hidden="true">
            <img src={logo} alt="" />
          </div> */}
          <h1 tabIndex={-1} ref={h1Ref}>마이페이지</h1>
          <span className="eyebrow">MYPAGE</span>
        </header>

        {/* 설명 문구 제거됨 */}

        {/* 보드형 2열 레이아웃 */}
        <section className="mypage-grid" aria-label="마이페이지 콘텐츠">
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
        </section>
      </main>

      <OneFooter />
    </>
  );
}
