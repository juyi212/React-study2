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