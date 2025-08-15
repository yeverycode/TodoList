import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import OnePage from './pages/OnePage';
import TodoPage from './pages/TodoPage';
import SchedulePage from './pages/SchedulePage';
import MyPage from './pages/MyPage';

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/" element={<OnePage />} />
          <Route path="/todos" element={<TodoPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
