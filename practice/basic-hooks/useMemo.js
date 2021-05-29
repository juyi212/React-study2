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