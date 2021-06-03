### 속성값 타입 정의하기 : prop-types

> 자바 스크립트는 동적 타입 언어이다. 타입에 대한 고민을 안하고 바로 프로그램을 작성, 실행을 할 수 있다.
>
> 하지만, 큰 규모 일때는 오류가 발생할 가능성이 크다. 가능하면 정적타입 언어를 사용하는 것이 좋다 -> 타입스크립트
>
> 여건이 되지않아 js를 써야할 경우 prop-types 패키지를 사용!



- 예시 

 ```react
 import PropTypes from 'prop-types';
 
 User.propTypes = {
   male : PropTypes.bool.isRequired,
   age : PropTypes.number,
   type: PropTypes.oneOf(['gold', 'silver', 'bronze']),
   onChangeName: PropTypes.func, // 자세한 타입까지는 정의할 수 없다.
   onChangeTitle: PropTypes.func.isRequired
 };
 
 export default function User({ type, age, male, onChangeName, onChangeTitle}){
   ...
 }
 ```



```
타입스크립트를 공부하는게 더 나을 거 같다...
```

