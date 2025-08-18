// src/components/schedule/DayBuckets.jsx
import React, { useMemo } from 'react';

export default function DayBuckets({
  items = [],
  category = 'all',
  onToggleDone,
  onRemove,
  onReorder,
  dragSourceRef,
}) {
  const filtered = useMemo(
    () => (category === 'all' ? items : items.filter(v => v.category === category)),
    [items, category]
  );

  const pending = filtered.filter(v => !v.done);
  const done = filtered.filter(v => v.done);

  const onDragStart = (e, index) => {
    if (!dragSourceRef) return;
    dragSourceRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onDrop = (e, index) => {
    e.preventDefault();
    if (!dragSourceRef || !onReorder) return;
    const from = dragSourceRef.current ?? -1;
    const to = index;
    if (from !== -1 && to !== -1) onReorder(from, to);
    dragSourceRef.current = null;
  };

  const Item = ({ ev, i, draggable=true }) => (
    <div
      key={`${ev.id}-${ev.__occurrenceDateYMD||''}-${i}`}
      className={`event-item ${ev.__isOccurrence ? 'occ' : ''} ${ev.done ? 'done' : ''}`}
      draggable={draggable && !ev.__isOccurrence}
      onDragStart={(e)=>onDragStart(e, i)}
      onDragOver={onDragOver}
      onDrop={(e)=>onDrop(e, i)}
      title={ev.__isOccurrence ? '반복 발생분(정렬은 원본 날짜에서 변경)' : '드래그하여 정렬'}
    >
      {/* 드래그 핸들: “:” 1개 */}
      <div className="drag-handle" aria-hidden>:</div>

      {/* 체크박스 */}
      <input
        type="checkbox"
        aria-label={ev.done ? '완료 해제' : '완료'}
        checked={!!ev.done}
        onChange={()=>onToggleDone?.(ev)}
      />

      {/* 시간: 없으면 숨김 */}
      {ev.time ? <div className="event-time">{ev.time}</div> : null}

      {/* 제목 (카테고리 배지는 완전히 숨김) */}
      <div className="event-title">
        {/* 완료 시 예쁜 체크 아이콘(스타일은 CSS) */}
        {ev.done && <span className="done-mark" aria-hidden></span>}
        <span>{ev.title}</span>
        {ev.__isOccurrence && <span className="badge" style={{marginLeft:8}}>반복</span>}
      </div>

      <button className="icon danger" onClick={()=>onRemove?.(ev.id)} aria-label="삭제">✕</button>
    </div>
  );

  return (
    <div className="day-buckets grid-2">
      <article className="panel">
        <header className="panel-head"><h2>해야 할 일</h2></header>
        <div className="event-list">
          {pending.length === 0 && <div className="badge">할 일이 없습니다</div>}
          {pending.map((ev, i)=>(<Item ev={ev} i={i} key={i} />))}
        </div>
      </article>

      <article className="panel">
        <header className="panel-head"><h2>완료됨</h2></header>
        <div className="event-list done">
          {done.length === 0 && <div className="badge">아직 완료한 일이 없어요</div>}
          {done.map((ev, i)=>(<Item ev={ev} i={i} key={i} draggable={false} />))}
        </div>
      </article>
    </div>
  );
}
