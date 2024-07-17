import React, { useEffect, useState } from 'react'
import { fetchData } from '../../API/useFetch'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { formatTimeAMPM } from '../../Utils/time'

const greenTypes = ['reward', 'signup', 'referee', 'referer', 'support', 'refund']

function CoinHistory() {
    const navigate = useNavigate()
    const [apiCalled, setApiCalled] = useState(false)
    const [coinHistory, setCoinHistory] = useState([])

    const getUserProfile = async (uid) => {
        const data = await fetchData(`api/user/profile/${uid}`)
        if (data) {
            setApiCalled(true)
            console.log('data.coinHistory : ', data.coinHistory)
            setCoinHistory(data.coinHistory)
        }
    }

    useEffect(() => {
        if (!apiCalled) {
            getUserProfile(localStorage.getItem('user_id'))
        }
    })

    const formatDate = (day, month, year) => {
        const formattedDate = new Date(year, month - 1, day)
        const monthAbbreviation = formattedDate.toLocaleString('default', { month: 'short' })
        const result = `${day} ${monthAbbreviation}, ${year}`
        return result
    }

    const getNameOfTransaction = (type, reason) => {
        const transactionMapping = {
            reward: 'Winnings',
            join: 'Entry Paid',
            signup: 'Signup Bonus',
            referer: 'Referral Bonus',
            referee: 'Referral Bonus',
            refund: 'Contest Fees Refunded',
            redeem: 'Reward Redeem Request',
            support: reason
        }
        return transactionMapping[type] || 'Unnamed Transaction'
    }

    const handleReturnHome = () => {
        navigate('/')
    }

    const getTransactionDescription = (transaction) => {
        try {
            if (transaction.type === 'signup') {
                return 'New account bonus'
            } else if (transaction.type === 'reward') {
                return transaction.contestName
            } else if (transaction.type === 'join') {
                return transaction.contestName
            } else if (transaction.type === 'referee') {
                return `Referred by ${transaction.secondUser}`
            } else if (transaction.type === 'referer') {
                return `Referred to ${transaction.secondUser}`
            } else if (transaction.type === 'support') {
                return 'Customer Support Team'
            } else if (transaction.type === 'refund') {
                return 'Match cancelled by admin'
            } else if (transaction.type === 'redeem') {
                return  transaction.reason || 'Unknown Reward'
            }
        } catch {
            return 'No Description'
        }
    }

    return (
        <div className='bg-gray-100 h-screen w-screen pb-96'>
            <div className='text-center bg-gray-800 text-white py-2 relative'>
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:font-bold'>
                    <ArrowBack className='font-bold' onClick={() => handleReturnHome()} />
                </div>
                <div className='text-center p-2 font-bold text-white'>Recent Transactions</div>
            </div>

            <div>
                {coinHistory.length > 0 && (
                    <>
                        {coinHistory.map((history) => {
                            return (
                                <div key={Math.random()}>
                                    <div className='bg-gray-200 p-1 mb-2'>{formatDate(history.day, history.month, history.year)}</div>
                                    {history.transactions.length > 0 &&
                                        history.transactions.map((transaction) => {
                                            return (
                                                <div key={Math.random()} className='px-2'>
                                                    <div className='flex flex-row justify-between items-center'>
                                                        <div className={`${greenTypes.includes(transaction.type) ? 'text-green-700' : 'text-gray-700'} font-bold`}>{getNameOfTransaction(transaction.type, transaction.reason)}</div>
                                                        <div className={`${greenTypes.includes(transaction.type) ? 'text-green-700' : 'text-red-700'} font-bold`}>{transaction.coins}</div>
                                                    </div>
                                                    <div className={`${transaction.type === ('reward' || 'signup') ? 'text-gray-700' : 'text-gray-700'}`}>
                                                        {formatTimeAMPM(transaction.createdAt)} • {getTransactionDescription(transaction)}
                                                    </div>
                                                    <hr className='my-2' />
                                                </div>
                                            )
                                        })}
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
        </div>
    )
}

export default CoinHistory
