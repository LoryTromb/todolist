import { useEffect, useState } from 'react';

const STORAGE_KEY = 'everyday-todos';
const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';

function loadTodos() {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (!storedTodos) return [];

    const parsedTodos = JSON.parse(storedTodos);
    if (
      !Array.isArray(parsedTodos) ||
      !parsedTodos.every(
        (todo) =>
          todo &&
          typeof todo.id === 'string' &&
          typeof todo.title === 'string' &&
          typeof todo.completed === 'boolean',
      )
    ) {
      throw new Error('Saved todo data has an invalid format.');
    }

    return parsedTodos;
  } catch (error) {
    console.error('Could not load saved todos:', error);
    return [];
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState(loadTodos);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Could not save todos:', error);
    }
  }, [todos]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <TodoPage
      todos={todos}
      onTodosChange={setTodos}
      onLogout={() => setIsLoggedIn(false)}
    />
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password combination is not correct.');
      return;
    }

    onLogin();
  }

  return (
    <main className="login-layout">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">A little more clarity</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="muted login-description">
          Sign in to make room for what matters today.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="button button-primary login-submit" type="submit">
            Sign in <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="demo-hint">
          <span className="hint-dot" aria-hidden="true" />
          <p>
            Demo access
            <br />
            <span>student@example.com · password123</span>
          </p>
        </div>
      </section>
      <aside className="login-aside" aria-hidden="true">
        <div className="aside-orbit orbit-one" />
        <div className="aside-orbit orbit-two" />
        <div className="aside-content">
          <span className="aside-kicker">MAKE SPACE FOR</span>
          <p>One thing<br />at a time.</p>
          <div className="aside-rule" />
          <span className="aside-caption">Your day, a little more intentional.</span>
        </div>
        <div className="aside-sparkle sparkle-one">✳</div>
        <div className="aside-sparkle sparkle-two">✳</div>
      </aside>
    </main>
  );
}

function TodoPage({ todos, onTodosChange, onLogout }) {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  function addTodo(event) {
    event.preventDefault();
    const title = newTodo.trim();
    if (!title) return;

    onTodosChange((currentTodos) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...currentTodos,
    ]);
    setNewTodo('');
  }

  function toggleTodo(id) {
    onTodosChange((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id) {
    onTodosChange((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="todo-page">
      <header className="topbar">
        <a className="wordmark" href="#" aria-label="Everyday home">
          <span className="wordmark-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          everyday
        </a>
        <button className="button button-quiet logout-button" onClick={onLogout}>
          Log out <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="todo-content" aria-labelledby="todo-heading">
        <div className="greeting">
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1 id="todo-heading">A fresh start, every day.</h1>
          <p className="muted">Small steps add up. What’s on your mind?</p>
        </div>

        <form className="add-todo-form" onSubmit={addTodo}>
          <span className="add-icon" aria-hidden="true">+</span>
          <input
            aria-label="New todo"
            placeholder="Add a task to your list..."
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            maxLength={200}
          />
          <button className="button button-primary add-button" type="submit">
            Add task
          </button>
        </form>

        <section className="list-panel" aria-label="Todo list">
          <div className="list-toolbar">
            <p className="list-title">Your tasks <span>{todos.length}</span></p>
            <div className="filter-tabs" aria-label="Filter todos">
              {['all', 'active', 'completed'].map((option) => (
                <button
                  key={option}
                  className={`filter-tab ${filter === option ? 'selected' : ''}`}
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                  type="button"
                >
                  {option[0].toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {visibleTodos.length > 0 ? (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <li className={`todo-item ${todo.completed ? 'is-completed' : ''}`} key={todo.id}>
                  <button
                    className="todo-check"
                    type="button"
                    aria-label={todo.completed ? `Mark ${todo.title} active` : `Complete ${todo.title}`}
                    aria-pressed={todo.completed}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed && <span aria-hidden="true">✓</span>}
                  </button>
                  <span className="todo-name">{todo.title}</span>
                  <button
                    className="delete-button"
                    type="button"
                    aria-label={`Delete ${todo.title}`}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✳</span>
              <p>{filter === 'all' ? 'Your list is a blank canvas.' : `No ${filter} tasks right now.`}</p>
              <span>{filter === 'all' ? 'Add a task above to get started.' : 'Try another filter or add a new task.'}</span>
            </div>
          )}

          <footer className="list-footer">
            <span>{remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left to do</span>
            <span className="footer-note"><span className="footer-sparkle">✳</span> Keep it simple</span>
          </footer>
        </section>
        <p className="privacy-note">Your tasks stay saved in this browser.</p>
      </section>
    </main>
  );
}

export default App;
