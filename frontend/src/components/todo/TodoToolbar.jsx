// src/components/todo/TodoToolbar.jsx
import { useRef } from 'react';
import { downloadJSON, readJSONFile } from '../../services/jsonStore';

export default function TodoToolbar({
  filter, setFilter, query, setQuery,
  stats, clearDone, toggleAll, exportData, importData
}) {
  const fileRef = useRef(null);

  const onExport = () => downloadJSON(exportData(), 'planit-todos.json');
  const onImportPick = () => fileRef.current?.click();
  const onImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      importData(data);
      e.target.value = '';
    } catch (err) {
      alert('JSON 파일을 읽을 수 없습니다.');
      console.error(err);
    }
  };

  return (
    <div className="todo-toolbar" style={{ width: '100%' }}>
      {/* 왼쪽: 칩 필터 + 일괄 액션 */}
      <div className="left">
        <div className="chips" role="tablist" aria-label="필터">
          <button
            className={`chip ${filter==='all' ? 'is-active' : ''}`}
            onClick={()=>setFilter('all')}
          >전체</button>
          <button
            className={`chip ${filter==='active' ? 'is-active' : ''}`}
            onClick={()=>setFilter('active')}
          >진행중</button>
          <button
            className={`chip ${filter==='done' ? 'is-active' : ''}`}
            onClick={()=>setFilter('done')}
          >완료</button>
        </div>

        <button className="btn outline sm" onClick={()=>toggleAll(true)}>전부완료</button>
        <button className="btn outline sm" onClick={clearDone}>완료삭제</button>
      </div>

      {/* 오른쪽: 검색 + 백업 */}
      <div className="right">
        <input
          className="search input"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="검색..."
          aria-label="할 일 검색"
          style={{ minWidth: 220 }}
        />
        <button className="btn outline" onClick={onExport}>내보내기</button>
        <button className="btn solid" onClick={onImportPick}>불러오기</button>
        <input type="file" accept="application/json" ref={fileRef} onChange={onImportFile} hidden />
      </div>

      {/* 통계 */}
      <div className="stats muted">
        총 {stats.total} · 진행 {stats.active} · 완료 {stats.done} · 완료율 {stats.rate}%
      </div>
    </div>
  );
}
