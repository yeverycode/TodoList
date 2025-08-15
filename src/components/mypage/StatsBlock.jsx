export default function StatsBlock({ total, done, open, rate, days = [], eventTotal }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>진행 통계</h2>
        <span className="badge">실시간</span>
      </div>

      <div className="stats-tiles">
        <div className="tile">
          <div className="k">전체 할 일</div>
          <div className="v">{total}</div>
        </div>
        <div className="tile">
          <div className="k">완료</div>
          <div className="v">{done}</div>
        </div>
        <div className="tile">
          <div className="k">진행중</div>
          <div className="v">{open}</div>
        </div>
        <div className="tile">
          <div className="k">완료율</div>
          <div className="v">{rate}%</div>
        </div>
        <div className="tile">
          <div className="k">총 일정</div>
          <div className="v">{eventTotal}</div>
        </div>
      </div>

      <div className="mini-chart" aria-label="최근 7일 완료 개수">
        {days.map((d) => (
          <div key={d.date} className="bar">
            <div className="bar__fill" style={{ height: `${Math.min(d.count * 20, 100)}%` }} />
            <div className="bar__label">{d.date.slice(5)}</div>
          </div>
        ))}
        {days.length === 0 && <p className="muted">표시할 데이터가 없습니다</p>}
      </div>
      <p className="muted small">※ 항목에 <code>doneAt</code>(YYYY-MM-DD)이 있을 때 최근 7일 막대가 집계돼요.</p>
    </section>
  );
}
