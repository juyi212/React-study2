### 리액트 훅(hook)

- 컴포넌트에 기능을 추가할 때 사용하는 함수 

  - 컴포넌트에 상탯값을 추가, 자식 요소에 접근 등등
  - useState : 상탯값 추가, useEffect : 부수효과 처리( 외부 상태를 변경 -> 서버 api 호출, 이벤트 핸들러 ) 등..

- 리액트에서 관리하지 않는 외부에서 호출 할 경우에는 배치로 다뤄지지 않는다. (내부에서 관리가 되어지지 않기때문)

  - batchedUpdates : 외부에서 호출 할 경우에 배치로 다루기 위함 

  

- 훅도 블럭처럼 관리할 수 있다.

  - useBlockIfNotLogin() 로그인 되어 있지않은 사용자 반환 훅 

    저장되지 않은 정보가 있으면 띄워주는 훅 들도 작성가능 ..

- 훅 사용 시 지켜야 할 규칙

  - 하나의 컴포넌트에서 훅을 호출하는 순서는 항상 같아야한다.

    - if 문 안에서는 훅을 사용하면 안된다. 

    ```
    if(!user) {
    	const [user, setUser] = useState(0) // 조건에 따라 useState 를 호출하면 안됨 
    }
    ```

    

  - 훅은 함수형 컴포넌트 또는 커스텀 훅 안에서만 호출되어야 한다.

#### **useEffect** 

> 컴포넌트가 **렌더링된 후에 호출** 

- 렌더링 결과가 실제 돔에 반영되고 비동기로 호출된다.

```
useEffect(()=> {
}, []) // 의존성 배열이 빈배열일 경우 -> 마운트된 후에 한 번만 호출되도록 한다 
```

-  의존성 배열의 내용이 변경되었을 경우 부수 효과 함수가 실행된다. 
- 의존성 배열에서는 부수 효과 함수에서 사용한 변수를 잘 봐야함
  - 컴포넌트의 함수값, 지역변수, 지역함수 .. 등등 

- useEffect 훅에서 async / await 함수 사용

**useEffect 훅에서 부수 효과함수를 async / await 함수로 만들면 오류가 발생한다.** 

왜냐하면 부수 효과 함수는 함수만 반환할 수 있는데 async / await 함수는 Promise 객체를 반환하기 때문이다.

```react
useEffect(async () => {
  const data = await fetchUser(userId);
  setUser(data);
}, [userId])
```

 async / await 함수 사용하기 위해서는 부수효과 함수 내부에 async / await 함수를 만들어 호출하면 된다.

```react
  useEffect(() => {
    async function fetchAndSetUser() {
      const data = await fetchUser(userId);
      setUser(data);
    }
    fetchAndSetUser();
  }, [userId]);
```

- useEffect 훅 밖에서 fetchAndSetUser 함수가 필요한 경우

개발을 하다보면 useEffect 안의 함수를 훅 밖으로 빼야하는 상황이 있다. 

```react
  async function fetchAndSetUser(value) {
    const data = await fetchUser(userId);
    setUser(data);
  }

  useEffect(() => {
    fetchAndSetUser(true);
  }, [fetchAndSetUser]);

  return <button onClick={() => fetchAndSetUser(false)}>더보기</button>;
```

fetchAndSetUser 함수를 useEffect 훅 밖으로 빼내 작성했다. 

이제 훅 내부에서 fetchAndSetUser 함수를 사용하므로 의존성 배열에 추가해준다.

그런데 fetchAndSetUser 함수는 렌더링할 때마다 갱신되므로 결과적으로 fetchAndSetUser 함수는 렌더링을 할 때마다 호출된다. 이 문제를 해결하려면 fetchAndSetUser 함수가 필요할 때만 갱싱되도록 해야한다. **이럴 때 useCallback을 사용한다.**

```react
  const fetchAndSetUser = useCallback(async () => {
    const data = fetchUser(userId);
    setUser(data);
  }, [userId]);
```

이제 fetchAndSetUser 함수는 userId 값이 변경될 때만 갱신된다.





#### useMemo

> 계산량이 많은 함수의 반환값을 재활용하는 용도로 사용



