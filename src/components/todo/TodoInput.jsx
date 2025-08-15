import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onAdd?.(value);
    setValue('');
  };

  return (
    <form onSubmit={submit} className="todo-input">
      <input
        aria-label="할 일 입력"
        placeholder="무엇을 해야 하나요? (Enter로 추가)"
        value={value}
        onChange={(e)=>setValue(e.target.value)}
      />
      <button type="submit" className="btn solid">추가</button>
    </form>
  );
}
