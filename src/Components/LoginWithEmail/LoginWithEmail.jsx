/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../API/Constants'

function LoginWithEmail() {
    const [action, setAction] = useState('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [otp, setOtp] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSendOtp = async (actionType) => {
        try {
            if (email === '') {
                console.log('Email is required...')
                setError('Email is required!')
                return
            }
            await axios.post(`${BASE_URL}/api/auth/v3/otp`, { email, type: actionType })
            // setIsOtpSent(true) //of by abdullah
        } catch (err) {
            // setError(err.response.data.message)
        } finally {
        }
    }

    const setUserInfoInLocal = (user) => {
        localStorage.setItem('isAuth', true)
        localStorage.setItem('user_id', user.uid)
        localStorage.setItem('user_name', user.fullname)
        localStorage.setItem('user_email', user.email)
        localStorage.setItem('user_createdAt', user.createdAt)
        localStorage.setItem('user_lastActiveAt', user.createdAt)
        navigate('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/v3/signup`, { name, email, otp, referralCode })
            console.log('Signup success:', response.data)
            if (response.data.status === 200) {
                setUserInfoInLocal(response.data.data.user)
            } else {
                setError('Something went wrong! Try again')
            }
        } catch (err) {
            console.log('Error : ', err)
            setError(err.response.data.data.info)
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/v3/signin`, { email, otp })
            console.log('Signup success:', response.data)
            if (response.data.status === 200) {
                setUserInfoInLocal(response.data.data.user)
            } else {
                setError('Something went wrong! Try again')
            }
        } catch (err) {
            console.log('Error : ', err)
        }
    }

    const handleActionClick = (newAction) => {
        setAction(newAction)
        setIsOtpSent(false)
        setEmail('')
        setReferralCode('')
        setOtp('')
        setName('')
        setError('')
    }

    const handleMobileLogin = () => {
        navigate('/login')
    }

    return (
        <div className='bg-gray-100 p-4 h-screen'>
            <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                {action === 'login' && (
                    <>
                        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                            <img className='mx-auto h-32 w-auto bg-gray-800 p-4 rounded-2xl' src='/logo_1.png' alt='Super5' />
                            <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Login to Super5</h2>
                        </div>
                        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                            <form onSubmit={handleLoginSubmit} className='space-y-6'>
                                <div>
                                    <label htmlFor='email' className='text-left block text-sm font-medium leading-6 text-gray-900'>
                                        Email address
                                    </label>
                                    <div className='mt-2'>
                                        <input id='email' name='email' required type='email' autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                                    </div>

                                    {!isOtpSent && (
                                        <div className='mt-4'>
                                            <button type='button' onClick={() => handleSendOtp('login')} className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                                Send OTP
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {isOtpSent && (
                                        <div>
                                            <label htmlFor='otp' className='mt-4 text-left block text-sm font-medium leading-6 text-gray-900'>
                                                OTP
                                            </label>
                                            <div className='mt-2'>
                                                <input id='otp' name='otp' type='text' autoComplete='one-time-code' required value={otp} onChange={(e) => setOtp(e.target.value)} className='p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                                            </div>
                                            <div className='mt-8'>
                                                <button type='submit' className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                                    Login
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                            {error && <div className='mt-4 text-red-500 p-2 rounded text-center'>{error}</div>}
                            <p className='mt-10 text-center text-sm text-gray-500'>
                                New User?
                                <button onClick={() => handleActionClick('signup')} className='ml-2 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                                    Create your account
                                </button>
                            </p>
                        </div>
                    </>
                )}

                {action === 'signup' && (
                    <>
                        <div className='sm:mx-auto sm:w-full sm:max-w-sm mt-4'>
                            <img className='mx-auto h-32 w-auto bg-gray-800 p-4 rounded-2xl' src='/logo_1.png' alt='Super5' />
                            <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Signup for Super5</h2>
                        </div>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label htmlFor='name' className='text-left block text-sm font-medium leading-6 text-gray-900'>
                                    Name
                                </label>
                                <div className='mt-2'>
                                    <input id='name' name='name' type='text' autoComplete='name' required value={name} onChange={(e) => setName(e.target.value)} className='p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='email' className='text-left block text-sm font-medium leading-6 text-gray-900'>
                                    Have any Referral Code? <span className='text-xs font-light'>Optional</span>
                                </label>
                                <div className='mt-2'>
                                    <input id='referralCode' name='referralCode' type='text' autoComplete='email' value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className='p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='email' className='text-left block text-sm font-medium leading-6 text-gray-900'>
                                    Email address
                                </label>
                                <div className='mt-2'>
                                    <input id='email' name='email' type='email' autoComplete='email' required value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                                </div>
                                {!isOtpSent && (
                                    <div className='mt-2'>
                                        <button type='button' onClick={() => handleSendOtp('signup')} className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                            Send OTP
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isOtpSent && (
                                <div>
                                    <label htmlFor='otp' className='text-left block text-sm font-medium leading-6 text-gray-900'>
                                        OTP
                                    </label>
                                    <div className='mt-2'>
                                        <input id='otp' name='otp' type='text' autoComplete='one-time-code' required value={otp} onChange={(e) => setOtp(e.target.value)} className='p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                                    </div>
                                    <div className='mt-8'>
                                        <button type='submit' className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                            Signup
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                        {error && <div className='mt-4 text-red-500 p-2 rounded text-center'>{error}</div>}
                        <p className='mt-10 text-center text-sm text-gray-500'>
                            Already have an account?
                            <button onClick={() => handleActionClick('login')} className='ml-2 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                                Login
                            </button>
                        </p>
                    </>
                )}
            </div>
            <p className='mt-10 text-center text-sm text-gray-500'>
                Want to use phone number?
                <button onClick={() => handleMobileLogin()} className='ml-2 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                    Mobile Login
                </button>
            </p>
        </div>
    )
}

export default LoginWithEmail
