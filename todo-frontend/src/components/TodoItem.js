// src/components/TodoItem.js
// One row: text + complete/undo + delete buttons.

const row = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid #eee',
  padding: '10px 12px',
  borderRadius: 10,
  marginBottom: 8,
};

const left = { display: 'flex', alignItems: 'center', gap: 10 };

const textBase = { fontSize: 15 };
const textDone = { ...textBase, color: '#777', textDecoration: 'line-through' };

const btns = { display: 'flex', gap: 8 };
const btn = {
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid #444',
  background: '#fff',
  cursor: 'pointer',
  fontSize: 13,
};

const TodoItem = ({ data, onFlip, onDrop, disabled }) => {
  return (
    <li style={row}>
      <div style={left}>
        <span style={data.completed ? textDone : textBase}>{data.text}</span>
      </div>
      <div style={btns}>
        <button style={btn} onClick={onFlip} disabled={disabled}>
          {data.completed ? 'Undo' : 'Complete'}
        </button>
        <button style={btn} onClick={onDrop} disabled={disabled}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
