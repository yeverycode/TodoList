import { useEffect, useMemo, useState } from 'react';
import { loadTodos, saveTodos } from '../services/jsonStore';
import { v4 as uuid } from 'uuid';

const ensureArray = (v) => Array.isArray(v) ? v : [];

export default function useTodos() {
  const [todos, setTodos] = useState(() => ensureArray(loadTodos()));
  const [filter, setFilter] = useState('all'); // all | active | done
  const [query, setQuery] = useState('');      // 검색어

  // 저장
  useEffect(() => {
    saveTodos(ensureArray(todos));
  }, [todos]);

  // CRUD
  const addTodo = (title) => {
    const t = title?.trim();
    if (!t) return;
    setTodos((prev) => [...ensureArray(prev), { id: uuid(), title: t, done: false, createdAt: Date.now() }]);
  };
  const removeTodo = (id) => setTodos((prev) => ensureArray(prev).filter((t) => t.id !== id));
  const toggleTodo = (id) => setTodos((prev) => ensureArray(prev).map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const editTodo = (id, title) => {
    const t = title?.trim();
    if (!t) return;
    setTodos((prev) => ensureArray(prev).map((x) => x.id === id ? { ...x, title: t } : x));
  };
  const clearDone = () => setTodos((prev) => ensureArray(prev).filter((t) => !t.done));
  const toggleAll = (checked) => setTodos((prev) => ensureArray(prev).map((t) => ({ ...t, done: !!checked })));

  // 외부에서 불러오기(검증)
  const importTodos = (arr) => {
    const list = ensureArray(arr)
      .filter(x => x && typeof x === 'object' && typeof x.title === 'string')
      .map(x => ({
        id: x.id || uuid(),
        title: String(x.title),
        done: !!x.done,
        createdAt: x.createdAt || Date.now(),
      }));
    setTodos(list);
  };

  // 검색/필터
  const filtered = useMemo(() => {
    const base = ensureArray(todos).filter(t => {
      if (!query.trim()) return true;
      return t.title.toLowerCase().includes(query.trim().toLowerCase());
    });
    if (filter === 'active') return base.filter(t => !t.done);
    if (filter === 'done')   return base.filter(t =>  t.done);
    return base;
  }, [todos, filter, query]);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    const active = total - done;
    const rate = total ? Math.round((done / total) * 100) : 0;
    return { total, done, active, rate };
  }, [todos]);

  return {
    // state
    todos, filtered, filter, query, stats,
    // setters
    setFilter, setQuery,
    // actions
    addTodo, removeTodo, toggleTodo, editTodo, clearDone, toggleAll, importTodos,
  };
}
