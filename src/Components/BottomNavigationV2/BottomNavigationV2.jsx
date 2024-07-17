/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BottomNavigationV2 = ({ currentScreen }) => {
    const navigate = useNavigate()
    const Menus = [
        { name: 'Rewards', icon: 'gift', dis: 'translate-x-0' },
        { name: 'Matches', icon: 'flash', dis: 'translate-x-16' },
        { name: 'Home', icon: 'home-outline', dis: 'translate-x-32' },
        { name: 'Refer', icon: 'paper-plane', dis: 'translate-x-48' },
        { name: 'Profile', icon: 'person', dis: 'translate-x-64' }
    ]
    const handleNavigation = (currentScreen) => {
        console.log('Current Screen : ', currentScreen)
        if (currentScreen === 0) {
            navigate('/my-rewards')
        } else if (currentScreen === 1) {
            navigate('/my-contests')
        } else if (currentScreen === 2) {
            navigate('/')
        } else if (currentScreen === 3) {
            navigate('/refer-and-earn')
        } else if (currentScreen === 4) {
            navigate('/profile')
        } else {
            navigate('/')
        }
    }
    const [active, setActive] = useState(currentScreen)
    return (
        <Box sx={{ width: '100%', position: 'fixed', bottom: 0, height: '70px', backgroundColor: '#c24545' }}>
            <div className='flex items-center justify-center bg-gray-800 max-h-[4.4rem] px-6'>
                <ul className='flex relative'>
                    <span
                        className={`bg-blue-600 duration-500 ${Menus[active].dis} border-4 border-gray-900 h-16 w-16 absolute
         -top-5 rounded-full`}>
                        <span
                            className='w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] 
          rounded-tr-[11px] shadow-myShadow1'></span>
                        <span
                            className='w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] 
          rounded-tl-[11px] shadow-myShadow2'></span>
                    </span>
                    {Menus.map((menu, i) => (
                        <li key={i} className='w-16'>
                            <a className='flex flex-col text-center pt-7' onClick={() => handleNavigation(i)}>
                                <span className={`text-xl cursor-pointer text-white duration-500 ${i === active && '-mt-6 text-white'}`}>
                                    <ion-icon name={menu.icon}></ion-icon>
                                </span>
                                <span className={` ${active === i ? 'text-white translate-y-4 duration-700 opacity-100' : 'text-white opacity-0'} `}>{menu.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </Box>
    )
}

export default BottomNavigationV2
