import TodoItem from './TodoItem';

export default function TodoList({ items = [], onToggle, onRemove, onEdit }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return <div className="badge">항목이 없습니다</div>;

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
