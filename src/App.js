import './App.css';
import { useMotion, useInterval } from 'react-use';
import React, { useEffect, useState, useReducer} from 'react';

function App() {

  const [acc, setAcc] = useState();
  const stateMotion = useMotion();

  useInterval(
    () => {
      setAcc(stateMotion);
      if (Math.abs(JSON.stringify(stateMotion.acceleration.x)) > 1 && canRedo) {
        dispatch({ type: 'redo' });
      }
      if (Math.abs(JSON.stringify(stateMotion.acceleration.z)) > 1 && canUndo) {
        dispatch({ type: 'undo' });
      }
    }, 500);

  const { state, dispatch, canUndo, canRedo } = useUndoRedo(
    reducer,
    getInitState()
  );

  useEffect(
    () =>
      window.localStorage.setItem('cs522-hw3', JSON.stringify(state)),
    [state]
  );

  const { textAreaContent } = state

  return (
    <div className="App">
      <nav className="Top-bar">
        <button disabled={!canUndo} onClick={e => dispatch({ type: 'undo' })}>
          Undo
        </button>
        <button disabled={!canRedo} onClick={e => dispatch({ type: 'redo' })}>
          Redo
        </button>
        <button onClick={e => dispatch({ type: 'clear' })}>
          Clear
        </button>
      </nav>
      <textarea
        autoFocus
        value={textAreaContent}
        data-testid="textarea"
        onChange={e => dispatch({ type: 'update', textAreaContent: e.target.value })}
      />
      <pre style={{ color: "yellow" }}>
        {acc && JSON.stringify(acc.acceleration.x)}
        {acc && JSON.stringify(acc.acceleration.z)}
      </pre>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'update':
      return { textAreaContent: action.textAreaContent }
    case 'clear':
      return { textAreaContent: '' }
    case 'reset':
      return { textAreaContent: 'init text' }
    default:
      throw new Error(`${action.type}`)
  }
}

function getInitState() {
  let storedState
  try {
    storedState = JSON.parse(window.localStorage.getItem('cs522-hw3'))
  } catch (error) {
    console.error('Error restoring from localStorage, using default state')
  }
  if (storedState && storedState.textAreaContent) return storedState
  return {
    textAreaContent: "init text"
  }
}

function useUndoRedo(reducer, initPresent) {
  const initState = {
    history: [initPresent],
    currentIndex: 0
  }

  const [state, dispatch] = useReducer(undoable(reducer), initState)

  const { history, currentIndex } = state
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return { state: history[currentIndex], dispatch, history, canUndo, canRedo }
}

function undoable(reducer) {
  return function (state, action) {
    const { history, currentIndex } = state

    switch (action.type) {
      case 'undo':
        return {
          ...state,
          currentIndex: currentIndex - 1
        }
      case 'redo':
        return {
          ...state,
          currentIndex: currentIndex + 1
        }
      default:
        const present = history[currentIndex]
        const newPresent = reducer(present, action)

        if (present === newPresent) {
          return state
        }

        const newIndex = currentIndex + 1
        const newHistory = history.slice(0, newIndex)

        return {
          history: [...newHistory, newPresent],
          currentIndex: newIndex
        }
    }
  }
}

export default App;
