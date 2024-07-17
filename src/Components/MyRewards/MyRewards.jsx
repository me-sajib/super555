import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../API/Constants'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { showTimeInAgoFormat } from '../../Utils/time'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { updateLocalStorageCoins } from '../../Utils/LocalStore'
import SuccessModal from '../SuccessModal/SuccessModal'
import coinImage from '../../Assets/coin.png'
import super5logo5 from '../../Assets/super5logo5.png'
import CustomAlert from '../CustomAlert/CustomAlert'

function MyRewards() {
    const [apiCalled, setApiCalled] = useState(false)
    const [rewardsList, setRewardsList] = useState([])
    const [userRewardsList, setUserRewardsList] = useState([])
    const [value, setValue] = useState('1')
    const [userCoins, setUserCoins] = useState(0)
    const navigate = useNavigate()

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleReturnHome = () => {
        closeSuccessModal()
    }

    const getSettingsData = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/rewards/redeem/${localStorage.getItem('user_id')}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    setRewardsList(data.data.rewards.list)
                    setUserCoins(data.data.user.coins)
                    updateLocalStorageCoins(data.data.user.coins)
                    setUserRewardsList(data.data.userRewards)
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {})
    }

    const handleRedeemReward = (name, coins, disabled) => {
        if (disabled) {
            setErrorMessage('Not enough coins to redeem this reward')
            setOpenErrorAlert(true)
            return
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: localStorage.getItem('user_id'),
                name,
                coins,
                status: 'Pending'
            })
        }

        fetch(`${BASE_URL}/api/user/reward/redeem`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
                if (data.status === 200) {
                    openSuccessModal()
                    getSettingsData()
                }
            })
            .catch((error) => {})
    }

    useEffect(() => {
        if (!apiCalled) {
            getSettingsData()
        }
    })

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const openSuccessModal = () => setSuccessModalOpen(true)
    const closeSuccessModal = () => setSuccessModalOpen(false)

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

    return (
        <div className='pb-96'>
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
            {!apiCalled && (
                <div className='text-center py-4 bg-gray-100 text-2xl'>
                    <span className='font-bold text-2xl'>No Rewards</span>
                </div>
            )}

            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                            <Tab label='Rewards' value='1' />
                            <Tab label='My Rewards' value='2' />
                        </TabList>
                    </Box>
                    <TabPanel value='1'>
                        <div className='grid grid-cols-2 gap-4'>
                            {rewardsList.length > 0 &&
                                rewardsList.map((reward) => {
                                    const isRedeemDisabled = Number(userCoins) < Number(reward.coins)
                                    const rewardImage = reward.image

                                    if (rewardImage) {
                                        return (
                                            <>
                                                <div className='shadow-md mt-4 p-2 bg-gray-100' key={Math.random()}>
                                                    <div className='flex justify-center items-center'>
                                                        <div className='font-bold'>{reward.name}</div>
                                                    </div>
                                                    <div className='flex justify-center items-center'>
                                                        <img src={reward.image} alt='' className='p-2 w-full md:w-96' />
                                                    </div>
                                                    <div className='my-1 text-center'>
                                                        <Button onClick={() => handleRedeemReward(reward.name, reward.coins, isRedeemDisabled)} sx={{ marginTop: '10px' }} variant='contained' color='success'>
                                                            {reward.coins} coins
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                })}
                        </div>
                    </TabPanel>
                    <TabPanel value='2'>
                        <div className=''>
                            {userRewardsList.length > 0 &&
                                userRewardsList.map((reward) => {
                                    return (
                                        <>
                                            <div className='shadow-md mt-4 p-2 bg-gray-100' key={Math.random()}>
                                                <div className='flex flex-col justify-between'>
                                                    <div className='font-bold'>{reward.name}</div>
                                                    <div className='text-xs py-1'> Update: {reward.note === '' ? 'No update found' : reward.note}</div>
                                                    <div className={`font-bold ${reward.status === 'Complete' ? 'text-green-600' : 'text-red-500'}`}>{reward.status}</div>
                                                    <div className='text-xs'>Redeemed {showTimeInAgoFormat(reward.time)}</div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
            <BottomNavigationComponent />
            <CustomAlert successMessage={successMessage} errorMessage={errorMessage} openSuccessAlert={openSuccessAlert} closeSuccessAlert={closeSuccessAlert} openErrorAlert={openErrorAlert} closeErrorAlert={closeErrorAlert} />
            <SuccessModal open={successModalOpen} handleClose={closeSuccessModal} content={'Your reward request has been received.\n Please check your emails for further details.'} btnText={'View More'} onButtonClick={() => handleReturnHome()} />
        </div>
    )
}

export default MyRewards
