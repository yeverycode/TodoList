import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoImg from '../assets/momentum-logo.png'; // 로고 이미지 경로 수정

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
    <header className={`one-header compact ${shrink ? 'shrink' : ''}`}>
      <div
        className="one-header__inner"
        style={{
          height: '60px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start', // 왼쪽부터 배치
          gap: '8px',
        }}
      >
        {/* 로고 + 브랜드명 */}
        <Link
          className="logo"
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <img
            src={logoImg}
            alt="Momentum"
            style={{ height: '32px', width: 'auto', display: 'block' }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--gray)',
              lineHeight: 1
            }}
          >
            Momentum
          </span>
        </Link>

        {/* 내비게이션 */}
        <nav
          className="nav"
          aria-label="Primary"
          style={{ display: 'flex', gap: '8px' }}
        >
          <Link
            className={isActive('/todos') ? 'active' : ''}
            to="/todos"
            style={{ padding: '4px 6px' }}
          >
            오늘의 할 일
          </Link>
          <Link
            className={isActive('/schedule') ? 'active' : ''}
            to="/schedule"
            style={{ padding: '4px 6px' }}
          >
            일정
          </Link>
          <Link
            className={isActive('/mypage') ? 'active' : ''}
            to="/mypage"
            style={{ padding: '4px 6px' }}
          >
            마이페이지
          </Link>
        </nav>

        {/* 우측 버튼 */}
        <div
          className="auth"
          style={{
            marginLeft: 'auto', // 오른쪽 끝으로 밀기
            display: 'flex',
            gap: 10
          }}
        >
          <Link className="btn outline" to="/signup">회원가입</Link>
          <Link className="btn solid" to="/login">로그인</Link>
        </div>
      </div>
    </header>
  );
}
