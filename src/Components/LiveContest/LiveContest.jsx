import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { BASE_URL } from '../../API/Constants'
import { useLocation } from 'react-router-dom'
import { Grid } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { defaultModalStyle } from '../../Styles/Modal.js'
import { Cancel } from '@mui/icons-material'

export default function LiveContest() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState()
    const [value, setValue] = useState('1')
    const [contestData, setContestData] = useState({
        name: ''
    })
    const [userAnswers, setUserAnswers] = useState([])
    const [rewardData, setRewardData] = useState([])
    const [currentContestId, setCurrentContestId] = useState('')
    const [contestRules, setContestRules] = useState(['The contest is open to residents of the specified countries.', 'Each participant is allowed only one entry.'])
    const [submissionList, setSubmissionsList] = useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const getContestDataForUser = (contestId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/contest/live?contestId=${contestId}&uid=${localStorage.getItem('user_id')}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    setContestData(data.data.contest)
                    setUserAnswers(data.data.userAnswers)
                    setSubmissionsList(data.data.submissions)

                    if (data.data.contest.rules) {
                        setContestRules(data.data.contest.rules)
                    }
                    if (data.data.contest.rewards) {
                        setRewardData(data.data.contest.rewards)
                    }
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {
                console.log('Error : ', error)
            })
    }

    const getUserSubmissions = (username) => {
        try {
            for (const user of submissionList) {
                if (user.username === username) {
                    return user.submissions
                }
            }

            // Return null or handle the case when the username is not found
            return null
        } catch {
            return null
        }
    }

    const [modalSubmissions, setModalSubmissions] = useState([])
    const [modalUsername, setModalUsername] = useState('')
    const handleUsernameClick = (user) => {
        handleOpen()
        const data = getUserSubmissions(user)
        setModalUsername(user)
        setModalSubmissions(data)
        console.log('Data : ', data)
    }

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(14)
        console.log('Contest Id : ', contestId)
        setCurrentContestId(contestId)
        if (!apiCalled) {
            getContestDataForUser(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div className='text-center bg-gray-800 text-white py-2'>
                <div className='text-2xl font-bold'>{contestData.name}</div>
                <h2 className='text-xs text-center my-2'>Contest is live!</h2>
            </div>
            <Box sx={{ width: '100%', typography: 'body1', marginBottom: '300px' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 2, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                            <Tab sx={{ fontSize: '12px' }} label='Contest' value='1' />
                            <Tab sx={{ fontSize: '12px' }} label='My Picks' value='2' />
                            <Tab sx={{ fontSize: '12px' }} label='Leaderboard' value='3' />
                            <Tab sx={{ fontSize: '12px' }} label='Rules' value='4' />
                        </TabList>
                    </Box>
                    <TabPanel value='1'>
                        {contestData.name.length > 0 && (
                            <div className='pb-60'>
                                <h2 className='text-xs'>The contest is live. You cannot participate in Live contest</h2>
                                {rewardData.length > 0 && (
                                    <div className='flex items-center justify-center my-10 mx-4'>
                                        <table className='border border-collapse border-gray-800'>
                                            <thead>
                                                <tr>
                                                    <th className='border p-2'>Rank</th>
                                                    {/* <th className='border p-2'>Reward</th> */}
                                                    <th className='border p-2'>Coins</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rewardData.length > 0 &&
                                                    rewardData.map((data, index) => (
                                                        <tr key={data.rank}>
                                                            <td className='border p-2'>{data.rank}</td>
                                                            {/* <td className='border p-2'>{data.reward}</td> */}
                                                            <td className='border p-2'>{data.coins}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabPanel>
                    <TabPanel value='2'>
                        <div>
                            {userAnswers.length > 0 &&
                                userAnswers.map((answer, index) => {
                                    return (
                                        <div className='flex border-4 rounded-lg my-4'>
                                            <div className='bg-orange-600 text-2xl w-20 text-center pt-4 text-white rounded-l'>{index + 1}</div>
                                            <div className='w-60 p-2'>
                                                {answer.question}
                                                <br />
                                                <span className='text-blue-400 font-bold'>{answer.answer}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            {userAnswers.length === 0 && (
                                <div className='my-4'>
                                    <h2 className='text-xs'>You have no submissions for this contest</h2>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel value='3'>
                        <Grid align='' justify='center' sx={{}}>
                            <Grid>
                                {
                                    <table className='border border-collapse border-gray-800 w-full'>
                                        <thead>
                                            <tr className='bg-gray-800 text-white'>
                                                <th className='border p-2'>All Participants ({submissionList.length})</th>
                                                <th className='border p-2'>Points</th>
                                                <th className='border p-2'>Rank</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissionList.length > 0 &&
                                                submissionList.map((eachUser) => {
                                                    return (
                                                        <tr key={eachUser.rank + Math.random()}>
                                                            <td className='border p-2'>
                                                                <div onClick={() => handleUsernameClick(eachUser.username)}>{eachUser.username}</div>
                                                            </td>
                                                            <td className='border p-2 text-center'>{'-'}</td>
                                                            <td className='border p-2 text-center'>{'-'}</td>
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>
                                }
                            </Grid>
                            <Modal
                                aria-labelledby='transition-modal-title'
                                aria-describedby='transition-modal-description'
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                                slots={{ backdrop: Backdrop }}
                                slotProps={{
                                    backdrop: {
                                        timeout: 500
                                    }
                                }}>
                                <Fade in={open}>
                                    <Box sx={defaultModalStyle}>
                                        <div className='flex flex-col gap-6 justify-center'>
                                            <div className='fixed top-2 right-2 hover:bg-gray-800' onClick={handleClose}>
                                                <Cancel />
                                            </div>

                                            <h1 className='text-center text-2xl font-bold text-gray-700'>{modalUsername}</h1>

                                            {modalSubmissions.length > 0 &&
                                                modalSubmissions.map((submission, index) => {
                                                    return (
                                                        <>
                                                            <div className='flex border-4 rounded-lg'>
                                                                {submission.answer === submission.userAnswer ? <div className='bg-green-600 text-2xl w-20 text-center pt-4 text-white rounded-l'>{index + 1} </div> : <div className='bg-red-500 text-2xl w-20 text-center pt-4 text-white rounded-l'>{index + 1}</div>}
                                                                <div className='w-80 p-2'>
                                                                    {submission.question}
                                                                    <br />
                                                                    <span className='text-blue-400 font-bold'>{submission.userAnswer}</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                        </div>
                                    </Box>
                                </Fade>
                            </Modal>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='4'>
                        <>
                            <div>
                                <ol>
                                    {contestRules.length > 0 &&
                                        contestRules.map((rule, index) => {
                                            return <li>{index + 1}. {rule}</li>
                                        })}
                                </ol>
                            </div>
                        </>
                    </TabPanel>
                </TabContext>
            </Box>
            <BottomNavigationComponent />
        </>
    )
}
