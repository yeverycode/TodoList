// src/components/schedule/MonthCalendar.jsx
import { useMemo } from 'react';
import { formatYMD } from '../../utils/date';

function startOfMonth(d){ const x=new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function endOfMonth(d){ const x=new Date(d); x.setMonth(x.getMonth()+1,0); x.setHours(23,59,59,999); return x; }
function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
function getWeeks(d){
  const start = startOfMonth(d);
  const end = endOfMonth(d);
  const first = addDays(start, -((start.getDay()+6)%7)); // 월요일 시작(월=0)
  const days = [];
  for (let cur = new Date(first); cur <= addDays(end, 6-((end.getDay()+6)%7)); cur = addDays(cur,1)) {
    days.push(new Date(cur));
  }
  const weeks = [];
  for (let i=0;i<days.length;i+=7) weeks.push(days.slice(i,i+7));
  return weeks;
}

export default function MonthCalendar({ valueYMD, onChange, countsByDate }) {
  const date = useMemo(()=> new Date(valueYMD), [valueYMD]);
  const year = date.getFullYear();
  const month = date.getMonth();

  const weeks = useMemo(()=> getWeeks(date), [date]);

  const changeMonth = (delta) => {
    const d = new Date(date);
    d.setMonth(d.getMonth()+delta, 1);
    onChange?.(formatYMD(d));
  };

  const isSameDay = (a,b) => formatYMD(a) === formatYMD(b);
  const isCurMonth = (d) => d.getMonth() === month;

  return (
    <div className="monthcal">
      <div className="monthcal__head">
        <button className="btn" onClick={()=>changeMonth(-1)} aria-label="이전 달">‹</button>
        <div className="title">{year}년 {month+1}월</div>
        <button className="btn" onClick={()=>changeMonth(1)} aria-label="다음 달">›</button>
      </div>

      <div className="monthcal__grid">
        {['월','화','수','목','금','토','일'].map((w)=>(
          <div key={w} className="dow">{w}</div>
        ))}

        {weeks.map((wk, wi)=>(
          <div className="week" key={wi}>
            {wk.map((d, di)=>{
              const ymd = formatYMD(d);
              const count = countsByDate?.[ymd] || 0;
              const selected = isSameDay(d, date);
              return (
                <button
                  key={di}
                  className={`cell ${selected?'selected':''} ${isCurMonth(d)?'cur':''}`}
                  onClick={()=>onChange?.(ymd)}
                >
                  <span className="day">{d.getDate()}</span>
                  {count>0 && <span className="dot" aria-label={`${count}개의 일정`} />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
