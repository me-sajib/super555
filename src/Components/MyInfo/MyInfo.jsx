import React, { useEffect, useState } from 'react'
import { auth, provider } from '../../firebase-config'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import './MyInfo.css'
import AppLogo from '../../Assets/circle.png'
import { useNavigate } from 'react-router-dom'
import coinImage from '../../Assets/coin.png'
import { BASE_URL } from '../../API/Constants'
import { ArrowBack } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { fetchData } from '../../API/useFetch'

function MyInfo() {
    const navigate = useNavigate()
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

    const handleEditClickUsername = (state) => {
        setIsEditModeUsername(state)
    }

    const handleEditClick = () => {
        setIsEditMode(true)
    }

    const handleSaveClick = () => {}
    const [isVerified, setIsVerified] = useState(false)
    const [showWarning, setShowWarning] = useState(false)

    const handleUsernameSubmit = () => {
        console.log('Username : ', username)
    }

    const handleChangeUsername = (username) => {
        setUsername(username)
        setIsVerified(false)
        setShowUsernameError(false)
    }

    const handleUserData = (data) => {
        try {
            setUserData(data)
            setUsername(data.username)
            setEmail(data.email)
            setFullname(data.fullname)
            setIsAlreadyVerified(data.isVerified)
            setAddress(data.address)
            setPhoneNumber(data.phoneNumber)
            setPinCode(data.pinCode)
            setState(data.state)
        } catch {}
    }

    const getUserProfile = async () => {
        const data = await fetchData(`api/user/profile/${localStorage.getItem('user_id')}`)
        if (data) {
            console.log('User Data : ', data.user)
            handleUserData(data.user)
            setApiCalled(true)
        }
    }

    const onVerifyClick = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: localStorage.getItem('user_id'),
                username,
                type: 'verify'
            })
        }

        fetch(`${BASE_URL}/api/auth/username`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
                if (data.status === 200) {
                    setIsVerified(true)
                } else if (data.status === 400) {
                    setUsernameError(data.data.info)
                    setShowUsernameError(true)
                }
            })
            .catch((error) => {})
    }

    const onOtherInfoSubmit = () => {
        setIsEditMode(false)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: localStorage.getItem('user_id'),
                fullname,
                address,
                phoneNumber,
                pinCode,
                state
            })
        }

        fetch(`${BASE_URL}/api/user/profile`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
                if (data.status === 200) {
                    getUserProfile()
                } else {
                    setIsVerified(false)
                }
            })
            .catch((error) => {})
    }

    const onUsernameSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: localStorage.getItem('user_id'),
                username,
                type: 'update'
            })
        }

        fetch(`${BASE_URL}/api/auth/username`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
                if (data.status === 200) {
                    localStorage.setItem('user_name', username)
                    getUserProfile()
                } else {
                    setIsVerified(false)
                }
            })
            .catch((error) => {})
    }

    const handleReturnHome = () => {
        navigate('/profile')
    }

    useEffect(() => {
        if (!apiCalled) {
            getUserProfile()
        }
    })
    return (
        <>
            {apiCalled && (
                <div className='pb-96'>
                    <div className='text-center py-4 relative bg-gray-800 text-white'>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:font-bold'>
                            <ArrowBack className='font-bold' onClick={() => handleReturnHome()} />
                        </div>
                        <div className='text-2xl font-bold'>My Info And Settings</div>
                    </div>
                    <div className='mt-8 flex flex-col gap-8 items-center justify-center px-2'>
                        <div className='w-full'>
                            <TextField disabled={isAlreadyVerified} sx={{ width: '95%' }} label={`Username`} value={username} onChange={(e) => handleChangeUsername(e.target.value)} />
                        </div>
                        {showUsernameError && <div className='text-red-700 text-base font-bold'> {userNameError}</div>}
                        {isAlreadyVerified && <div className='text-green-700 text-base font-bold'> Username already verified 🎉</div>}

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
                                        Update
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <hr className='mt-8' />
                    <div className='mt-8 flex flex-col gap-8 items-center justify-center px-2'>
                        <div className='w-full'>
                            <TextField disabled={!isEditMode} sx={{ width: '95%' }} label={`Full Name`} value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <TextField disabled={true} sx={{ width: '95%' }} label={`Email`} value={email} />
                        </div>
                        <div className='w-full'>
                            <TextField disabled={!isEditMode} sx={{ width: '95%' }} label={`Mobile Number`} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <TextField disabled={!isEditMode} sx={{ width: '95%' }} label={`Address`} value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <TextField disabled={!isEditMode} sx={{ width: '95%' }} label={`State`} value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <TextField disabled={!isEditMode} sx={{ width: '95%' }} label={`PIN Code`} value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                        </div>
                        <div className='flex flex-row gap-8'>
                            {!isEditMode && (
                                <div>
                                    <Button sx={{ marginTop: '10px' }} variant='contained' color='info' onClick={handleEditClick}>
                                        Edit User Info
                                    </Button>
                                </div>
                            )}

                            {isEditMode && (
                                <div>
                                    <Button sx={{ marginTop: '10px' }} variant='contained' color='success' onClick={onOtherInfoSubmit}>
                                        Save Info
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MyInfo
