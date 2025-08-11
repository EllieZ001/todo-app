// src/components/TodoList.js
// Renders a list of TodoItem.  

import TodoItem from './TodoItem';

const listStyle = { listStyle: 'none', padding: 0, margin: 0 };

const TodoList = ({ items, onFlip, onDrop, disabled }) => {
  return (
    <ul style={listStyle}>
      {items.map((t) => (
        <TodoItem
          key={t.id}
          data={t}
          onFlip={() => onFlip(t.id)}
          onDrop={() => onDrop(t.id)}
          disabled={disabled}
        />
      ))}
    </ul>
  );
};

export default TodoList;
