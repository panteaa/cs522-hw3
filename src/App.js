import './App.css';
import {useMotion, useInterval} from 'react-use';

import React, { useEffect, useState } from 'react';
import { useUndoableReducer, UNDO, REDO } from './useUndoableReducer';


const UPDATE = 'update'
const CLEAR = 'clear'
const RESET = 'reset'
const ABOUT = 'about'

const CACHE_KEY = 'write-only-app-storage'

function reducer(state, action) {
  switch (action.type) {
    case UPDATE:
      return { text: action.text }
    case CLEAR:
      return { text: '' }
    case RESET:
      return { text: 'INITIAL_TEXT' }
    case ABOUT:
      return { text: 'ABOUT_TEXT' }
    default:
      throw new Error(`Unknown action ${action.type}`)
  }
}

function getInitialState() {
  let storedState
  try {
    storedState = JSON.parse(window.localStorage.getItem(CACHE_KEY))
  } catch (error) {
    console.error('Error restoring from localStorage, using default state')
  }
  if (storedState && storedState.text) return storedState
  return {
    text: "INITIAL_TEXT"
  }
}

function App() {
  const [acc, setAcc] = useState(); 

  const stateMotion = useMotion();

  useInterval(
    () => {
      setAcc(stateMotion);
      if (Math.abs(JSON.stringify(stateMotion.acceleration.x)) > 1 && canRedo) {
        dispatch({ type: REDO });
      } 
      if (Math.abs(JSON.stringify(stateMotion.acceleration.z)) > 1 && canUndo) {
        dispatch({ type: UNDO });
      } 
    },500);



  const { state, dispatch, canUndo, canRedo } = useUndoableReducer(
    reducer,
    getInitialState()
  );

  useEffect(
    () => 
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(state)), 
    [state] // only save in locatstorage if state changes
  );


  const { text } = state

  return (
    <div className="App">
      <pre>
        {acc && JSON.stringify(acc.acceleration.x)}
        {acc && JSON.stringify(acc.acceleration.z)}
      {/* {JSON.stringify(stateMotion.acceleration.x, null, 2)} */}
    </pre>

    <nav className="Controls">
        <button
          data-testid="clear-button"
          type="button"
          onClick={e => dispatch({ type: CLEAR })}
        >
          Clear
        </button>
        <button
          data-testid="reset-button"
          onClick={e => dispatch({ type: RESET })}
        >
          Reset
        </button>
        <button
          data-testid="undo-button"
          disabled={!canUndo}
          onClick={e => dispatch({ type: UNDO })}
        >
          Undo
        </button>
        <button
          data-testid="redo-button"
          disabled={!canRedo}
          onClick={e => dispatch({ type: REDO })}
        >
          Redo
        </button>
        <button
          data-testid="about-button"
          onClick={e => dispatch({ type: ABOUT })}
        >
          About
        </button>
      </nav>
      <textarea
        autoFocus
        value={text}
        data-testid="textarea"
        onChange={e => dispatch({ type: UPDATE, text: e.target.value })}
      />

    </div>
  );
}

export default App;
