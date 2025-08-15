// src/components/todo/TodoList.jsx
import TodoItem from './TodoItem';

export default function TodoList({ items = [], onToggle, onRemove, onEdit }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) {
    return <div className="badge">할 일이 없어요. 상단 입력창에서 추가해보세요!</div>;
  }

  return (
    <div className="todo-list">
      {list.map((it) => (
        <TodoItem
          key={it.id}
          item={it}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
