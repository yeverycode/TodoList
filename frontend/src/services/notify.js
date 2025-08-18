// src/services/notify.js
export const canNotify = () => 'Notification' in window;

export const requestNotifyPermission = async () => {
  if (!canNotify()) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch {
    return 'denied';
  }
};

export const showNotification = (title, options = {}) => {
  if (!canNotify() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { ...options });
    // 자동 닫기
    setTimeout(() => n.close(), 4000);
  } catch {}
};

/**
 * 간단한 타이머 기반 리마인더:
 * - intervalMs마다 getDue() 호출 → 반환된 항목에 대해 notifyFn 호출
 * - stop()을 반환
 */
export const startDueWatcher = (getDue, notifyFn, intervalMs = 30000) => {
  let timer = null;
  const tick = () => {
    try {
      const due = getDue?.() || [];
      due.forEach((ev) => notifyFn(ev));
    } catch (e) {
      // noop
    }
  };
  timer = setInterval(tick, intervalMs);
  // 즉시 한 번
  tick();
  return () => clearInterval(timer);
};
