import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../API/Constants'

function ReviewContest() {
    const location = useLocation()
    const navigate = useNavigate()
    const [apiCalled, setApiCalled] = useState(false)
    const [questionsList, setQuestionsList] = useState([])
    const [quizState, setQuizState] = useState('instructions')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [contestData, setContestData] = useState({
        name: ''
    })
    const [currentContestId, setCurrentContestId] = useState('')
    const [rewardData, setRewardData] = useState(null)

    const getContestData = (contestId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/admin/contest/${contestId}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    const questions = data.data.contest.questions
                    setContestData(data.data.contest)
                    setQuestionsList(questions)
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {})
    }

    const getContestDataForUID = (contestId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/contest/review?contestId=${contestId}&uid=${localStorage.getItem('user_id')}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    const questions = data.data.contest.questions
                    setContestData(data.data.contest)
                    setRewardData(data.data.contest.rewards)
                    setQuestionsList(questions)
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {})
    }
    
    const handleStartQuiz = () => {
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

    const handleOptionSelect = (selectedOption, questionId) => {
        setSelectedOption(selectedOption)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contestId: currentContestId,
                questionId,
                uid: localStorage.getItem('user_id'),
                userAnswer: selectedOption
            })
        }

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
        const contestId = path.substring(16)
        console.log('Contest Id : ', contestId)
        setCurrentContestId(contestId)
        if (!apiCalled) {
            getContestDataForUID(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div className='text-base font-bold text-center bg-gray-800 text-white py-2'>My Super 5</div>
            <div className='mt-10 mb-60'>
                <h2 className='text-4xl text-center font-bold my-8'>{contestData.name}</h2>
                {quizState === 'instructions' && (
                    <div className='flex flex-col justify-center items-center text-center'>
                        <h2 className='text-2xl'>Do you want to review your answers?</h2>
                        <button onClick={() => handleStartQuiz()} className='mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 border-b-4 border-gray-700 rounded'>
                            Review Quiz
                        </button>
                    </div>
                )}

                {quizState === 'instructions' && rewardData && (
                    <div className='flex items-center justify-center my-10 mx-4'>
                        <table className='border border-collapse border-gray-800'>
                            <thead>
                                <tr>
                                    <th className='border p-2'>Rank</th>
                                    <th className='border p-2'>Reward</th>
                                    <th className='border p-2'>Coins</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rewardData.length > 0 &&
                                    rewardData.map((data, index) => (
                                        <tr key={data.rank}>
                                            <td className='border p-2'>{data.rank}</td>
                                            <td className='border p-2'>{data.reward}</td>
                                            <td className='border p-2'>{data.coins}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {quizState === 'question' && questionsList.length > 0 && (
                    <div className='m-3.5 md:m-10 lg:m-20 xl:m-20 2xl:mx-80'>
                        <p className='text-2xl font-bold'>{questionsList[currentQuestionIndex].question}</p>
                        <div className='flex flex-col'>
                            {questionsList[currentQuestionIndex].options.map((option, optionIndex) => (
                                <button onClick={() => handleOptionSelect(option, questionsList[currentQuestionIndex]._id)} key={optionIndex} className={`text-left mt-4 ${selectedOption === option || (!selectedOption && option === questionsList[currentQuestionIndex].userAnswer) ? 'bg-green-500 hover:bg-green-600 border-green-700' : 'bg-blue-500 hover:bg-blue-600 border-blue-700'} text-white font-bold py-2 px-4 border-b-4 rounded`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className='flex justify-between'>
                            <button onClick={() => handlePreviousQuestion()} className='mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 border-b-4 border-gray-700 rounded'>
                                Previous
                            </button>
                            <button onClick={() => handleNextQuestion()} className='mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 border-b-4 border-gray-700 rounded'>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {quizState === 'completed' && (
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='text-2xl'>Quiz reviewed!</h2>
                        <button onClick={() => handleReturnHome()} className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 rounded'>
                            Return to Home Page
                        </button>
                    </div>
                )}
            </div>

            <BottomNavigationComponent />
        </>
    )
}

export default ReviewContest
