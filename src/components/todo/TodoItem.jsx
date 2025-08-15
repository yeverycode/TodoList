// src/components/todo/TodoItem.jsx
import { useEffect, useRef, useState } from 'react';

export default function TodoItem({ item, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => {
    if (draft.trim() && draft !== item.title) onEdit?.(item.id, draft);
    setEditing(false);
  };
  const cancel = () => { setDraft(item.title); setEditing(false); };

  return (
    <div className={`todo-item ${item.done ? 'done' : ''}`}>
      <label className="chk" title="완료 토글">
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggle?.(item.id)}
          aria-label={`${item.title} 완료`}
        />
      </label>

      {!editing ? (
        <div className="title" onDoubleClick={() => setEditing(true)} title="더블클릭해서 수정">
          {item.title}
        </div>
      ) : (
        <input
          ref={inputRef}
          className="edit input"
          value={draft}
          onChange={(e)=>setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e)=>{
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
          }}
        />
      )}

      <button className="btn ghost sm" aria-label="삭제" onClick={() => onRemove?.(item.id)}>✕</button>
    </div>
  );
}
