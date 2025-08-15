import OneHeader from '../components/OneHeader';
import OneFooter from '../components/OneFooter';
import '../styles/onepage.css';

export default function OnePage() {
  return (
    <>
      <OneHeader />

      {/* HERO */}
      <section className="hero" id="home" aria-label="intro">
        <div className="hero__inner">
          <h1 className="hero__title">
            실전보다 더 실전 같은 일정 준비! <br />
            <strong>PlanIt</strong>이 일정 관리를 도와드려요.
          </h1>
          <div className="hero__cta">
            <a href="#todo" className="btn solid">오늘의 할 일 확인</a>
            <a href="#schedule" className="btn outline">일정 등록</a>
          </div>
        </div>
        {/* 우측 마스크 이미지 영역(임시 이미지) */}
        <div className="hero__mask">
          {/* public 폴더에 hero.jpg 있으면 자동 표시됨 */}
          <img src="/hero.jpg" alt="hero" />
        </div>
      </section>

      {/* PROBLEM → SOLUTION CARDS */}
      <section className="section pale" aria-label="why" id="why">
        <div className="container">
          <h2 className="section__title">
            실제로 많은 사람들이 <span className="accent">PlanIt</span>으로 관리하고 있어요.
          </h2>
          <p className="section__desc">
            할 일과 일정을 한 화면에서 가볍게 정리하고, JSON으로 저장/복원까지 간단하게.
          </p>

          <div className="grid3">
            <div className="card xl">
              <div className="dot" />
              <h3>해야 할 일을 놓쳐요</h3>
              <p>오늘 할 일만 모아보고, 완료 체크로 진행 상황을 한눈에 파악해요.</p>
            </div>
            <div className="card xl alt">
              <div className="dot" />
              <h3>무엇부터 시작할지 몰라요</h3>
              <p>우선순위/필터로 집중할 일을 골라서 처리할 수 있어요.</p>
            </div>
            <div className="card xl">
              <div className="dot" />
              <h3>일정과 할 일이 분리돼요</h3>
              <p>날짜별 일정 등록과 투두를 함께 써서 하루를 깔끔하게 설계해요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TODO SECTION */}
      <section id="todo" className="section" aria-label="todo">
        <div className="container">
          <div className="section-head">
            <h2>오늘의 할 일</h2>
            <span className="badge">JSON 불러오기/내보내기 지원</span>
          </div>

          <div className="cta-tiles">
            <div className="tile">
              <div className="tile__icon" />
              <div className="tile__title">할 일 추가/삭제/완료</div>
              <div className="tile__desc">가벼운 UI로 빠르게 관리하세요.</div>
            </div>
            <div className="tile">
              <div className="tile__icon" />
              <div className="tile__title">필터</div>
              <div className="tile__desc">전체 / 진행중 / 완료 보기 제공.</div>
            </div>
            <div className="tile">
              <div className="tile__icon" />
              <div className="tile__title">백업</div>
              <div className="tile__desc">JSON 파일로 내보내고, 다시 불러와 복원.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION (연동한 훅/페이지가 실제 기능 담당) */}
      <section id="schedule" className="section pale" aria-label="schedule">
        <div className="container">
          <div className="section-head">
            <h2>일정</h2>
            <span className="badge">날짜별 등록/삭제</span>
          </div>

          <div className="cta-tiles">
            <div className="tile">
              <div className="tile__icon" />
              <div className="tile__title">날짜 선택</div>
              <div className="tile__desc">Date picker로 원하는 날짜를 고르세요.</div>
            </div>
            <div className="tile">
              <div className="tile__icon" />
              <div className="tile__title">시간 & 메모</div>
              <div className="tile__desc">간단한 시간/제목만으로 등록 끝.</div>
            </div>
            <div className="tile">
              <div className="tile__icon" />
              <div className="tile__title">JSON 연동</div>
              <div className="tile__desc">이벤트도 JSON으로 백업/복원.</div>
            </div>
          </div>
        </div>
      </section>

      {/* MYPAGE (소개/가이드 영역으로 활용) */}
      <section id="mypage" className="section" aria-label="mypage">
        <div className="container">
          <div className="section-head">
            <h2>마이페이지</h2>
            <span className="badge">(확장 예정)</span>
          </div>
          <p className="muted">
            로그인/프로필, 나의 통계(완료율, 연속 실행일), 데이터 내보내기 이력을 확장할 수 있어요.
          </p>
          <div className="cta-tiles">
            <div className="tile large">
              <div className="tile__title">완료율 분석</div>
              <div className="tile__desc">주간/월간 완료율 시각화</div>
            </div>
            <div className="tile large">
              <div className="tile__title">테마 & 다크모드</div>
              <div className="tile__desc">나만의 색상으로 커스터마이즈</div>
            </div>
            <div className="tile large">
              <div className="tile__title">데이터 관리</div>
              <div className="tile__desc">JSON 백업/복원 히스토리</div>
            </div>
          </div>
        </div>
      </section>

      <OneFooter />
    </>
  );
}
