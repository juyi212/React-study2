import React, { useState, useMemo } from 'react'


export default function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [V1, setV1] = useState(0)
  // 이렇게 함수를 입력해서 속성값으로 전달할 때는 이 컴포넌트가 랜더링 될때마다 새로운 함수가 
  // 생성되고 랜더링 되서 자식 컴포넌트인 useedit은 값이 변경이 안되더라도 불필요하게 랜더링 값을 받아야한다
  // 이럴때 useCallback 함수를 사용한다
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