import { downloadJSON, readJSONFile, loadTodos, loadEvents, saveTodos, saveEvents } from '../../services/jsonStore';
import { useEffect, useState } from 'react';

const HISTORY_KEY = 'planit.backup.history.v1';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}
function pushHistory(type, info) {
  const h = loadHistory();
  const item = { id: Date.now(), type, info, at: new Date().toISOString() };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([item, ...h].slice(0, 20)));
}

export default function BackupPanel() {
  const [history, setHistory] = useState(loadHistory());

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const exportAll = () => {
    const data = {
      todos: loadTodos(),
      events: loadEvents(),
      exportedAt: new Date().toISOString(),
    };
    downloadJSON(data, `planit-backup-${new Date().toISOString().slice(0,10)}.json`);
    pushHistory('export', { todos: data.todos.length, eventsDates: Object.keys(data.events || {}).length });
    setHistory(loadHistory());
  };

  const importAll = async (file) => {
    try {
      const json = await readJSONFile(file);
      if (json.todos) saveTodos(json.todos);
      if (json.events) saveEvents(json.events);
      pushHistory('import', { todos: json.todos?.length ?? 0, eventsDates: Object.keys(json.events || {}).length });
      setHistory(loadHistory());
      alert('가져오기 완료! 페이지를 새로고침하면 목록이 반영돼요.');
    } catch (e) {
      alert('가져오기에 실패했어요. JSON 파일을 확인해주세요.');
    }
  };

  const clearAll = () => {
    if (!window.confirm('모든 로컬 데이터(할 일/일정)를 삭제할까요? 이 작업은 되돌릴 수 없어요.')) return;
    saveTodos([]);
    saveEvents({});
    pushHistory('clear', {});
    setHistory(loadHistory());
    alert('삭제 완료! 페이지를 새로고침하면 빈 상태로 시작합니다.');
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>데이터 백업/복원</h2>
      </div>
      <div className="row">
        <button className="btn outline" onClick={exportAll}>전체 내보내기(JSON)</button>
        <label className="btn">
          가져오기(JSON)
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && importAll(e.target.files[0])}
          />
        </label>
        <button className="btn" onClick={clearAll}>모든 데이터 삭제</button>
      </div>

      <h3 className="sub">기록</h3>
      {history.length === 0 && <p className="muted">기록이 아직 없습니다.</p>}
      <ul className="history">
        {history.map(item => (
          <li key={item.id}>
            <span className={`tag ${item.type}`}>{item.type}</span>
            <span className="time">{new Date(item.at).toLocaleString()}</span>
            <span className="info">
              {item.type === 'export' && `내보내기 (todos: ${item.info.todos}, eventDates: ${item.info.eventsDates})`}
              {item.type === 'import' && `가져오기 (todos: ${item.info.todos}, eventDates: ${item.info.eventsDates})`}
              {item.type === 'clear' && '모든 데이터 삭제'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
