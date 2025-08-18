// src/components/todo/TodoInput.jsx
import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onAdd?.(value);
    setValue('');
  };

  return (
    <form onSubmit={submit} className="todo-input" style={{ flex: 1 }}>
      <input
        aria-label="할 일 입력"
        placeholder="무엇을 해야 하나요? (Enter로 추가)"
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        className="input"
        style={{ border: 0, outline: 0, flex: 1 }}
      />
      <button type="submit" className="btn solid">추가</button>
    </form>
  );
}
