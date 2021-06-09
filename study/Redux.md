## 리덕스(Redux)

### 특징

- 컴포넌트 코드로부터 상태 관리 코드를 분리 할 수 있다.
- 미들웨어를 활용한 다양한 기능 추가
  - 강력한 미들웨어 라이브러리 (redux-saga)
  - 로컬 스토리지에 데이터 저장하기 및 불러오기
- 서버 사이드 렌더링(SSR)시 데이터 전달이 간편하다.
- 리액트 콘텍스트보다 효율적인 렌더링 가능

- 부모 컴포넌트에서 깊은 곳에 있는 자식 컴포넌트에 상태 값을 전달할 때 좋다.
- 알림창과 같은 전역 컴포넌트의 상태 값을 관리할 때 좋다.
- 페이지가 전환되어도 데이터는 살아 있어야 할 때 좋다.

![image-20210608225403610](/Users/iju-i/Library/Application Support/typora-user-images/image-20210608225403610.png)

### 세 가지 원칙

리덕스 사용 시 따라야할 세 가지 원칙이 있다.

1. 전체 상태 값을 하나의 객체에 저장.
2. 상태 값은 불변 객체.
3. 상태 값은 순수 함수에 의해서만 변경되어야 한다.
   - 부수 효과 : 외부의 상태를 변경하는 것. 함수로 들어온 인자 값을 직접 변경하는 것.
   - 순수 함수 : 부수 효과가 없는 함수. 즉, 동일한 인자값이 들어오면 항상 같은 결과 리턴

#### 하나의 객체에 프로그램의 전체 상태 값을 저장한다.

전체 상태 값을 하나의 자바스크립트 객체로 표현되기 때문에 활용도가 높아진다. 하지만 프로그램의 전체 상태 값을 리덕스로 관리하는 것은 쉬운 일이 아니므로 일부 상태만 리덕스를 활용해도 된다.



#### 상태 값을 불변 객체로 분리한다.

상태 값은 오직 액션 객체에 의해서만 변경되어야 한다.

```react
// 액션 객체
const incrementAction = {  
  type: 'INCREMENT',
  amount: 100,
};
// 여기서 dispatch는 액션이 발생했다는 것을 리덕스에게 알려주는 함수이다.
store.dispatch(incrementAction);
```

- 액션 객체는 `type` 속성 값이 존재하며, type 속성 값으로 액션 객체를 구분한다.
  type 속성 값을 제외한 나머지는 상태 값을 수정하기 위해 사용되는 정보다.
- 액션 객체와 함께 dispatch 메서드를 호출하면 상태 값이 변경된다.



### 액션

```react
// 액션 객체는 액션 생성 함수와 리듀서에서 액션 객체를 구분할 때도 사용되므로
// 상수 변수로 만드는게 좋다.
export const ADD = 'todo/ADD';
export const REMOVE = 'todo/REMOVE';
export const REMOVE_ALL = 'todo/REMOVE_ALL';

export function addTodo({ titile, priority }) {
  return { type: ADD, title, priroity };
}
export function removeTodo({ id }) {
  return { REMOVE, id };
}
export function removeAll() {
  return { REMOVE_ALL };
}

store.dispatch(addTodo({ title: '영화 보기', priority: 'high' }));
store.dispatch(removeTodo(12));
store.dispatch(removeAll());
```

액션 타입과 액션 생성 함수는 다른 코드나 외부에서 사용하므로 export 해준다.



### 미들웨어 

미들웨어는 리듀서가 액션을 처리하기 전에 실행되는 함수다.

```react
import { createStore, applyMiddleware } from 'redux';

const middleware1 = (store) => (next) => (action){
  console.log('middleware1 start')
  const result = next(action) // next 함수 호출 시 리듀서 호출
  console.log('middleware end')
  return result
}
const myReducer = (state, action) => {
  console.log('myReducer')
  return state
}

const store = createStore(myReducer, applyMiddleware(middleware1));
store.dispatch({ type: 'SOME_ACTION' });
```

- 실행을 연기할 수 있는 미들웨어

```react
const delayAction = (store) => (next) => (action) => {
  const delay = aciton.meta && action.meta.delay;
  //const delay = action.meta?.delay; 위에와 같은 의미 (?) => optional chaining 기능 js문법
  if (!delay) return next(action);

  const timeoutId = setTimeout(() => next(action), delay);
  // 취소 함수 반환
  return function cancel() { 
    clearTimeout(timeoutId);
  };
};

const cancel = store.dispatch({
  type: 'SOME_ACTION',
  meta: { delay: 1000 },
});

cancel(); // 반환되는 cancel 함수를 실행함으로써 중간에 reducer 실행을 안할수있도록해준다.
```



### 리듀서

액션이 발생했을 때 새로운 상태값을 만드는 함수이다. 리덕스의 상태값을 수정하는 유일한 방법은 액션객체와 함께 dispatch 매서드를 호출하는 것. 다른 어떤 방법으로도 상태 값을 수정하면 안됨. 

상태 값은 불변함수로 관 리 !

```react
function reducer(state = INITIAL_STATE, action){
  switch(action.type){
    case REMOVE_ALL:
      return {
        ...state,
        todos:[],
      }
    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      }
    default:
      return state;
  }
}

const INITIAL_STATE = { todos: [] }
```

- 중첩된 객체의 데이터 수정

```react
function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        todos: [...state.todos, { id: getNewId(), title: action.title, priority: action.priority }],
    // ...
      };
  }
}
const INITIAL_STATE = { todos: [] };
```

