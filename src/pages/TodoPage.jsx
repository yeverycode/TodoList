// src/pages/TodoPage.jsx
import { useEffect, useMemo, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';

import '../styles/base.css';
import '../styles/app.css';
import '../styles/detail.css'; // 이 파일에 아래 제공 CSS를 붙여넣으세요.

import useTodos from '../hooks/useTodos';
import TodoInput from '../components/todo/TodoInput';
import TodoToolbar from '../components/todo/TodoToolbar';
import TodoList from '../components/todo/TodoList';

// import logo from '../assets/momentum-logo.png';

export default function TodoPage() {
  const h1Ref = useRef(null);
  const {
    todos, filtered, filter, query, stats,
    setFilter, setQuery,
    addTodo, removeTodo, toggleTodo, editTodo, clearDone, toggleAll, importTodos,
  } = useTodos();

  const { total = 0, done = 0, active = Math.max(0, (stats?.total ?? 0) - (stats?.done ?? 0)) } = stats || {};
  const pct = useMemo(() => (total > 0 ? Math.round((done / total) * 100) : 0), [done, total]);
  const dashOffset = useMemo(() => 100 - pct, [pct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();
  }, []);

  return (
    <>
      <OneHeader />

      <main className="detail">
        {/* 헤더 */}
        <header className="detail-head">
          {/* <div className="logo" aria-hidden="true">
            <img src={logo} alt="" />
          </div> */}
          <h1 tabIndex={-1} ref={h1Ref}>오늘의 할 일</h1>
          <span className="eyebrow">TODAY</span>
        </header>

        {/* 입력 + 툴바 */}
        <section className="panel" aria-label="빠른 추가 및 필터">
          <div className="quickbar" role="group" aria-label="빠른 할 일 추가">
            <TodoInput onAdd={addTodo} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <TodoToolbar
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              stats={{ total, done, active, rate: pct }}
              clearDone={clearDone}
              toggleAll={toggleAll}
              exportData={() => todos}
              importData={importTodos}
            />
          </div>
        </section>

        {/* 진행률 + 리스트 */}
        <section className="grid-2" style={{ marginTop: 16 }}>
          <article className="panel" aria-label="오늘 진행 상황">
            <h2 className="hl">오늘 진행률</h2>
            <div className="ring" aria-hidden="true">
              <svg viewBox="0 0 36 36">
                <path className="bg" d="M18 2a16 16 0 1 1 0 32A16 16 0 1 1 18 2" />
                <path
                  className="fg"
                  d="M18 2a16 16 0 1 1 0 32A16 16 0 1 1 18 2"
                  style={{ strokeDashoffset: dashOffset }}
                />
              </svg>
              <div className="ring__label">
                <strong>{pct}%</strong>
                <span className="muted">완료</span>
              </div>
            </div>

            <ul className="legend" style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 12 }}>
              <li>완료 {done}</li>
              <li className="muted">진행 {active}</li>
              <li className="muted">총 {total}</li>
            </ul>
          </article>

          <article className="panel" aria-label="체크리스트">
            <h2 className="hl">체크리스트</h2>
            <TodoList
              items={filtered}
              onToggle={toggleTodo}
              onRemove={removeTodo}
              onEdit={editTodo}
            />
          </article>
        </section>
      </main>

      <OneFooter />
    </>
  );
}
