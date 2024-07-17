import * as React from 'react'
import { useEffect, useState } from 'react'

import { BASE_URL } from '../../API/Constants'
import { formatTimeInStartsInFormat } from '../../Utils/time'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import SuccessModal from '../SuccessModal/SuccessModal'
import CustomAlert from '../CustomAlert/CustomAlert'

export default function QuizPage() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState()
    const [value, setValue] = useState('1')
    const uid = localStorage.getItem('user_id')
    const navigate = useNavigate()
    const [questionsList, setQuestionsList] = useState([])
    const [quizState, setQuizState] = useState('question')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [contestData, setContestData] = useState({
        name: ''
    })
    const [userAnswers, setUserAnswers] = useState([])
    const [currentContestId, setCurrentContestId] = useState('')

    const [selectedAnswers, setSelectedAnswers] = useState({})

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
                    setUserAnswers(data.data.userAnswers)
                    setQuestionsList(questions)
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {
                console.log('Error : ', error)
            })
    }

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const openSuccessModal = () => setSuccessModalOpen(true)
    const closeSuccessModal = () => setSuccessModalOpen(false)

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionsList.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        } else {
            openSuccessModal()
            // handleReturnHome()
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
        }
    }

    const updateLocalOptions = (questionId, selectedOption) => {
        const newData = { ...selectedAnswers }
        newData[questionId] = selectedOption
        setSelectedAnswers(newData)
    }

    const handleOptionSelect = (selectedOption, questionId) => {
        console.log('Selected Option : ', selectedOption, '... Question ID : ', questionId)
        updateLocalOptions(questionId, selectedOption.value)
        setSelectedOption(selectedOption.value)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contestId: currentContestId,
                questionId,
                uid: localStorage.getItem('user_id'),
                userAnswer: selectedOption.value,
                correctScore: selectedOption.correctScore,
                incorrectScore: selectedOption.incorrectScore
            })
        }

        console.log('Request Options : ', requestOptions)

        fetch(`${BASE_URL}/api/contest/user/submission`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
            })
            .catch((error) => {})
    }

    const handleReturnHome = () => {
        navigate('/')
    }

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(11)
        console.log('Contest Id : ', contestId)
        setCurrentContestId(contestId)
        if (!apiCalled) {
            getContestDataForUser(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div className='text-center bg-gray-800 text-white py-2 relative'>
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:font-bold'>
                    <ArrowBack className='font-bold' onClick={() => handleReturnHome()} />
                </div>
                <div className='text-2xl font-bold'>{contestData.name}</div>
                <h2 className='text-xs text-center my-2'>{formatTimeInStartsInFormat(contestData.startDate)}</h2>
            </div>
            <div>
                <div className='flex text-center'>
                    {Array.from({ length: questionsList.length }).map((_, index) => (
                        <div key={index} className={`cursor-pointer flex-1 text-white text-xl m-0.5 p-2 ${currentQuestionIndex === index ? 'bg-blue-300' : selectedAnswers[questionsList[index]._id] ? 'bg-blue-500' : 'bg-gray-700'}`}>
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className='fixed bottom-0 left-0 w-full bg-gray-700 p-4 flex justify-between gap-4'>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => handlePreviousQuestion()} disabled={currentQuestionIndex === 0}>
                        <ArrowBack />
                    </button>
                    <button
                        className={`flex-1 ${currentQuestionIndex === questionsList.length - 1 ? (selectedAnswers[questionsList[currentQuestionIndex]?._id] ? 'bg-red-500' : 'bg-gray-500') : selectedAnswers[questionsList[currentQuestionIndex]?._id] ? 'bg-green-500' : 'bg-gray-500'} text-white px-4 py-2 rounded`}
                        onClick={() => {
                            if (selectedAnswers[questionsList[currentQuestionIndex]?._id]) {
                                handleNextQuestion()
                            } else {
                                console.log('Give answer first')
                            }
                        }}
                        disabled={!selectedAnswers[questionsList[currentQuestionIndex]?._id]}>
                        {currentQuestionIndex === questionsList.length - 1 ? 'Submit Answers' : 'Next'}
                    </button>
                </div>
            </div>
            <div>
                {contestData.name.length > 0 && (
                    <div className='pb-60'>
                        {quizState === 'question' && questionsList.length > 0 && (
                            <div className='m-3.5 md:m-10 lg:m-20 xl:m-20 2xl:mx-80 overflow'>
                                <p className='text-2xl font-bold sticky top-0 bg-white pt-3 pb-2 z-10'>{questionsList[currentQuestionIndex].question}</p>
                                <div className='flex justify-between text-left mt-4 font-bold py-2 px-4 justify-center items-center'>
                                    <div style={{ width: '60%' }} className='text-xs'>
                                        Option
                                    </div>
                                    <div style={{ width: '15%' }} className='text-xs'>
                                        Correct points
                                    </div>
                                    <div style={{ width: '15%' }} className='text-xs'>
                                        Wrong points
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {questionsList[currentQuestionIndex].options.map((option, optionIndex) => (
                                        <div onClick={() => handleOptionSelect(option, questionsList[currentQuestionIndex]._id)} key={optionIndex} className={`text-left mt-4 ${selectedAnswers[questionsList[currentQuestionIndex]._id] === option.value ? 'bg-green-600 text-white hover:bg-green-600 border-green-700' : 'text-gray-800 bg-gray-200 hover:bg-gray-200 border-gray-200'} font-bold py-2 px-4 rounded flex justify-between items-center`}>
                                            <div style={{ width: '70%' }}>{option.value}</div>
                                            <div style={{ width: '15%' }} className='text-green-700 font-bold text-center'>
                                                {option.correctScore}
                                            </div>
                                            <div style={{ width: '15%' }} className='text-red-500 font-bold text-center'>
                                                {option.incorrectScore}
                                            </div>
                                            {selectedAnswers[questionsList[currentQuestionIndex]._id] === option && <span className='ml-2 text-xs'>(Selected)</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CustomAlert successMessage={successMessage} errorMessage={errorMessage} openSuccessAlert={openSuccessAlert} closeSuccessAlert={closeSuccessAlert} openErrorAlert={openErrorAlert} closeErrorAlert={closeErrorAlert} />
            <SuccessModal open={successModalOpen} handleClose={closeSuccessModal} content={'Answers saved. Contest joined successfully'} btnText={'Return to Home'} onButtonClick={() => handleReturnHome()} />
        </>
    )
}
