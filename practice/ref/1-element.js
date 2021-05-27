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