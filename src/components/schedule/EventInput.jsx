import { useState } from 'react';

export default function EventInput({ selectedDate, onAdd }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [freq, setFreq] = useState('none');      // none|daily|weekly|monthly
  const [interval, setInterval] = useState(1);   // 1,2,3...
  const [until, setUntil] = useState('');        // YYYY-MM-DD

  const submit = (e) => {
    e.preventDefault();
    const repeat = freq === 'none' ? { freq: 'none' } : { freq, interval: Number(interval)||1, until: until || undefined };
    onAdd?.(new Date(selectedDate), title, time, repeat);
    setTitle(''); setTime('');
  };

  return (
    <form className="event-input" onSubmit={submit}>
      <input type="time" aria-label="시간" value={time} onChange={(e)=>setTime(e.target.value)} />
      <input
        aria-label="제목"
        placeholder="일정 제목을 입력하세요 (Enter로 추가)"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />
      <div className="repeat">
        <select aria-label="반복 주기" value={freq} onChange={(e)=>setFreq(e.target.value)}>
          <option value="none">반복 없음</option>
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
        </select>
        {freq!=='none' && (
          <>
            <label className="inline">
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
