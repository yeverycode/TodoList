// src/components/schedule/EventInput.jsx
import { useState, useMemo } from 'react';

export default function EventInput({ selectedDate, onAdd, categoryOptions=[] }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [freq, setFreq] = useState('none');      // none|daily|weekly|monthly
  const [interval, setInterval] = useState(1);
  const [until, setUntil] = useState('');        // YYYY-MM-DD
  const [category, setCategory] = useState(categoryOptions[0]?.value || 'study');

  const options = useMemo(() => categoryOptions.length
    ? categoryOptions
    : [{ value:'study', label:'공부' }, { value:'workout', label:'운동' }, { value:'parttime', label:'알바' }, { value:'etc', label:'기타' }]
  , [categoryOptions]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const repeat =
      freq === 'none' ? { freq: 'none' } : { freq, interval: Number(interval)||1, until: until || undefined };
    onAdd?.(new Date(selectedDate), title.trim(), time, repeat, category);
    setTitle(''); setTime('');
  };

  return (
    <form className="event-input" onSubmit={submit}>
      <input type="time" aria-label="시간" value={time} onChange={(e)=>setTime(e.target.value)} />
      <input
        aria-label="제목"
        placeholder="무엇을 해야하나요?"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />
      <div className="repeat">
        <select aria-label="카테고리" value={category} onChange={(e)=>setCategory(e.target.value)}>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select aria-label="반복 주기" value={freq} onChange={(e)=>setFreq(e.target.value)}>
          <option value="none">반복 없음</option>
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
        </select>
        {freq!=='none' && (
          <>
            <label className="inline" style={{display:'inline-flex', alignItems:'center', gap:6}}>
              매
              <input type="number" min="1" value={interval} onChange={(e)=>setInterval(e.target.value)} />
              회 간격
            </label>
            <input type="date" aria-label="반복 종료" value={until} onChange={(e)=>setUntil(e.target.value)} placeholder="종료일(선택)" />
          </>
        )}
      </div>
      <button type="submit" className="btn solid">추가</button>
    </form>
  );
}
