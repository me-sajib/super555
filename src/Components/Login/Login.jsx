import React, { useEffect, useState } from 'react'
import { auth, provider } from '../../firebase-config'
import { signInWithPopup } from 'firebase/auth'
import './Login.css'
import AppLogo2 from '../../Assets/super5logo5.png'
import Carousel from 'react-material-ui-carousel'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../API/Constants'
import slider4 from '../../Assets/slider4.gif'
import CustomAlert from '../CustomAlert/CustomAlert'
import { TextField } from '@mui/material'

var items = [slider4]

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const [referralCode, setReferralCode] = useState(queryParams.get('referralCode') || '')
    const [sliderImages, setSliderImages] = useState([])
    const [apiCalled, setApiCalled] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        // Update referral code when query parameter changes
        setReferralCode(queryParams.get('referralCode') || '')
    }, [location.search])

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    const handleSliderImages = (imagesList) => {
        let sliderList = []
        imagesList.forEach((image) => {
            if (image.length > 0) {
                sliderList.push(image)
            }
        })
        setSliderImages(sliderList)
    }

    const getLoginPageData = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/pages/login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    handleSliderImages(data.data.sliderImages)
                    setApiCalled(true)
                }
            })
            .catch((error) => {})
    }

    const setUserInfoInLocal = (user) => {
        localStorage.setItem('isAuth', true)
        localStorage.setItem('user_id', user.uid)
        localStorage.setItem('user_name', user.displayName)
        localStorage.setItem('user_email', user.email)
        localStorage.setItem('user_photoURL', user.photoURL)
        localStorage.setItem('user_createdAt', user.metadata.createdAt)
        localStorage.setItem('user_lastActiveAt', user.metadata.lastLoginAt)
        addUserDataToDB(user.uid, user.displayName, user.email, user.metadata.createdAt)
        navigate('/')
    }

    const handleOpenLink = (page) => {
        if (page === 'privacy_policy') {
            window.open('https://docs.google.com/document/d/e/2PACX-1vTTPgG4jKLBCdAL-G9ucIJfZTHJ9k0UFiCdqtW_jKGM5S0A8wG0-0VFhTELHLmliLVVfRcJ3K6d88b3/pub', '_blank')
        } else if (page === 'terms_and_conditions') {
            window.open('https://docs.google.com/document/d/e/2PACX-1vSTD88F9JDUGR7zUUY2ITW1HA5LyoApajHjRyDnEV_neN0UyRV3m2VU38pkLjsi8ZhFQvuK3AKQQulO/pub', '_blank')
        }
    }

    const addUserDataToDB = (uid, username, email, createdAt) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid,
                username,
                email,
                createdAt,
                referralCode
            })
        }

        fetch(`${BASE_URL}/api/user/signin`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
            })
            .catch((error) => {})
    }

    const signInWithGoogle = () => {
        if (!isChecked) {
            setErrorMessage('Please accept Terms  of Use')
            setOpenErrorAlert(true)
            return
        }
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('Result User : ', result)
                setUserInfoInLocal(result.user)
            })
            .catch((error) => {
                console.log('Auth Error : ', error)
            })
    }

    const [successMessage, setSuccessMessage] = useState('Success')
    const [errorMessage, setErrorMessage] = useState('Error')
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
    const closeSuccessAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSuccessAlert(false)
    }
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const closeErrorAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenErrorAlert(false)
    }

    const handleRoute = (url) => {
        navigate(url)
    }

    useEffect(() => {
        if (!apiCalled) getLoginPageData()
    })
    return (
        <div className='min-h-screen bg-gray-800'>
            <div className='bg-headerColor text-white px-4 py-3'>
                <div className='flex justify-center items-center'>
                    <img className='w-32 rounded-lg' src={AppLogo2} alt='' />
                </div>
            </div>
            <div className='bg-gray-800 p-4'>
                {sliderImages.length > 0 ? (
                    <Carousel>
                        {sliderImages.map((item, i) => (
                            <Item key={i} item={item} />
                        ))}
                    </Carousel>
                ) : (
                    <Carousel>
                        {items.map((item, i) => (
                            <Item key={i} item={item} />
                        ))}
                    </Carousel>
                )}
            </div>
            <div className='signin__container bg-gray-800 pt-4 text-white pb-96'>
                <div className='subheading__2'>We currently accept only Google Signin / Signup</div>
                <button className='login-with-google-btn' onClick={signInWithGoogle}>
                    Continue With Google
                </button>

                <div className='mt-8 bg-blue-500 p-4 rounded-lg cursor-pointer' onClick={() => handleRoute('/mobile-login')}>Login with Mobile</div>

                <div className='mt-8'>Have any referral code?</div>
                <TextField
                    value={referralCode}
                    onChange={(event) => setReferralCode(event.target.value)}
                    sx={{
                        color: '#ffffff',
                        borderRadius: '10px',
                        margin: '8px 0',
                        border: 'white 1px solid',
                        '& input': {
                            color: '#ffffff'
                        },
                        width: '350px'
                    }}
                />
                <div className='flex justify-center items-center mx-8 mt-4 text-xs'>
                    <label className={isChecked ? '' : 'text-red-400'}>
                        <input className='mt-2 p-2' type='checkbox' checked={isChecked} onChange={handleCheckboxChange} /> I certify that, i am above 18 years old and agreed to all{' '}
                        <span className='underline cursor-pointer' onClick={() => handleOpenLink('terms_and_conditions')}>
                            Terms and Conditions
                        </span>{' '}
                        &{' '}
                        <span className='underline cursor-pointer' onClick={() => handleOpenLink('privacy_policy')}>
                            Privacy Policy
                        </span>
                    </label>
                </div>
            </div>

            <CustomAlert successMessage={successMessage} errorMessage={errorMessage} openSuccessAlert={openSuccessAlert} closeSuccessAlert={closeSuccessAlert} openErrorAlert={openErrorAlert} closeErrorAlert={closeErrorAlert} />
        </div>
    )
}

function Item(props) {
    if (props.item.length > 0) {
        return (
            <div className='flex justify-center align-center bg-white'>
                <img className='w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3' src={props.item} alt='src' />
            </div>
        )
    }
}

export default Login
