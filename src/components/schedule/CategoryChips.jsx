// src/components/schedule/CategoryChips.jsx
import { useMemo, useState } from 'react';

export default function CategoryChips({
  value = 'all',
  onChange,
  options = [],
  onAddCategory,
}) {
  const [draft, setDraft] = useState('');
  const chips = useMemo(() => [{ value: 'all', label: '전체' }, ...options], [options]);

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onAddCategory?.(v);
    setDraft('');
  };
  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="chips-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', margin: '8px 0 12px' }}>
      {/* 기존 칩들 */}
      <div className="filters" role="tablist" aria-label="카테고리 필터" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {chips.map((opt) => (
          <button
            key={opt.value}
            className={value === opt.value ? 'active' : ''}
            onClick={() => onChange(opt.value)}
            role="tab"
            aria-selected={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 인라인 추가 입력 + 버튼 (칩 바로 옆) */}
      <div className="addwrap" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          className="input input--chip"
          placeholder="새 카테고리"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          style={{ width: 140 }}
        />
        <button className="btn btn--chip" onClick={add}>추가</button>
      </div>
    </div>
  );
}
