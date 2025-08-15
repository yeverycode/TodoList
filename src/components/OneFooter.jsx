export default function OneFooter() {
  return (
    <footer className="one-footer">
      <div className="one-footer__inner">
        <div className="col">
          <div className="brand">PlanIt</div>
          <p className="muted">간단한 투두 & 일정 관리 웹사이트</p>
          <p className="muted">© {new Date().getFullYear()} PlanIt. All rights reserved.</p>
        </div>
        <div className="col">
          <div className="title">바로가기</div>
          <a href="#todo">오늘의 할 일</a>
          <a href="#schedule">일정</a>
          <a href="#mypage">마이페이지</a>
        </div>
        <div className="col">
          <div className="title">도움말</div>
          <a href="https://github.com/yeverycode/TodoList" target="_blank" rel="noreferrer">GitHub</a>
          <span className="muted">문의: planit@example.com</span>
        </div>
      </div>
    </footer>
  );
}
