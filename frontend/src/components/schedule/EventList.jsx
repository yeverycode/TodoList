import React from 'react';

export default function EventList({ items = [], selectedDate, onRemove, onReorder, dragSourceRef }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return <div className="badge">이 날짜엔 일정이 없습니다</div>;

  const onDragStart = (e, index) => {
    dragSourceRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const onDrop = (e, index) => {
    e.preventDefault();
    const from = dragSourceRef.current ?? -1;
    const to = index;
    if (from !== -1 && to !== -1 && onReorder) onReorder(new Date(selectedDate), from, to);
    dragSourceRef.current = null;
  };

  return (
    <div className="event-list">
      {list.map((ev, i) => (
        <div
          key={`${ev.id}-${i}`}
          className={`event-item ${ev.__isOccurrence ? 'occ' : ''}`}
          draggable={!ev.__isOccurrence}  /* 반복 발생분은 정렬 제외(원본에서 정렬) */
          onDragStart={(e)=>onDragStart(e, i)}
          onDragOver={onDragOver}
          onDrop={(e)=>onDrop(e, i)}
          title={ev.__isOccurrence ? '반복에서 발생한 일정(정렬은 원본 날짜에서 변경)' : '드래그하여 정렬'}
        >
          <div className="drag-handle" aria-hidden>⋮⋮</div>
          <div className="event-time">{ev.time || '—'}</div>
          <div className="event-title">
            {ev.title}
            {ev.category && <span className="cat-badge">{ev.category}</span>}
            {ev.__isOccurrence && <span className="badge" style={{marginLeft:8}}>반복</span>}
          </div>
          <button className="icon danger" onClick={()=>onRemove?.(new Date(selectedDate), ev.id)} aria-label="삭제" disabled={!!ev.__isOccurrence}>✕</button>
        </div>
      ))}
    </div>
  );
}
