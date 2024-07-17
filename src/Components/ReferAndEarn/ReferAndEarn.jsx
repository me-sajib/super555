import React, { useEffect, useState } from 'react'
import './ReferAndEarn.css'
import { useNavigate } from 'react-router-dom'
import coinImage from '../../Assets/coin.png'
import GiftIcon from '../../Assets/gift.gif'
import { BASE_URL } from '../../API/Constants'
import { Button, TextField } from '@mui/material'
import { fetchData } from '../../API/useFetch'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import super5logo5 from '../../Assets/super5logo5.png'
import ShareOnWhatsApp from '../ShareComponent/ShareOnWhatsApp'

function ReferAndEarn() {
    const navigate = useNavigate()
    const [referralCode, setReferralCode] = useState('')
    const [referredBy, setReferredBy] = useState('')
    const [showFriendName, setShowFriendName] = useState(false)
    const [referralFriendMessage, setReferralFriendMessage] = useState('')

    const [isEditMode, setIsEditMode] = useState(false)
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false)
    const [isEditModeUsername, setIsEditModeUsername] = useState(false)
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [fullname, setFullname] = useState('')
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [pinCode, setPinCode] = useState(null)
    const [state, setState] = useState('')
    const [username, setUsername] = useState(localStorage.getItem('user_name'))
    const [userData, setUserData] = useState(null)
    const [apiCalled, setApiCalled] = useState(false)
    const [userNameError, setUsernameError] = useState('')
    const [showUsernameError, setShowUsernameError] = useState(false)

    const [isVerified, setIsVerified] = useState(false)

    const handleUserData = (data) => {
        try {
            setUserData(data)
            setReferralCode(data.referralCode)

            if (data.referredBy) {
                console.log('data.referredBy : ', data.referredBy)
                setReferredBy(data.referredBy)
                setIsAlreadyVerified(true)
            }

            setFullname(data.fullname)
            setAddress(data.address)
            setPhoneNumber(data.phoneNumber)
            setPinCode(data.pinCode)
            setState(data.state)
        } catch {}
    }

    const getUserProfile = async () => {
        const data = await fetchData(`api/user/profile/${localStorage.getItem('user_id')}`)
        if (data) {
            console.log('User Data : ', data)
            handleUserData(data.user)
            setApiCalled(true)
        }
    }

    const onVerifyClick = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/referral/${referredBy}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
                if (data.status === 200) {
                    setIsVerified(true)
                    setReferralFriendMessage(data.data.info)
                    setShowFriendName(true)
                } else if (data.status === 400) {
                    setShowUsernameError(true)
                    setUsernameError(data.data.info)
                }
            })
            .catch(() => {})
    }

    const onUsernameSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: localStorage.getItem('user_id'),
                referralCode: referredBy
            })
        }

        fetch(`${BASE_URL}/api/user/referral`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
                if (data.status === 200) {
                    getUserProfile()
                } else {
                    setIsVerified(false)
                }
            })
            .catch(() => {})
    }

    useEffect(() => {
        if (!apiCalled) {
            getUserProfile()
        }
    })
    return (
        <>
            {apiCalled && (
                <div className='min-h-screen pb-48 bg-gray-200'>
                    <div className='bg-headerColor text-white flex justify-between px-4 py-3'>
                        <div>
                            <img className='w-32' src={super5logo5} alt='' />
                        </div>
                        <div className='flex align-center justify-center items-center gap-2'>
                            <div className='font-bold text-xl'>{localStorage.getItem('user_coins') || 0}</div>
                            <div>
                                <img src={coinImage} alt='' className='w-8 h-8' />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center bg-headerColor pb-4'>
                        <img className='h-24 w-24' src={GiftIcon} alt='' />
                        <div className='text-white font-bold uppercase pt-4'>Earn 50 💰 coins for referring</div>
                    </div>
                    <div className='bg-gray-200 py-4 flex flex-col gap-4 items-center justify-center px-2'>
                        <div className='font-bold text-base'>Your referral code</div>
                        <div className='text-4xl font-bold text-blue-500'>{referralCode}</div>
                    </div>
                    <div className='bg-gray-200 p-4'>
                        <div className='text-xs'>• Share this referral code with your friend</div>
                        <div className='text-xs'>• Your friend will earn 50 coins along with you.</div>
                    </div>
                    <ShareOnWhatsApp
                        referralCode={referralCode}
                    />
                    <div className='bg-gray-200 pt-8 flex flex-col gap-8 items-center justify-center px-2'>
                        <div className='font-bold text-base'>Were you referred by your friend?</div>
                        <div className='w-full'>
                            <TextField disabled={isAlreadyVerified} sx={{ width: '95%' }} label={`Enter referral code`} value={referredBy} onChange={(e) => setReferredBy(e.target.value)} />
                        </div>
                        {showFriendName && <div className='text-green-700 text-base font-bold'> {referralFriendMessage} 🎉</div>}
                        {showUsernameError && <div className='text-red-700 text-base font-bold'> {userNameError}</div>}
                        {isAlreadyVerified && <div className='text-green-700 text-base font-bold'> Already using referral code 🎉</div>}

                        {!isAlreadyVerified && (
                            <div className='flex flex-row gap-2 items-left'>
                                <div className=''>
                                    {!isVerified && (
                                        <Button sx={{}} variant='contained' color='info' onClick={() => onVerifyClick()}>
                                            Verify
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    <Button disabled={!isVerified} sx={{}} variant='contained' color='success' onClick={() => onUsernameSubmit()}>
                                        Redeem 50 coins
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <BottomNavigationComponent />
        </>
    )
}

export default ReferAndEarn
