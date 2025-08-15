// JSON 저장/불러오기 서비스 (localStorage + 파일 import/export)
const TODO_KEY = 'planit.todos.v1';
const EVENTS_KEY = 'planit.events.v1';

// 공통: JSON 안전 파서 (null/undefined도 fallback 처리)
const safeParse = (s, fallback) => {
  try {
    const v = JSON.parse(s);
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

// 배열/객체 형태 보장
export const loadTodos = () => {
  const v = safeParse(localStorage.getItem(TODO_KEY), []);
  return Array.isArray(v) ? v : [];
};
export const saveTodos = (todos) =>
  localStorage.setItem(TODO_KEY, JSON.stringify(todos ?? []));

export const loadEvents = () => {
  const v = safeParse(localStorage.getItem(EVENTS_KEY), {});
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
};
export const saveEvents = (events) =>
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events ?? {}));

// 파일로 내보내기
export const downloadJSON = (data, filename = 'data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// 파일에서 불러오기
export const readJSONFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
