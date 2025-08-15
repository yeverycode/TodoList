import { useEffect, useState } from 'react';

const PROFILE_KEY = 'planit.profile.v1';

export default function ProfileCard() {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY)) || { name: '', email: '' };
    } catch {
      return { name: '', email: '' };
    }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
    setSaved(false);
  };

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>프로필</h2>
        {saved && <span className="badge">저장됨</span>}
      </div>
      <form className="form" onSubmit={save}>
        <label>
          <span>이름</span>
          <input name="name" value={profile.name} onChange={onChange} placeholder="홍길동" />
        </label>
        <label>
          <span>이메일</span>
          <input name="email" value={profile.email} onChange={onChange} placeholder="you@example.com" />
        </label>
        <div className="row-end">
          <button className="btn solid" type="submit">저장</button>
        </div>
      </form>
    </section>
  );
}