```react
import React, { useState, useMemo } from 'react'


export default function App() {
  const [v1, setV1] = useState(0)
  const [v2, setV2] = useState(0)
  const [v3, setV3] = useState(0)
    // [v1,v2] 가 하나라도 변경되면 실행된다.
    // 아니면 이전의 실행했던 값을 재활용 한다 ! 의존성 배열을 쓴다.
    const value = useMemo(()=> runExpensiveJob(v1, v2), [v1, v2])
    return(
      <>
        <p>{`value is ${value}`}</p>
        <button
          onClick={() => {
            setV1(Math.random())
            setV2(Math.random())
          }}
        >
          v1/v2 수정
        </button>
        <p>{`v3 is ${v3}`}</p>
        <button onClick={() => setV3(Math.random())}> v3수정</button>     
      
      </>
    ) 
}
function runExpensiveJob(v1, v2) {
  console.log('function called')
  return v1 + v2 ;
}
```



#### useCallback

> 메모이제이션을 사용하는데 **함수 메모이제이션에 특화된 훅**이다.
>
> 자식 컴포넌트 입장에서 불필요한 랜더링을 막을 수 있다. (코드 참고)

```React
import React, { useState, useMemo } from 'react'


export default function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [V1, setV1] = useState(0)
  // 이렇게 함수를 입력해서 속성값으로 전달할 때는 이 컴포넌트가 랜더링 될때마다 새로운 함수가 
  // 생성되고 랜더링 되서 자식 컴포넌트인 useedit은 값이 변경이 안되더라도 불필요하게 랜더링 값을 받아야한다
  // 이럴때 useCallback 함수를 사용한다. 의존성 배열 사용 
  const onSave = useCallback(() => {saveToServer((name, age), [name, age])})
  return(
    <div>
      <p>{`name is ${name}`}</p>
      <p>{`age is ${age}`}</p> 
      <UserEdit
        onSave={}
        setName ={setName}
        setAge ={setAge}
      />
      <p>{`v1 : ${v1}`}</p>
      <button onClick={() => setV1(Math.random())}>v1 수정</button>
    </div>
  )
}

const UserEdit = React.memo(function ({ onSave, setName, setAge }){
  console.log('UserEdit render')
  return null
})

function saveToServer(name, age) {}
```





#### useReducer

> 여러 개의 상태값을 관리할 때는 이 훅을 사용하는 것이 좋다!

- Redux 와 비슷하다 (상태값 관리) / 로직 분리가 되어 관리가 쉽다

```React
import React, { useReducer } from 'react'


export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return(
    <div>
      <p>{`name is ${state.name}`}</p>
      <p>{`age is ${state.age}`}</p> 
      <input 
        type ="text"
        value ={state.name}
        onChange={ e => dispatch({ type: 'setName', name: e.currentTarget.value})
      }
      />
      <input
      type ='number'
      value ={state.age}
      onChange={ e => dispatch({ type:'setAge', age: e.currentTarget.value })} 
      />
    </div>
  )
}

const INITIAL_STATE = { name: 'empty', age: 0 }
const MAX_AGE = 50;
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
```



- 상위 컴포넌트에서 다수의 상태값을 관리하는데 이때 자식 컴포넌트로 부터 발생한 이벤트에서 상위 컴포넌트의 상태값을 변경해야할 경우가 있다. 이를 위해서 상위 컴포넌트에서 트리의 깊은 곳까지 이벤트 처리 함수를 전달하곤한다.

  **이때  useReducer , context api 를 사용하면 쉽게 전달할 수 있다.**

```React
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
```



#### useImperativeHandle

> 클래스형 컴포넌트의 부모 컴포넌트는 ref 객체를 통해서 자식 컴포넌트의 메서드를 호출 할 수 있다. (의존성이 생기지만 종종 사용해야하는 경우가 있다.)
>
> 그러나 종종 사용해야하는 경우가 있다. 이럴 때 사용 !
>
> 마치 함수형 컴포넌트에도 멤버 변수나 멤버 함수가 있는 것처럼 만들 수 있다.

