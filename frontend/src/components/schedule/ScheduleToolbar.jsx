// src/components/schedule/ScheduleToolbar.jsx
export default function ScheduleToolbar({
  selectedDate, setSelectedDate,
  hideIO = true,               // 기본: IO 숨김
  exportData, importData,      // 레거시 호환 (미사용)
}) {
  return (
    <div className="schedule-toolbar" style={{ justifyContent:'flex-start' }}>
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

      {!hideIO && (
        <div className="right">
          <button className="btn outline" onClick={()=>exportData?.()}>내보내기</button>
          <button className="btn solid" onClick={()=>{/* 파일 입력 UI를 쓰던 기존 로직 필요 시 복원 */}}>불러오기</button>
        </div>
      )}
    </div>
  );
}
