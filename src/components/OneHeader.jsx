import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function OneHeader() {
  const [shrink, setShrink] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`one-header ${shrink ? 'shrink' : ''}`}>
      <div className="one-header__inner">
        <Link className="logo" to="/">PlanIt</Link>

        <nav className="nav" aria-label="Primary">
          <Link className={isActive('/todos') ? 'active' : ''} to="/todos">오늘의 할 일</Link>
          <Link className={isActive('/schedule') ? 'active' : ''} to="/schedule">일정</Link>
          <Link className={isActive('/mypage') ? 'active' : ''} to="/mypage">마이페이지</Link>
        </nav>

        <div className="auth">
          <Link className="btn outline" to="/signup">회원가입</Link>
          <Link className="btn solid" to="/login">로그인</Link>
        </div>
      </div>
    </header>
  );
}
