import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase-config'
import { fetchData } from '../../API/useFetch'
import { showTimeInAgoFormat } from '../../Utils/time'
import coinImage from '../../Assets/coin.png'

function Profile() {
    const [apiCalled, setApiCalled] = useState(false)
    const [coinHistory, setCoinHistory] = useState([])
    const [userData, setUserData] = useState({ username: '', coins: 0 })
    const handleSignOut = () => {
        signOut(auth).then(() => {
            localStorage.clear()
            window.location.pathname = '/login'
        })
    }

    const getUserProfile = async (uid) => {
        const data = await fetchData(`api/user/profile/${uid}`)
        if (data) {
            setApiCalled(true)
            setUserData(data.user)
            setCoinHistory(data.coinHistory)
        }
    }

    useEffect(() => {
        if (!apiCalled) {
            getUserProfile(localStorage.getItem('user_id'))
        }
    })

    const showType = (type) => {
        if (type === 'join') {
            return 'Contest Entry Fees'
        } else if (type === 'reward') {
            return 'Contest Reward'
        }
    }

    return (
        <>
            <div className='bg-gray-800 text-white flex justify-between px-4 min-h-full'>
                <div className='text-base font-bold text-center py-2'>My Super 5</div>
                <div className='flex align-center justify-center items-center gap-2'>
                    <div className='font-bold text-xl'>{localStorage.getItem('user_coins') || 0}</div>
                    <div>
                        <img src={coinImage} alt='' className='w-8 h-8' />
                    </div>
                </div>
            </div>
            <div className='signin__container'>
                <div className='logo__container__2'>
                    <img src={localStorage.getItem('user_photoURL')} alt='' />
                </div>
                <div className='text-2xl font-bold mt-2'>{localStorage.getItem('user_name')}</div>
                {userData.username.length > 0 && <div className='text-xl my-2'>Coins : {userData.coins}</div>}
                <div className='subheading'>{localStorage.getItem('user_email')}</div>
                <button class='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 border-b-4 border-red-700 rounded' onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
            <div>
                {coinHistory.length > 0 && (
                    <>
                        <div className='text-center text-2xl text-gray-600 mt-16 font-bold'>Coin History</div>
                        <div className='flex items-center justify-center mt-2 mx-4 my-32'>
                            <table className='border border-collapse border-gray-800'>
                                <thead>
                                    <tr>
                                        <th className='border p-2'>Type</th>
                                        <th className='border p-2'>Time</th>
                                        <th className='border p-2'>Coins</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coinHistory.length > 0 &&
                                        coinHistory.map((data, index) => (
                                            <tr key={data.rank}>
                                                <td className='border p-2'>{showType(data.type)}</td>
                                                <td className='border p-2'>{showTimeInAgoFormat(data.createdAt)}</td>
                                                {data.type === 'join' && <td className='border p-2 text-red-500 font-bold'>-{data.coins}</td>}
                                                {data.type === 'reward' && <td className='border p-2 text-green-500 font-bold'>+{data.coins}</td>}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
            <BottomNavigationComponent />
        </>
    )
}

export default Profile
