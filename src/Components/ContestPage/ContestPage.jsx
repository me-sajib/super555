/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import iPhoneImage from '../../Assets/iphone-img.jpeg'
import { BASE_URL } from '../../API/Constants'
import { customSleep, formatTimeInStartsInFormat } from '../../Utils/time'
import { useLocation, useNavigate } from 'react-router-dom'
import { capitalizeWordsInSentence } from '../../Utils/String'
import { Edit } from '@mui/icons-material'
import { defaultModalStyle } from '../../Styles/Modal'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { Cancel } from '@mui/icons-material'
import { Button } from '@mui/material'
import CustomAlert from '../CustomAlert/CustomAlert'

export default function ContestPage() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState()
    const [value, setValue] = useState('1')
    const uid = localStorage.getItem('user_id')
    const navigate = useNavigate()
    const [questionsList, setQuestionsList] = useState([])
    const [quizState, setQuizState] = useState('instructions')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedCorrectScore, setSelectedCorrectScore] = useState(0)
    const [selectedIncorrectScore, setSelectedIncorrectScore] = useState(0)
    const [contestData, setContestData] = useState({
        name: '',
        questions: []
    })
    const [entryFees, setEntryFees] = useState(10)
    const [participantsList, setParticipantsList] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [rewardData, setRewardData] = useState(null)
    const [currentContestId, setCurrentContestId] = useState('')
    const [contestRules, setContestRules] = useState(['Participants must be at least 18 years old to enter.', 'The contest is open to residents of the specified countries.', 'Each participant is allowed only one entry.'])
    const [userCoins, setUserCoins] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleUserData = (user) => {
        try {
            if (user.coins) {
                console.log(typeof user.coins)
                setUserCoins(user.coins)
            }
        } catch { }
    }

    const getContestDataForUser = (contestId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/contest?contestId=${contestId}&uid=${localStorage.getItem('user_id')}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    const questions = data.data.contest.questions
                    setContestData(data.data.contest)
                    setParticipantsList(data.data.participants)
                    setUserAnswers(data.data.userAnswers)
                    setEntryFees(data.data.contest.entryFees)
                    setQuestionsList(questions)
                    handleUserData(data.data.user)

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

    const handleDeductCoins = (uid) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid,
                contestId: currentContestId,
                type: 'join',
                coins: entryFees
            })
        }

        fetch(`${BASE_URL}/api/user/transaction`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
            })
            .catch((error) => { })
    }

    const handleStartQuiz = () => {
        handleDeductCoins(localStorage.getItem('user_id'), 10)
        navigate('/quiz-page/' + currentContestId)
        setQuizState('question')
        setSelectedOption(null)
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionsList.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        } else {
            setQuizState('completed')
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
        }
    }

    const updateLocalOptions = (questionId, selectedOption) => {
        const newData = []
        userAnswers.forEach((answer) => {
            if (answer.questionId === questionId) {
                answer.answer = selectedOption
                newData.push(answer)
            } else {
                newData.push(answer)
            }
        })
        setUserAnswers(newData)
    }

    const handleOptionSelect = (selectedOption, questionId) => {
        updateLocalOptions(questionId, selectedOption)
        setSelectedOption(selectedOption)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contestId: currentContestId,
                questionId,
                uid: localStorage.getItem('user_id'),
                userAnswer: selectedOption,
                correctScore: selectedCorrectScore,
                incorrectScore: selectedIncorrectScore
            })
        }

        console.log('Request Options : ', requestOptions)

        fetch(`${BASE_URL}/api/contest/user/submission`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
            })
            .catch((error) => { })
    }

    const handleReturnHome = () => {
        navigate('/')
    }

    const [modalSubmissions, setModalSubmissions] = useState([])
    const [modalUsername, setModalUsername] = useState('')
    const [modalQuestion, setModalQuestion] = useState('')
    const [modalOptions, setModalOptions] = useState([])
    const [modalQuestionId, setModalQuestionId] = useState('')
    const [modalUserAnswer, setModalUserAnswer] = useState('')
    const [modalNewOption, setModalNewOption] = useState(null)

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

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const openSuccessModal = () => setSuccessModalOpen(true)
    const closeSuccessModal = () => setSuccessModalOpen(false)

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setModalQuestion('')
        setModalNewOption([])
        setModalQuestionId('')
        setModalUserAnswer('')
        setModalNewOption(null)
        setOpen(false)
    }

    const handleEditPickIcon = (questionId, question, options, userAnswer) => {
        setModalQuestion(question)
        setModalQuestionId(questionId)
        setModalOptions(options)
        setModalUserAnswer(userAnswer)
        handleOpen()
    }

    const updateModalUserOption = (option) => {
        console.log('New option selected : ', option)
        setModalNewOption(option.value)
        setSelectedCorrectScore(option.correctScore)
        setSelectedIncorrectScore(option.incorrectScore)
    }

    const saveNewOption = async () => {
        if (modalNewOption) {
            handleOptionSelect(modalNewOption, modalQuestionId)
        }
        await customSleep(200)
        handleClose()
    }

    const handleParticipantNameClick = () => {
        setSuccessMessage('Please wait till the match starts to view others picks')
        setOpenSuccessAlert(true)
    }

    const showMyPicksAlert = () => {
        setSuccessMessage('Your have answered all 5 questions. If you want to change answers please click on My Picks and click on Edit icon')
        setOpenSuccessAlert(true)
    }

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(14)
        console.log('Contest Id : ', contestId)
        setCurrentContestId(contestId)
        if (!apiCalled) {
            getContestDataForUser(contestId)
        }
    }, [apiCalled, location.pathname])

    const userId = localStorage.getItem('user_id')
    const userParticipants = participantsList.filter((participant) => participant.uid === userId)
    const otherParticipants = participantsList.filter((participant) => participant.uid !== userId)
    const startIndex = userParticipants.length > 0 ? 2 : 1

    return (
        <>
            <div className='text-center bg-gray-800 text-white py-2'>
                <div class="absolute top-0 left-0 w-full h-[80px]">
                    <img
                        src="https://super-5-wheat.vercel.app/img/header/ellipse.png"
                        alt=""
                        class="w-full h-full"
                    />
                </div>

                {/* <div className='text-2xl font-bold'>
                    {contestData.teamOneShortName} vs {contestData.teamTwoShortName} {contestData.teamOneShortName === '' && contestData.teamTwoShortName === '' && contestData.name}
                </div>
                <h2 className='text-xs text-center my-2'>{formatTimeInStartsInFormat(contestData.startDate)}</h2> */}
            </div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
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
                                {quizState === 'instructions' && (
                                    <div className='flex flex-col justify-center items-center text-center'>
                                        <>
                                            <div className='flex flex-row items-center justify-between p-2'>
                                                <p className='text-xl mb-2'>Entry Fees : {contestData.entryFees}</p>
                                            </div>
                                            <div className='border-gray-200 border-2 rounded-lg w-80 mb-8'>
                                                <div className='flex flex-row items-center justify-between p-4'>
                                                    <div>
                                                        <p className='font-bold'>Win iPhone 15</p>
                                                        <p className='text-xs'>Answer All 5 correct*</p>
                                                    </div>
                                                    <div>
                                                        <img className='h-32' src={iPhoneImage} alt='' />
                                                    </div>
                                                </div>
                                                {userCoins >= entryFees && userAnswers.length === 0 ? (
                                                    <>
                                                        <div onClick={() => handleStartQuiz()} className='p-2 bg-green-600 text-white text-2xl cursor-pointer hover:bg-green-700'>
                                                            Join Now
                                                        </div>
                                                    </>
                                                ) : userCoins >= entryFees && userAnswers.length > 0 && contestData.questions.length === userAnswers.length ? (
                                                    <>
                                                        <div onClick={() => showMyPicksAlert()} className='p-2 bg-orange-600 text-white text-2xl'>
                                                            Joined
                                                        </div>
                                                    </>
                                                ) : userAnswers.length > 0 ? (
                                                    <>
                                                        <div onClick={() => handleStartQuiz()} className='p-2 bg-orange-600 text-white text-2xl cursor-pointer hover:bg-orange-700'>
                                                            Joined
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className='p-2 bg-gray-300 text-2xl'>Insufficient Coins</div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    </div>
                                )}

                                {quizState === 'instructions' && rewardData && (
                                    <div className='flex items-center justify-center my-4 mx-4 text-center'>
                                        <table className='border border-collapse border-gray-800 w-full'>
                                            <thead>
                                                <tr>
                                                    <th className='border p-2'>Rank</th>
                                                    <th className='border p-2'>Winnings</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rewardData.length > 0 &&
                                                    rewardData.map((data, index) => {
                                                        if (data.rank) {
                                                            return (
                                                                <tr key={data.rank}>
                                                                    <td className='border p-2'>{data.rank}</td>
                                                                    <td className='border p-2'>{data.coins} Supercoins</td>
                                                                </tr>
                                                            )
                                                        }
                                                        return null
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabPanel>
                    <TabPanel value='2'>
                        <div className='pb-64'>
                            {userAnswers.length > 0 && <div className='text-base my-4'>To change your answer, click on question and choose new option from dropdown options.</div>}

                            {userAnswers.length === 0 && (
                                <div>
                                    <div className='text-base my-4'>Please participate in match to view your picks</div>
                                    <Button onClick={() => handleChange('', '1')} sx={{ marginTop: '10px' }} variant='contained' color='success'>
                                        Participate
                                    </Button>
                                </div>
                            )}

                            {userAnswers.length > 0 &&
                                userAnswers.map((answer, index) => {
                                    return (
                                        <div className='flex border-4 rounded-lg my-4'>
                                            <div className='bg-orange-600 text-2xl w-20 text-center pt-4 text-white rounded-l'>{index + 1}</div>
                                            <div className='flex flex-row justify-between'>
                                                <div className='w-60 p-2'>
                                                    {answer.question}
                                                    <br />
                                                    <span className='text-blue-400 font-bold'>{answer.answer}</span>
                                                </div>
                                                <div className='text-2xl w-20 text-center pt-4 rounded-l ' onClick={() => handleEditPickIcon(answer.questionId, answer.question, answer.options, answer.answer)}>
                                                    <Edit />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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
                                    <Box sx={{ ...defaultModalStyle, position: 'relative', backgroundColor: 'white' }}>
                                        <div className='flex flex-col gap-6 pt-8 justify-center'>
                                            <div className='fixed top-2 right-2 hover:bg-gray-800' onClick={handleClose}>
                                                <Cancel />
                                            </div>

                                            <h1 className='text-center text-2xl font-bold text-gray-700'>{modalQuestion}</h1>

                                            <div className='flex flex-col gap-2'>
                                                {modalOptions.length > 0 &&
                                                    modalOptions.map((option) => {
                                                        return (
                                                            <div key={option.value} className='cursor-pointer' onClick={() => updateModalUserOption(option)}>
                                                                {modalNewOption === option.value || (!modalNewOption && modalUserAnswer === option.value) ? (
                                                                    <div className={`bg-green-600 text-white p-2 rounded-md  flex justify-between items-center`}>
                                                                        <div style={{ width: '70%' }}>{option.value}</div>
                                                                        <div style={{ width: '15%' }} className='text-white-700 font-bold text-center'>
                                                                            {option.correctScore}
                                                                        </div>
                                                                        <div style={{ width: '15%' }} className='text-white-100 font-bold text-center'>
                                                                            {option.incorrectScore}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className={` flex justify-between items-center rounded-md bg-gray-200 p-2`}>
                                                                        <div style={{ width: '70%' }}>{option.value}</div>
                                                                        <div style={{ width: '15%' }} className='text-green-700 font-bold text-center'>
                                                                            {option.correctScore}
                                                                        </div>
                                                                        <div style={{ width: '15%' }} className='text-red-500 font-bold text-center'>
                                                                            {option.incorrectScore}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                            </div>

                                            {modalNewOption && (
                                                <div className='sticky bottom-0 left-2 right-2 h-20 bg-gray-200 rounded-2xl p-4'>
                                                    <div className='flex justify-between'>
                                                        <div className='bg-gray-600 text-white rounded-md p-2 px-8' onClick={handleClose}>
                                                            Close
                                                        </div>
                                                        <div className='bg-green-600 text-white rounded-md p-2 px-8' onClick={saveNewOption}>
                                                            Save
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Box>
                                </Fade>
                            </Modal>
                        </div>
                    </TabPanel>
                    <TabPanel value='3'>
                        <div className='pb-64'>
                            {participantsList.length > 0 && (
                                <>
                                    {userParticipants.map((participant, index) => (
                                        <div className='my-2' key={index}>
                                            <div className='bg-blue-700 font-bold text-white p-2 rounded-lg cursor-pointer' onClick={() => handleParticipantNameClick()}>
                                                {index + 1}. {capitalizeWordsInSentence(participant.fullname)}
                                            </div>
                                        </div>
                                    ))}

                                    {otherParticipants.map((participant, index) => (
                                        <div className='my-2' key={index}>
                                            <div className='bg-gray-700 text-white p-2 rounded-lg cursor-pointer' onClick={() => handleParticipantNameClick()}>
                                                {index + startIndex}. {capitalizeWordsInSentence(participant.fullname)}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel value='4'>
                        <div className='pb-64'>
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
                    </TabPanel>
                </TabContext>
            </Box>
            <CustomAlert successMessage={successMessage} errorMessage={errorMessage} openSuccessAlert={openSuccessAlert} closeSuccessAlert={closeSuccessAlert} openErrorAlert={openErrorAlert} closeErrorAlert={closeErrorAlert} />

            <BottomNavigationComponent />
        </>
    )
}
