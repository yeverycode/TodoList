// src/pages/TodoPage.jsx
import { useEffect, useRef } from 'react';
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';
import '../styles/base.css';
import '../styles/app.css';

import useTodos from '../hooks/useTodos';
import TodoInput from '../components/todo/TodoInput';
import TodoToolbar from '../components/todo/TodoToolbar';
import TodoList from '../components/todo/TodoList';

export default function TodoPage() {
  const h1Ref = useRef(null);
  const {
    todos, filtered, filter, query, stats,
    setFilter, setQuery,
    addTodo, removeTodo, toggleTodo, editTodo, clearDone, toggleAll, importTodos,
  } = useTodos();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();
  }, []);

  return (
    <>
      <OneHeader />
      <main className="section">
        <div className="container">
          <h1 tabIndex={-1} ref={h1Ref}>오늘의 할 일</h1>

          <TodoInput onAdd={addTodo} />

          <TodoToolbar
            filter={filter}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
            stats={stats}
            clearDone={clearDone}
            toggleAll={toggleAll}
            exportData={() => todos}
            importData={importTodos}
          />

          <TodoList
            items={filtered}
            onToggle={toggleTodo}
            onRemove={removeTodo}
            onEdit={editTodo}
          />
        </div>
      </main>
      <OneFooter />
    </>
  );
}
