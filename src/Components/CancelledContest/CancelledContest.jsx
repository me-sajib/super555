import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation.jsx'
import { BASE_URL } from '../../API/Constants.js'
import { useLocation } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { defaultModalStyle } from '../../Styles/Modal.js'
import { Grid } from '@mui/material'
import { Cancel } from '@mui/icons-material'

export default function CancelledContest() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState()
    const [value, setValue] = useState('1')
    const [questionsList, setQuestionsList] = useState([])
    const [quizState, setQuizState] = useState('instructions')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [contestData, setContestData] = useState({
        name: ''
    })
    const [entryFees, setEntryFees] = useState(10)
    const [participantsList, setParticipantsList] = useState([])
    const [submissionList, setSubmissionsList] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [rewardData, setRewardData] = useState([])
    const [leaderboardData, setLeaderboardData] = useState([])
    const [currentContestId, setCurrentContestId] = useState('')
    const [contestRules, setContestRules] = useState(['Participants must be at least 18 years old to enter.', 'The contest is open to residents of the specified countries.', 'Each participant is allowed only one entry.'])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const getContestDataForUser = (contestId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/contest/commpleted?contestId=${contestId}&uid=${localStorage.getItem('user_id')}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('data.data.contest.rewards: ', data.data.contest.rewards)
                console.log('Data:: :', data)
                if (data.status === 200) {
                    const questions = data.data.contest.questions
                    setContestData(data.data.contest)
                    setParticipantsList(data.data.participants)
                    setUserAnswers(data.data.userAnswers)
                    setSubmissionsList(data.data.submissions)
                    setEntryFees(data.data.contest.entryFees)
                    setQuestionsList(questions)
                    if (data.data.leaderboard) {
                        setLeaderboardData(data.data.leaderboard)
                    }

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
    const [openEditModal, setOpenEditModal] = React.useState(false)
    //EditModal
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(19)
        console.log('Contest Id : ', contestId)
        setCurrentContestId(contestId)
        if (!apiCalled) {
            getContestDataForUser(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div className='text-center bg-red-800 text-white py-2'>
                <div className='text-2xl font-bold'>{contestData.name}</div>
                <h2 className='text-xs text-center my-2'>Contest has been cancelled</h2>
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
                        <div className='pb-60'>
                            <h2 className='text-xs'>The contest has been cancelled. You cannot participate in cancelled contest</h2>
                        </div>
                    </TabPanel>
                    <TabPanel value='2'>
                        <div>
                            {userAnswers.length > 0 &&
                                userAnswers.map((answer, index) => {
                                    return (
                                        <div className='flex border-4 rounded-lg my-4'>
                                            {answer.answer === answer.userAnswer ? <div className='bg-green-600 text-2xl w-20 text-center pt-4 text-white rounded-l'>{index + 1} </div> : <div className='bg-red-500 text-2xl w-20 text-center pt-4 text-white rounded-l'>{index + 1}</div>}
                                            <div className='w-60 p-2'>
                                                {answer.question}
                                                <br />
                                                <span className='text-blue-400 font-bold'>{answer.userAnswer}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            {userAnswers.length === 0 && (
                                <>
                                    <div className='text-base'>You didn't participate in this contest</div>
                                </>
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
                                                <th className='border p-2'>All Participants ({leaderboardData.length})</th>
                                                <th className='border p-2'>Points</th>
                                                <th className='border p-2'>Rank</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboardData.length > 0 &&
                                                leaderboardData.map((eachUser) => {
                                                    return (
                                                        <tr key={eachUser.rank + Math.random()}>
                                                            <td className='border p-2'>
                                                                <div onClick={() => handleUsernameClick(eachUser.username)}>{eachUser.username}</div>
                                                            </td>
                                                            <td className='border p-2 text-center'>-</td>
                                                            <td className='border p-2 text-center'>-</td>
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
                                            return (
                                                <li>
                                                    {index + 1}. {rule}
                                                </li>
                                            )
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
