import React, { useReducer } from 'react'

export const ProfileDispatch = React.createContext(null);


export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return(
    <div>
      <p>{`name is ${state.name}`}</p>
      <p>{`age is ${state.age}`}</p> 
      <ProfileDispatch.Provider value = {dispatch}>
      {/* 필요한 곳에서 dispatch 함수를 통해 값을 변경할 수 있을 것이다. */}
          <SomeComponent />
      </ProfileDispatch.Provider>
    </div>
  )
}

const INITIAL_STATE = { name: 'empty', age: 0 }
function reducer(state, action){
  switch(action.type) {
    case 'setName':
      return { ...state, name: action.name }
    case 'setAge':
      if (action.age > MAX_AGE){
        return { ...state, age: MAX_AGE }
      } else {
        return { ...state, age: action.age }
      }
    default:
      return state;
  }
}