## ref 속성값으로 자식 요소에 접근하기

### useRef()



- 특정 요소의 크기를 가져온다거나, 포커스를 설정해야한다거나 특정 DOM을 선택해야할 상황 

```javascript
import React, { useRef , useEffect } from 'react'

export default function App() {
    // 자식요소에 직접 접근할 수 있다.
    const inputRef = useRef();
    useEffect(()=> {
        //current 실제 돔을 가리키게 된다.
        // useeffect 안에서 하는 것에 주목 @
        // 실제 돔 요소는 랜더링 결과가 실제 돔에 반영된 후에 접근할 수 있기 때문에 부수효과 함수에서 접근할 수 있다.
        
        inputRef.current.focus()
    }, [])
    return(
        <div>
            <input type = 'text' ref ={inputRef} />
            {/* <Box ref={inputRef} />  */}
            <button>저장</button>
        </div>
    )
}
```

- 컴포넌트 안에서 조회 및 수정 가능한 변수를 관리하는 용도 

```javascript
import React, { useRef , useEffect } from 'react'

export default function App() {
    // 요소 하나마다 useRef 사용하는게 x
    // ref 객체에 원하는 값 저장하는 용도로 써보기 
    const boxListRef = useRef({});
    function onClick() {
      let maxRight = 0
      let maxId = '';
      for( const box of BOX_LIST ){
        const ref = boxListRef.current[box.id]
        if(ref) {
          // 박스의 정보를 가지고 올 수 있음
          //브라우저 호환성 문제로 엘리먼트의 정확한 위치 값을 얻기가 매우 어려웠습니다. -> 가능하게 해줌 getBoundingClientRect
          const rect = ref.getBoundingClientRect();
          if(maxRight < rect.right){
            maxRight = rect.right
            maxId = box.id
          }
        }
      }
      alert(`오른쪽 끝 요소는 ${maxId} 입니다.`)
    }
    return(
        <div>
            <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100w',
                height: '100%'
            }}
            >
                {BOX_LIST.map(item => (
                    <div
                      key ={item.jd}
                      ref = {ref => (boxListRef.current[item.id] = ref)}
                      style ={{
                        flex: '0 0 auto',
                        width: item.width,
                        height: 100,
                        backgroundColor:'yellow',
                        border: 'solid 1px red'
                      }}
                    >{`box_${item.id}`}</div>
                ))}
            </div>
            <button onClick={onClick}>오른쪽 끝 요소?</button>
        </div>
    );
}

const BOX_LIST = [
    { id: 1, width: 70 },
    { id: 2, width: 100 },
    { id: 3, width: 80 },
    { id: 4, width: 100 },
    { id: 5, width: 90 },
    { id: 6, width: 60 },
    { id: 7, width: 120 },
]
```

#### 주의할 점!

- input 요소가 존재하지 않을 때 -> null 값일 때 

  - 조건부 렌더링에 사용된 요소의 ref객체는 current 요소를 검사해야한다
  - <button onClick={() => inputRef.current && inputRef.crruent.focus()}>

  ```javascript
  export default function App() {
      const inputRef = useRef()
      const [showText, setShowText] = useState(true)
  
      return (
          <div>
              {showText && <input type='text' ref={inputRef} /> }
              <button onClick = {()=> setShowText(!showText)}>
                  텍스트 보이기/ 가리기
              </button>
              <button onClick={() => inputRef.current && inputRef.crruent.focus()}>
                  텍스트로 이동 
              </button>
          </div>
      )
  }
  ```

  