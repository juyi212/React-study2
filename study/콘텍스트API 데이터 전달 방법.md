### 콘텍스트 API 데이터 전달하기

> createContext 사용 ! 기존에는 props or Redux 를 많이 사용했다. 
>
> Provider, Consumer 가 있다.
>
> Provider, Consumer 컴포넌트 사이에 중간에 있는 컴포넌트가 렌더링 되지 않아도 Consumer의 컴포넌트 업데이트가 잘 된다. 

```javascript
import { createContext, useState }from 'react';

const UserContext = createContext('unknown')

export default function App() {
  const [name, setName] = useState('mike')
  return (
  	<div>
    	<UserContext.Provider value={name}>
    		.... // 생략
    	</UserContext.Provider>	
    </div>
  )
}

function Profile() {
  return(
  	<div>
    	<Greeting />
    </div>
  )
}

function Greeting() {
  return(
  	<UserContext.Consumer> // render props 패턴으로 적은 형태 
    	// Provider 까지 올라가서 value 값을 찾아서 들어가게 되고 만약 없다면 초기값이 들어감 
    	{ username => <p>{`${username}님 안녕하세요 `}</p> }
    </UserContext.Consumer>
  )
}

```

그러나 Greeting 함수에서 Provider 로 받아온 username 을 Consumer 밖에서 사용할 수 없다

useContext 훅을 사용하자 !  여러개도 사용 가능 

```javascript
function Greeting() {
  const username = useContext(UserContext)
  return <p>{`${username}님 안녕하세요`}</p>
}
```



#### 주의할 점

1. value = { username, age } 이런식으로 작성하면 다른 상태 값이 변경 되었을 때 consumer에서 불필요하게 랜더링이 된다. 

   - 그럴땐 하나의 객체로 만든다.

   ```javascript
   const [user, setUser] = useState({ username: 'mike', age: 23}) // 이렇게 정의를 한다
   ```

2. Provider 컴포넌트 밖에 Consumer 컴포넌트를 넣으면 값을 못찾는다 

   - 안에 넣는다 해도 Provider 위치를 조금 주의하는 것이 좋다.

요약 ! 

```
useContext를 쓸 때 주의할 사항 
Provider에 제공한 value가 달라지면 useContext를 쓰고 있는 모든 컴포넌트가 리렌더링 된다는 것입니다. value 안에는 setLoading과 setLoggedIn이 들어있고 앞으로 개수가 더 늘어날 가능성이 높습니다. 그 중 하나라도 바뀌면 객체로 묶여있으므로 전체가 리렌더링되는 것입니다. 따라서 잘못 쓰면 엄청난 렉을 유발할 수 있습니다. 해결 방법은 자주 바뀌는 것들을 별도의 컨텍스트로 묶거나(컨텍스트는 여러 개 쓸 수 있습니다. Provider로만 잘 감싸주세요.), 자식 컴포넌트들을 적절히 분리해서 shouldComponentUpdate, PureComponent, React.memo 등으로 감싸주는 것이 있습니다.
```

