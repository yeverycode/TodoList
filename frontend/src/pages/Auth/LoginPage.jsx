// src/pages/Auth/LoginPage.jsx
import { useEffect, useRef, useState } from 'react';
import OneHeader from '../../components/OneHeader';
import OneFooter from '../../components/OneFooter';
import '../../styles/base.css';
import '../../styles/app.css';
import '../../styles/detail.css';
import '../../styles/mypage.css';
import '../../styles/auth.css';

export default function LoginPage() {
  const h1Ref = useRef(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.email || !form.password) {
      setErr('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || data?.message || '로그인에 실패했습니다.');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token ?? data.access_token);
      window.location.assign('/mypage');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OneHeader compact />
      <main className="detail gradient">
        <header className="detail-head">
          <h1 tabIndex={-1} ref={h1Ref}>로그인</h1>
          <span className="eyebrow">SIGN IN</span>
        </header>

        {/* 80% 폭으로 넓힌 래퍼 */}
        <section className="auth-section board elevate glass" aria-label="로그인">
          <article className="panel auth-panel">
            <h2 className="visually-hidden">로그인 폼</h2>

            <form className="form" onSubmit={submit} noValidate>
              <label>
                <span>이메일</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </label>

              <label>
                <span>비밀번호</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </label>

              {err && <p className="auth-error" role="alert">{err}</p>}

              {/* 버튼 가로 정렬 */}
              <div className="auth-btn-row">
                <button
                  type="submit"
                  className="btn solid btn--lg"
                  disabled={loading}
                >
                  {loading ? '로그인 중…' : '로그인'}
                </button>
                <a href="/signup" className="btn outline btn--lg">
                  회원가입
                </a>
              </div>
            </form>

            <p className="muted small auth-switch">
              계정이 없으신가요? <a href="/signup">지금 가입하기</a>
            </p>
          </article>
        </section>
      </main>
      <OneFooter />
    </>
  );
}
