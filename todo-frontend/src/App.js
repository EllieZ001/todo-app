// src/App.js
// holds state, talks to API, renders children.
 
import { useEffect, useMemo, useState } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

// 
const box = {
  maxWidth: 560,
  margin: '40px auto',
  padding: '20px',
  border: '1px solid #e5e5e5',
  borderRadius: 12,
  fontFamily: 'system-ui, Arial, sans-serif',
};
const title = { marginTop: 0, marginBottom: 16, fontSize: 24, fontWeight: 600 };
const hint = { color: '#666', fontSize: 14, marginTop: 8 };
const bar  = { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 };
const tag  = { fontSize: 12, color: '#444', background: '#f3f3f3', padding: '2px 8px', borderRadius: 999 };

// logger 
const stamp = () => new Date().toISOString().slice(11, 19); // HH:MM:SS
const mark = (...a) => console.log(`[ui ${stamp()}]`, ...a);

// safe json (avoid crashing on unexpected non-JSON responses)
const safeJson = async (res) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

function App() {
  // core state
  const [worklist, setWorklist] = useState([]); // todos live here
  const [spinning, setSpinning] = useState(true); // initial loading
  const [note, setNote] = useState('');          // small error message
  const [busyLine, setBusyLine] = useState(false); // lock buttons during ops

  // derived stats (memo keeps it cheap)
  const stats = useMemo(() => {
    const total = worklist.length;
    const done  = worklist.filter(x => x.completed).length;
    return { total, done, left: total - done };
  }, [worklist]);

  // load all on mount
  useEffect(() => {
    (async () => {
      try {
        setNote('');
        setSpinning(true);
        const res = await fetch('/api/todos');
        const data = await safeJson(res);
        if (!res.ok) throw new Error('load failed');
        setWorklist(Array.isArray(data) ? data : []);
        mark('loaded items =', Array.isArray(data) ? data.length : 'n/a');
      } catch (e) {
        mark('load fail', e);
        setNote('Cannot load items right now.');
      } finally {
        setSpinning(false);
      }
    })();
  }, []);

  // add one  
  const addOne = async (rawText) => {
    const text = (rawText || '').trim();
    if (!text) return; // double-guard (AddTodo also checks)

    // optimistic insert
    const tempId = Date.now(); // unique enough for local use
    const temp = { id: tempId, text, completed: false, _ghost: true };
    setWorklist(prev => [...prev, temp]);
    mark('optimistic add id=', tempId);

    try {
      setBusyLine(true);
      setNote('');
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const payload = await safeJson(res);
      if (!res.ok) throw new Error(payload?.error || 'Add failed');

      // replace temp with server item
      setWorklist(prev =>
        prev.map(x => (x.id === tempId ? payload : x))
      );
      mark('server add ok id=', payload.id);
    } catch (e) {
      // rollback temp
      setWorklist(prev => prev.filter(x => x.id !== tempId));
      setNote(e.message || 'Add failed.');
      mark('add fail rollback id=', tempId, e);
    } finally {
      setBusyLine(false);
    }
  };

  // flip completed  
  const flipOne = async (id) => {
    // optimistic flip
    const before = worklist;
    setWorklist(prev =>
      prev.map(x => (x.id === id ? { ...x, completed: !x.completed } : x))
    );
    mark('optimistic toggle id=', id);

    try {
      setBusyLine(true);
      setNote('');
      const res = await fetch(`/api/todos/${id}`, { method: 'PUT' });
      const payload = await safeJson(res);
      if (!res.ok) throw new Error('Toggle failed');

      // align with server 
      setWorklist(prev => prev.map(x => (x.id === id ? payload : x)));
      mark('server toggle ok id=', id, 'completed=', payload.completed);
    } catch (e) {
      // rollback
      setWorklist(before);
      setNote('Toggle failed.');
      mark('toggle fail rollback id=', id, e);
    } finally {
      setBusyLine(false);
    }
  };

  // delete one  
  const dropOne = async (id) => {
    const before = worklist;
    // optimistic remove
    setWorklist(prev => prev.filter(x => x.id !== id));
    mark('optimistic remove id=', id);

    try {
      setBusyLine(true);
      setNote('');
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await safeJson(res); // we do not use the payload here
      mark('server remove ok id=', id);
    } catch (e) {
      // rollback
      setWorklist(before);
      setNote('Delete failed.');
      mark('delete fail rollback id=', id, e);
    } finally {
      setBusyLine(false);
    }
  };

  return (
    <div style={box}>
      <h1 style={title}>My To-Do List</h1>

      {/* small stats bar */}
      <div style={bar}>
        <span style={tag}>total: {stats.total}</span>
        <span style={tag}>done: {stats.done}</span>
        <span style={tag}>left: {stats.left}</span>
      </div>

      {/* add form */}
      <AddTodo onAdd={addOne} disabled={busyLine} />

      {/* loading / empty / list */}
      {spinning && <div>Loading...</div>}

      {!spinning && worklist.length === 0 && (
        <div style={hint}>No items yet. Add your first task.</div>
      )}

      {!spinning && worklist.length > 0 && (
        <TodoList
          items={worklist}
          onFlip={flipOne}
          onDrop={dropOne}
          disabled={busyLine}
        />
      )}

      {/* error line */}
      {!!note && (
        <div style={{ color: '#b71c1c', marginTop: 12 }}>{note}</div>
      )}
    </div>
  );
}

export default App;
