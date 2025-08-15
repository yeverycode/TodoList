import { useRef } from 'react';
import { downloadJSON, readJSONFile } from '../../services/jsonStore';

export default function ScheduleToolbar({
  selectedDate, setSelectedDate,
  exportData, importData
}) {
  const fileRef = useRef(null);

  const onExport = () => downloadJSON(exportData(), 'planit-events.json');
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
    <div className="schedule-toolbar">
      <div className="left">
        <label className="datepick">
          <span>날짜</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e)=>setSelectedDate(e.target.value)}
            aria-label="날짜 선택"
          />
        </label>
      </div>
      <div className="right">
        <button className="btn outline" onClick={onExport}>내보내기</button>
        <button className="btn solid" onClick={onImportPick}>불러오기</button>
        <input type="file" accept="application/json" ref={fileRef} onChange={onImportFile} hidden />
      </div>
    </div>
  );
}
