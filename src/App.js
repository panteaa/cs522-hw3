import './App.css';
import React, { useEffect, useState, useReducer} from 'react';
import { useMotion, useInterval } from 'react-use';

function App() {

  const [acc, setAcc] = useState();
  const motionData = useMotion();
  const { state, dispatch, undoable, redoable } = useUndoRedo(reducer, getInitState());
  const { textAreaContent } = state;

  useInterval(
    () => {
      setAcc(motionData);
      if (Math.abs(JSON.stringify(motionData.acceleration.x)) > 3 && redoable) {
        dispatch({ type: 'redo' });
      }
      if (Math.abs(JSON.stringify(motionData.acceleration.z)) > 3 && undoable) {
        dispatch({ type: 'undo' });
      }
    }, 500);

  useEffect(
    () =>
      window.localStorage.setItem('cs522-hw3', JSON.stringify(state)),
    [state]
  );

  return (
    <div className="App">
      <nav className="Top-bar">
        <button onClick={e => dispatch({ type: 'undo' })} disabled={!undoable}> UNDO </button>
        <button onClick={e => dispatch({ type: 'redo' })} disabled={!redoable}> REDO </button>
        <button onClick={e => dispatch({ type: 'clear' })}> CLEAR </button>
      </nav>
      <textarea
        autoFocus
        value={textAreaContent}
        data-testid="textarea"
        onChange={e => dispatch({ type: 'update', textAreaContent: e.target.value })}
      />
      {/* <pre style={{ color: "yellow" }}>
        {acc && JSON.stringify(acc.acceleration.x)}
      </pre>
      <pre style={{ color: "yellow" }}>
        {acc && JSON.stringify(acc.acceleration.z)}
      </pre> */}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'clear':
      return { textAreaContent: '' }
    case 'update':
      return { textAreaContent: action.textAreaContent }
    default:
      throw new Error(`error`)
  }
}

function getInitState() {
  let storedState;
  try {
    storedState = JSON.parse(window.localStorage.getItem('cs522-hw3'))
  } catch (error) {
    console.error('error')
  }
  if (storedState && storedState.textAreaContent) {
    return storedState
  }
  return {
    textAreaContent: ''
  }
}

function useUndoRedo(reducer, initPresent) {
  const initState = {
    history: [initPresent],
    currentIndex: 0
  }

  const [state, dispatch] = useReducer(undoRedo(reducer), initState)

  const { history, currentIndex } = state
  const undoable = currentIndex > 0
  const redoable = currentIndex < history.length - 1

  return { state: history[currentIndex], dispatch, history, undoable, redoable }
}

function undoRedo(reducer) {
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
