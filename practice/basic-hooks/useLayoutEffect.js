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