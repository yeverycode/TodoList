// ===== src/pages/OnePage.jsx =====
import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';
import '../styles/onepage.css';

// SVG 아이콘
const BoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.9 4.1C20.8 5 21 6.2 21 7.5c0 1.4-1 2.5-2.1 2.5H13c-.6 0-1 .4-1 1s.4 1 1 1h5.9c1.1 0 2.1 1.1 2.1 2.5s-1 2.5-2.1 2.5H14a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1h4.9c1.1 0 2.1 1.1 2.1 2.5s-1 2.5-2.1 2.5H3" />
    <path d="M6 16.5c0-1.2.9-2.2 2.1-2.2H12a1 1 0 0 0 1-1v0a1 1 0 0 0-1-1H8.1C6.9 12.3 6 11.3 6 10s.9-2.2 2.1-2.2H12a1 1 0 0 0 1-1v0a1 1 0 0 0-1-1H8.1C6.9 5.8 6 4.8 6 3.5" />
  </svg>
);
const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);
const SadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </svg>
);

export default function OnePage(){
  return (
    <>
      <OneHeader />

      {/* HERO — 섹션들과 동일한 컨텐츠 기반 높이 */}
      <section className="hero" id="home" aria-label="intro">
        {/* 배경 블롭 */}
        <svg className="hero__blob" viewBox="0 0 600 600" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--g1-a)"/>
              <stop offset="100%" stopColor="var(--g1-b)"/>
            </linearGradient>
          </defs>
          <path fill="url(#g1)" d="M441 87c49 36 83 105 77 173s-55 132-110 174c-56 42-117 59-169 45-52-13-95-57-116-111-20-54-17-118 16-170 33-52 94-92 159-105 66-13 136-2 143-6z"/>
        </svg>

        <div className="hero__inner container">
          <h1 className="hero__title">
            하루의 흐름을 단순하게.<br/>
            <strong className="text-gradient">Momentum</strong> 으로 정리해요.
          </h1>
          <p className="hero__subtitle">투두 · 일정 · 마이페이지 — 하나로 충분합니다.</p>
          <div className="hero__cta">
            <a href="#features" className="btn solid">핵심 기능 보기</a>
            <a href="#cta" className="btn outline">지금 시작하기</a>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section alt" id="why" aria-label="why">
        <div className="container">
          <h2 className="section__title">Momentum 이 사랑받는 이유</h2>
          <p className="section__desc">복잡한 설정 없이, 오늘 할 일과 일정, 내 기록을 부드럽게 잇습니다.</p>
          <div className="grid3">
            <div className="card tilt">
              <div className="dot"><BoomIcon/></div>
              <h3>가벼운 시작</h3>
              <p>앱 열자마자 오늘에 집중. 필요 없는 건 최소화했어요.</p>
            </div>
            <div className="card tilt">
              <div className="dot"><QuestionIcon/></div>
              <h3>선명한 우선순위</h3>
              <p>중요도/완료상태 기준으로 보기만 바꿔도 답이 보여요.</p>
            </div>
            <div className="card tilt">
              <div className="dot"><SadIcon/></div>
              <h3>하루를 하나로</h3>
              <p>투두와 일정, 내 활동 기록을 한 흐름으로 묶었습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features" aria-label="features">
        <div className="container features">
          {/* 1) 오늘의 할 일 */}
          <article className="feature">
            <div className="feature__text">
              <span className="eyebrow">오늘의 할 일</span>
              <h2>한 번에 보이는 오늘</h2>
              <p className="muted">체크리스트와 진행률, 오늘만을 위한 가벼운 뷰. 실행에 바로 들어갈 수 있어요.</p>
              <div className="feature__ctas">
                <a href="/todos" className="btn solid">상세 보기</a>
                <a href="#cta" className="btn outline">지금 시작하기</a>
              </div>
            </div>

            <div className="snapshot browser elevate">
              <div className="browser__bar">
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <div className="addr">today.momentum.app</div>
              </div>

              <div className="snapshot__body todo-snap">
                {/* 원형 진행률: CSS 변수 --progress (0~100)로 제어 */}
                <div className="ring" style={{'--progress': 76}} aria-label="오늘 진행률 76%" role="img">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="bg" cx="60" cy="60" r="52" pathLength="100" />
                    <circle className="fg" cx="60" cy="60" r="52" pathLength="100" />
                  </svg>
                  <div className="ring__label">
                    <strong>76%</strong>
                    <span>오늘 진행률</span>
                  </div>
                </div>

                {/* 수평 프로그레스바(선택) */}
                <div className="hbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={76}>
                  <div className="hbar__fill" style={{width:'76%'}} />
                </div>

                <ul className="list">
                  <li className="done"><input type="checkbox" defaultChecked /> 슬라이드 점검</li>
                  <li><input type="checkbox" /> 알고리즘 과제</li>
                  <li><input type="checkbox" /> 헬스장 30분</li>
                  <li><input type="checkbox" /> 동아리 면접</li>
                </ul>
              </div>
            </div>
          </article>

          {/* 2) 일정 */}
          <article className="feature reverse">
            <div className="feature__text">
              <span className="eyebrow">일정</span>
              <h2>달력과 타임라인, 더 단순하게</h2>
              <p className="muted">날짜를 고르면 하루의 시간표가 펼쳐집니다. 추가·삭제는 세부 페이지에서 가볍게.</p>
              <div className="feature__ctas">
                <a href="/schedule" className="btn solid">상세 보기</a>
                <a href="#cta" className="btn outline">지금 시작하기</a>
              </div>
            </div>

            <div className="snapshot phone elevate">
              <div className="phone__notch" />
              <div className="snapshot__body calendar-snap">
                <div className="mini-cal">
                  <div className="mini-cal__head"><div className="title">2025.08</div></div>
                  <div className="mini-cal__grid">
                    {['일','월','화','수','목','금','토'].map(d => <div key={d} className="dow">{d}</div>)}
                    {Array.from({length:31},(_,i)=>i+1).map(n => (
                      <div key={n} className={`cell ${n===12?'is-today':''} ${[5,12,23].includes(n)?'has-dot':''}`}>{n}</div>
                    ))}
                  </div>
                </div>

                <ul className="timeline">
                  <li><time>10:00</time><div><strong>스탠드업</strong><p className="muted">Google Meet · 15분</p></div></li>
                  <li><time>13:30</time><div><strong>UI 리팩토링</strong><p className="muted">컴포넌트 정리</p></div></li>
                  <li><time>18:00</time><div><strong>운동</strong><p className="muted">헬스장</p></div></li>
                </ul>
              </div>
            </div>
          </article>

          {/* 3) 마이페이지 */}
          <article className="feature">
            <div className="feature__text">
              <span className="eyebrow">마이페이지</span>
              <h2>내 기록이 만드는 루틴</h2>
              <p className="muted">완료율과 연속 실행일, 백업 히스토리로 꾸준함을 시각화합니다.</p>
              <div className="feature__ctas">
                <a href="/mypage" className="btn solid">상세 보기</a>
                <a href="#cta" className="btn outline">지금 시작하기</a>
              </div>
            </div>

            <div className="snapshot board elevate">
              <div className="card profile glass">
                <div className="avatar" />
                <div className="meta">
                  <strong>조예인</strong>
                  <span className="muted">AI Engineering · Sookmyung</span>
                </div>
              </div>
              <div className="card stats glass">
                <div><div className="num">84%</div><div className="label">월간 완료율</div></div>
                <div><div className="num">8일</div><div className="label">연속 실행</div></div>
                <div><div className="num">132</div><div className="label">총 완료</div></div>
              </div>
              <div className="card history glass">
                <ul>
                  <li><span className="badge">백업</span> 2025-08-10 <span className="muted">todo-0810</span></li>
                  <li><span className="badge alt">복원</span> 2025-08-07 <span className="muted">events-0807</span></li>
                  <li><span className="badge">백업</span> 2025-08-01 <span className="muted">all-0801</span></li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA — 그라데이션 섹션 */}
      <section className="section gradient cta-gradient" id="cta" aria-label="cta">
        <div className="container cta-final">
          <h2>지금, 하루를 정리해보세요</h2>
          <p className="muted">시작은 가볍게. 꾸준함은 Momentum이 도와줄게요.</p>
          <div className="cta-row">
            <a href="/signup" className="btn solid">무료로 시작하기</a>
            <a href="/docs" className="btn outline">기능 살펴보기</a>
          </div>
        </div>
      </section>

      <OneFooter />
    </>
  );
}
