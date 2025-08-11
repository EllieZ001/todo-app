// src/components/AddTodo.js
// Small form to add one task.  
import { useState } from 'react';

const row = { display: 'flex', gap: 8, marginBottom: 12 };
const inputStyle = {
  flex: 1,
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: 8,
  fontSize: 14,
};
const btn = {
  padding: '10px 14px',
  border: '1px solid #333',
  background: '#333',
  color: '#fff',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
};

const AddTodo = ({ onAdd, disabled }) => {
  const [draft, setDraft] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const clean = (draft || '').trim();
    if (!clean) return; // do not send empty
    onAdd(clean);
    setDraft('');
  };

  return (
    <form onSubmit={submit} style={row}>
      <input
        type="text"
        placeholder="Enter a task"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        style={inputStyle}
        disabled={disabled}
      />
      <button type="submit" style={btn} disabled={disabled}>
        Add
      </button>
    </form>
  );
};

export default AddTodo;
