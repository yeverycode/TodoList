// src/pages/Auth/SignupPage.jsx
import { useEffect, useRef, useState } from 'react';
import OneHeader from '../../components/OneHeader';
import OneFooter from '../../components/OneFooter';
import '../../styles/base.css';
import '../../styles/app.css';
import '../../styles/detail.css';
import '../../styles/mypage.css';
import '../../styles/auth.css';

export default function SignupPage() {
  const h1Ref = useRef(null);
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1Ref.current?.focus();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErr('');
    setOk('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    if (!form.email || !form.password) return setErr('이메일과 비밀번호를 입력해주세요.');
    if (form.password.length < 8) return setErr('비밀번호는 8자 이상이어야 합니다.');
    if (form.password !== form.confirm) return setErr('비밀번호가 일치하지 않습니다.');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || data?.message || '회원가입에 실패했습니다.');
      }
      setOk('회원가입이 완료되었습니다! 이제 로그인 해주세요.');
      // window.location.assign('/login');
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
          <h1 tabIndex={-1} ref={h1Ref}>회원가입</h1>
          <span className="eyebrow">SIGN UP</span>
        </header>

        {/* 80% 폭 */}
        <section className="auth-section board elevate glass" aria-label="회원가입">
          <article className="panel auth-panel">
            <h2 className="visually-hidden">회원가입 폼</h2>
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
                />
              </label>
              <label>
                <span>비밀번호</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="8자 이상"
                  required
                  minLength={8}
                />
              </label>
              <label>
                <span>비밀번호 확인</span>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="비밀번호 재입력"
                  required
                />
              </label>

              {err && <p className="auth-error" role="alert">{err}</p>}
              {ok && <p className="auth-ok" role="status">{ok}</p>}

              {/* 버튼 가로 정렬 */}
              <div className="auth-btn-row">
                <button
                  type="submit"
                  className="btn solid btn--lg"
                  disabled={loading}
                >
                  {loading ? '가입 중…' : '회원가입'}
                </button>
                <a href="/login" className="btn outline btn--lg">
                  로그인
                </a>
              </div>
            </form>
          </article>
        </section>
      </main>
      <OneFooter />
    </>
  );
}