```react
// useImperativeHandle1.js
import React, { forwardRef, useState, useImperativeHandle } from 'react'

function Profile(_, ref) {
    const [name, setName ] = useState('mike')
    const [age, setAge ] = useState(0)

    useImperativeHandle(ref, () => ({
        addAge: value => setAge(age+value),
        getNameLength: () => name.length
    }))
    return (
        <div>
            <p>{`name is ${name}`}</p>
            <p>{`age is ${age}`}</p>
        </div>
    )

}
export default forwardRef(Profile)

```

```react
// useImperativeHandle2.js

import React, { useRef } from 'react';
import Profile from './useImperativeHandle1'

export default function App() {
    const profileRef = useRef();
    const onClick = () => {
        // 자식 컴포넌트 함수 참조
        if(profileRef.current) {
            console.log('current name length:', profileRef.current.getNameLength())
            profileRef.current.addAge(5)
        }
    }
    return(
        <div>
            <Profile ref ={profileRef} />
            <button onClick ={onClick}> add age 5 </button>
        </div>
    )
}
```



#### useLayoutEffect

> useEffect 훅은 입력된 부수효과 함수는 렌더링 결과가 반영된 후 비동기로 호출됩니다.
>
> 하지만, useLayoutEffect 훅은 동기로 호출되게 됩니다. 렌더링 결과가 돔에 반영된 직후에 바로 호출됨.
>
> 부수효과 연산을 많이하면 브라우저가 먹통이 될 가능성 큰 이점이 있다.
>
> 그럼에도 사용하는 경우는 ! **렌더링 직후에 돔 요소 값을 읽어들이는 경우, 조건에 따라 컴포넌트를 다시 렌더링 할 경우**



```react
import React, { useState, useLayoutEffect } from 'react';

export default function App() {
    const [width, setWidth] = useState(200)
    // 깜빡깜빡 거리는 이유
    // 500 보다 큰값이 입력된 후 다시 렌더링이 되면서 다시 500으로 렌더링 함
    
    // useEffect(()=> {
    //     if(width > 500) {
    //         setWidth(500)
    //     }
    // },[ width ])


    // 리액트가 렌더링을 하고 실제 돔에 반영은 했지만, 브라우저가 화면을 그리기 전에 동기로 실행 
    // 500으로 렌더링하고 브라우저에 그린다.
    useLayoutEffect(()=> {
        if(width > 500) {
            setWidth(500)
        }
    },[ width ])
    return(
        <div>
            <div style ={{ width, height: 100, backgroundColor: 'green'}}></div>
            <button onClick={() => {
                const value = Math.floor(Math.random() * 499 + 1)
                setWidth(value)
            }}>500 이하</button>
            <button onClick={() => {
                const value = Math.floor(Math.random() * 500 + 501)
                setWidth(value)
            }}>500 이상</button>
        </div>
    )
}
```

- 연산량이 많으면 과부하가 생김 그래서 성능상 useEffect 사용하는 것이 좋다 useRef 와 같이 사용! 아래 코드 참고

```react
import React, { useState, useEffect } from 'react';

export default function App() {
    const [width, setWidth] = useState(200)
    const boxRef = useRef()
    useEffect(()=> {
        if(width > 500) {
            setWidth(500)
        }
    },[ width ])
    return(
        <div>
            <div ref = {boxRef} 
              style ={{ width, height: 100, backgroundColor: 'green'}}></div>
            <button onClick={() => {
                const value = Math.floor(Math.random() * 499 + 1)
                setWidth(value)
            }}>500 이하</button>
            <button onClick={() => {
                const value = Math.floor(Math.random() * 500 + 501)
                setWidth(value)
            }}>500 이상</button>
        </div>
    )
}
```





#### useDebugValue

> 리액트 개발자 도구에 좀 더 풍부한 정보를 제공할 수 있다. 즉, 디버그할때 편하다

```react
import { useState, useDebugValue } from 'react';

export default function useChangeAppState() {
    const [state, setState ] = useState(STATE_START);
    const next = () => setState(state === STATE_STOP ? STATE_START : state+1)
    useDebugValue(
        state === STATE_START
        ? 'start'
        : state === STATE_RUNNING
        ? 'running'
        : 'stop',
    )
    return [ state, next]
}
export const STATE_START = 0;
export const STATE_RUNNING = 1;
export const STATE_STOP = 2;


```

