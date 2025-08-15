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
    <div className="todo-toolbar">
      <div className="left">
        <div className="filters" role="tablist" aria-label="필터">
          <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>전체</button>
          <button className={filter==='active'?'active':''} onClick={()=>setFilter('active')}>진행중</button>
          <button className={filter==='done'?'active':''} onClick={()=>setFilter('done')}>완료</button>
        </div>
        <button className="btn" onClick={()=>toggleAll(true)}>전부 완료</button>
        <button className="btn" onClick={clearDone}>완료 비우기</button>
      </div>

      <div className="right">
        <input
          className="search"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="검색..."
          aria-label="할 일 검색"
        />
        <button className="btn outline" onClick={onExport}>내보내기</button>
        <button className="btn solid" onClick={onImportPick}>불러오기</button>
        <input type="file" accept="application/json" ref={fileRef} onChange={onImportFile} hidden />
      </div>

      <div className="stats">
        총 {stats.total}개 · 진행중 {stats.active} · 완료 {stats.done} · 완료율 {stats.rate}%
      </div>
    </div>
  );
}
