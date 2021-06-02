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