todo 1개를 추가하기 위해 spread operator를 2번 사용하고있다. 만약 더 깊은 곳의 값을 수정할 때는 코드의 가독성이 많이 떨어진다. **immer** 패키지를 사용해 불변 객체를 관리할 수 있다.

- immer를 이용해 리듀서 작성하기

```react
import produce from 'immer';

const person = { name: 'kang', age: 27 };
const newPerson = produce(person, (draft) => {
  draft.age = 28;
});
```

produce 함수의 첫번째 매개변수로 변경하고자 하는 객체를 입력한다. 두번째 매개변수는 객체를 수정하는 함수다. draft가 person 객체라 생각하고 값을 수정해도 기존이 person 객체를 수정하지 않고 produce 함수가 새로운 객체를 반환해준다.

```react
mport produce from 'immer';

function reducer(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD:
        draft.todos.push(action.todo);
        break;
      case REMOVE_ALL:
        draft.todos = [];
        break;
      case REMOVE:
        draft.todos = draft.todos.filter((todo) => todo.id !== action.id);
        break;
      default:
        break;
    }
  });
}
const INITIAL_STATE = { todos: [] };
```

immer를 사용했기 때문에 push 메서드를 사용해도 기존의 상태 값을 직접 수정하지 않고 새로운 객체를 반환한다.

- createReducer 함수로 리듀서 작성하기

  - createReducer 함수를 사용하면 간결하게 리듀서 작성이 가능하다.

    ```react
    const reducer = createReducer(INITIAL_STATE, {
      [ADD]: (state, action) => state.todos.push(action.todo),
      [REMOVE_ALL]: (state) => (state.todos = []),
      [REMOVE]: (state, action) => (state.todos = state.todos.filter((todo) => todo.id !== action.id)),
    });
    
    const INITIAL_STATE = { todos: [] };
    ```

    createReducer 의 경우는 immer의 produce를 자체적으로 지원하기 때문에 따로 코드로 immutable 관리를 하지 않아도 되는 큰 장점이 있습니다.



### react-redux 패키지 사용 

```
npm install react-redux 
```

Provider 컴포넌트 하위에 있는 컴포넌트는 리덕스의 상태 값이 변경되면 자동으로 컴포넌트 함수가 호출되도록 할 수 있다. store 객체를 Provider의 속성 값으로 전달.

```react
import store from './common/store'
import {Provider} from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <div>
      <FriendMain />
      <TimeLineMian />
    </div>
  </Provider>,
  document.getElementById('root')
);

```



#### useSelector, useDispatch

```react
import { useSelector, useDispatch } from 'react-redux';
// ...
  const friends = useSelector((state) => state.friend.friends);
  const dispatch = useDispatch();
```

**useSelector** 훅에 입력되는 함수를 선택자 함수라고 하며, 이 함수가 반환하는 값이 훅의 반환값으로 사용된다. useSelector **훅은 리덕스의 상태 값이 변경되면 이전 반환 값과 새로운 반환 값을 비교**. 두 값이 다른 경우에만 컴포넌트를 다시 렌더링한다.

**useDispatch** 훅은 액션을 발생시키는 dispatch 함수를 반환한다.

*useSelector 사용시 여러 상태 값을 반환 할때의 경우 shallowEqual 을 사용하여 랜더링이 계속 되는 것을 방지하는 방법도 있음.*



#### reselect 패키지

리덕스에서 저장된 데이터를 화면에 보여줄 때는 다양한 형식으로 가공할 필요가 있다. (정렬, 필터 등..)

reselect 패키지는 원본 데이터를 다양한 형태로 가공해서 사용할 수 있도록 도와준다.

선택자 함수를 분리해주는 기능도 갖고 있다.

```
npm install reselect
```



```react
// state/selector.js

import { createSelector } from 'reselect';


const getFriends = state => state.friend.friends;
export const getAgeLimit = state => state.friend.ageLimit;
export const getShowLimit = state => state.friend.showLimit;

export const getFriendsWithAgeLimit = createSelector(
	[getFriends, getAgeLimit],
  // 선택자 함수 
  // 위에서 각각 반환하는 값들로 작성
  (friends, ageLimit) => friends.filter(item => item.age <= ageLimit),
  // 반환되는 값들이 변경 되었을 때만 filter을 실행한다, 아니면 그전에 반환된 값들을 사용한다.
)

export const getFriendsWithAgeLimit = createSelector(
	[getFriendsWithAgeLimit, getShowLimit],
  // 선택자 함수 
  // 위에서 각각 반환하는 값들로 작성
  (friendWithAgeLimit, showLimit) => friendWithAgeLimit.slice(0, showLimit)
)
```

**createSelector 함수를 이용해서 선택자 함수를 만들면 메모이제이션 기능이 동작 가능**

코드가 복잡하다면 selector.js 로 분리해서 사용하자 !

```react
import { getAgeLimit,getShowLimit,  getFriendsWithAgeLimit, getFriendsWithAgeShowLimit} from '../state/selector';

//...

export default function FriendMain() {
  const [ageLimit, showLimit, friendWIthAgeLimit, friendWithAgeShowLimit ] =
        useSelector(
        	state => [
            getAgeLimit(state),
            getShowLimit(state),
            getFriendsWithAgeLimit(state),
  					getFriendsWithAgeShowLimit(state)
          ],
          shallowEqual,
        )
}
```

 하지만, selector 값이 리덕스 값이 아니고 props 로 넘어오는 속성값일때는 메모이제이션 기능이 동작하지 않기 때문에 사용하지 말자.

