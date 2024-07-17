import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../API/Constants'

function JoinContest() {
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
    const [rewardData, setRewardData] = useState(null)
    const [currentContestId, setCurrentContestId] = useState('')

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
                    setRewardData(data.data.contest.rewards)
                    setQuestionsList(questions)
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {})
    }

    const handleDeductCoins = (uid, coinsToDeduct) => {
        console.log('Inside handleDeductCoins')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid,
                contestId: currentContestId,
                type: 'join',
                coins: coinsToDeduct
            })
        }

        fetch(`${BASE_URL}/api/user/transaction`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data : ', data)
            })
            .catch((error) => {})
    }


    const handleStartQuiz = () => {
        setQuizState('question')
        handleDeductCoins(localStorage.getItem('user_id'), 10)
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
        const contestId = path.substring(14)
        console.log('Contest Id : ', contestId)
        setCurrentContestId(contestId)
        if (!apiCalled) {
            getContestData(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div className='pt-10 pb-60 bg-gray-100'>
                <h2 className='text-4xl text-center font-bold my-8'>{contestData.name}</h2>
                {quizState === 'instructions' && (
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='text-2xl'>Are you ready?</h2>
                        <h2 className='text-xs mt-2 text-center'>By participating in this quiz, your 10 coins will be deducted</h2>
                        <button onClick={() => handleStartQuiz()} className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 rounded'>
                            Start Quiz
                        </button>
                    </div>
                )}

                {quizState === 'question' && questionsList.length > 0 && (
                    <div className='m-3.5 md:m-10 lg:m-20 xl:m-20 2xl:mx-80'>
                        <p className='text-2xl font-bold'>{questionsList[currentQuestionIndex].question}</p>
                        <div className='flex flex-col'>
                            {questionsList[currentQuestionIndex].options.map((option, optionIndex) => (
                                <button onClick={() => handleOptionSelect(option, questionsList[currentQuestionIndex]._id)} key={optionIndex} className={`text-left mt-4 ${selectedOption === option ? 'bg-green-500 hover:bg-green-600 border-green-700' : 'bg-blue-500 hover:bg-blue-600 border-blue-700'} text-white font-bold py-2 px-4 border-b-4 rounded`}>
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

                {quizState === 'completed' && (
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='text-2xl'>Quiz Completed!</h2>
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

export default JoinContest