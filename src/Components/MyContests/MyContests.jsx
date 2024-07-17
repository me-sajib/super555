import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { BASE_URL } from '../../API/Constants'
import { convertMillisecondsToDate, formatTimeInStartsInFormat } from '../../Utils/time'
import checkIcon from '../../Assets/checked.png'
import { useNavigate } from 'react-router-dom'
import coinImage from '../../Assets/coin.png'
import { shouldShowContest } from '../../Utils/Contest'
import super5logo5 from '../../Assets/super5logo5.png'

export default function MyContests() {
    const [apiCalled, setApiCalled] = useState()
    const [value, setValue] = useState('1')
    const uid = localStorage.getItem('user_id')
    const navigate = useNavigate()

    const [upcomingContests, setUpcomingContests] = useState([])
    const [liveContests, setLiveContests] = useState([])
    const [completedContests, setCompletedContests] = useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const openEachTicketContainer = (ticketId) => {
        navigate(`/contest-page/${ticketId}`)
    }

    const openLiveContestPage = (contestId) => {
        navigate(`/live-contest/${contestId}`)
    }

    const openCompletedContestPage = (contestId, isCancelled) => {
        if (isCancelled) {
            navigate(`/cancelled-contest/${contestId}`)
            return
        }
        navigate(`/completed-contest/${contestId}`)
    }

    const getContestsList = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/contests/${uid}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    const contests = data.data
                    setUpcomingContests(contests.upcomingContests)
                    setLiveContests(contests.liveContests)
                    setCompletedContests(contests.completedContests)
                    setApiCalled(true)
                } else {
                }
            })
            .catch((error) => {})
    }

    useEffect(() => {
        if (!apiCalled) {
            getContestsList()
        }
    })

    return (
        <>
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

            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                            <Tab label='Upcoming' value='1' />
                            <Tab label='Live' value='2' />
                            <Tab label='Completed' value='3' />
                        </TabList>
                    </Box>
                    <TabPanel value='1'>
                        <div className='all__tickets__container'>
                            {upcomingContests.length > 0 &&
                                upcomingContests.map((ticket) => {
                                    if (shouldShowContest(ticket.startDate)) {
                                        return (
                                            <>
                                                <div className='tickets__card__container cursor-pointer' onClick={() => openEachTicketContainer(ticket._id)} key={ticket._id}>
                                                    <article className='each__ticket__container'>
                                                        <div className='flex justify-between'>
                                                            <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                                                                <img src={ticket.teamOneLogo || 'https://i.postimg.cc/jjv3B5vP/flag1.jpg'} className='h-16 rounded-2xl' alt='Left Team' />
                                                            </div>
                                                            <div style={{ flex: '60%' }} className='text-center'>
                                                                <div>
                                                                    <h2 className='text-xs mb-1'> {ticket.description}</h2>
                                                                    <hr />
                                                                </div>
                                                                <div className='flex flex-col items-center my-4'>
                                                                    <h2 className='font-bold'>
                                                                        {ticket.teamOneShortName.length > 0 ? ticket.teamOneShortName : ticket.teamOne} vs {ticket.teamTwoShortName.length > 0 ? ticket.teamTwoShortName : ticket.teamTwo}
                                                                    </h2>
                                                                    <div class='text-xs text-gray-500'>{formatTimeInStartsInFormat(ticket.startDate)}</div>
                                                                    <div className='text-xs font-bold text-gray-500'>{ticket.entryFees} SuperCoins</div>
                                                                </div>
                                                            </div>
                                                            <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                                                                <img className='h-16 rounded-2xl' src={ticket.teamTwoLogo || 'https://i.postimg.cc/1tt7SQYT/flag2.jpg'} alt='Right Team' />
                                                            </div>
                                                        </div>
                                                    </article>
                                                </div>
                                            </>
                                        )
                                    }
                                })}

                            {upcomingContests.length === 0 && (
                                <>
                                    <img className='h-20' src={checkIcon} alt='' />
                                    <p className='text-2xl text-gray-500 mt-2'>No Contests found</p>
                                </>
                            )}
                        </div>
                        <BottomNavigationComponent />
                    </TabPanel>
                    <TabPanel value='2'>
                        <div className='all__tickets__container'>
                            {liveContests.length > 0 &&
                                liveContests.map((ticket) => {
                                    return (
                                        <>
                                            <div className='tickets__card__container cursor-pointer' onClick={() => openLiveContestPage(ticket._id)} key={ticket._id}>
                                                <article className='each__ticket__container'>
                                                    <div className='flex justify-between'>
                                                        <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                                                            <img src={ticket.teamOneLogo || 'https://i.postimg.cc/jjv3B5vP/flag1.jpg'} className='h-16 rounded-2xl' alt='Left Team' />
                                                        </div>
                                                        <div style={{ flex: '60%' }} className='text-center'>
                                                            <div>
                                                                <h2 className='text-xs mb-1'> {ticket.description}</h2>
                                                                <hr />
                                                            </div>
                                                            <div className='flex flex-col items-center my-4'>
                                                                <h2 className='font-bold'>
                                                                    {ticket.teamOneShortName.length > 0 ? ticket.teamOneShortName : ticket.teamOne} vs {ticket.teamTwoShortName.length > 0 ? ticket.teamTwoShortName : ticket.teamTwo}
                                                                </h2>
                                                                <div class='text-xs text-gray-500'>The contest is live</div>
                                                                <div className='text-xs font-bold text-gray-500'>{ticket.entryFees} SuperCoins</div>
                                                                {<div className='text-xs'>{convertMillisecondsToDate(ticket.startDate)}</div>}
                                                            </div>
                                                        </div>
                                                        <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                                                            <img className='h-16 rounded-2xl' src={ticket.teamTwoLogo || 'https://i.postimg.cc/1tt7SQYT/flag2.jpg'} alt='Right Team' />
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        </>
                                    )
                                })}

                            {liveContests.length === 0 && (
                                <>
                                    <img className='h-20' src={checkIcon} alt='' />
                                    <p className='text-2xl text-gray-500 mt-2'>No Contests found</p>
                                </>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel value='3'>
                        <div className='all__tickets__container'>
                            {completedContests.length > 0 &&
                                completedContests.map((ticket) => {
                                    return (
                                        <>
                                            <div className='tickets__card__container cursor-pointer' onClick={() => openCompletedContestPage(ticket._id, ticket.cancelled)} key={ticket._id}>
                                                <article className='each__ticket__container'>
                                                    <div className='flex justify-between'>
                                                        <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                                                            <img src={ticket.teamOneLogo || 'https://i.postimg.cc/jjv3B5vP/flag1.jpg'} className='h-16 rounded-2xl' alt='Left Team' />
                                                        </div>
                                                        <div style={{ flex: '60%' }} className='text-center'>
                                                            <div>
                                                                <h2 className='text-xs mb-1'> {ticket.description}</h2>
                                                                <hr />
                                                            </div>
                                                            <div className='flex flex-col items-center my-6'>
                                                                <h2 className='font-bold'>
                                                                    {ticket.teamOneShortName.length > 0 ? ticket.teamOneShortName : ticket.teamOne} vs {ticket.teamTwoShortName.length > 0 ? ticket.teamTwoShortName : ticket.teamTwo}
                                                                </h2>
                                                                {ticket.cancelled && <div className='text-xs text-red-500 font-bold'>Cancelled</div>}
                                                                {!ticket.cancelled && (
                                                                    <>
                                                                        <div class='text-xs text-blue-500 font-bold'>Contest Ended</div>
                                                                    </>
                                                                )}
                                                                {<div className='text-xs'>{convertMillisecondsToDate(ticket.startDate)}</div>}
                                                            </div>
                                                        </div>
                                                        <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                                                            <img className='h-16 rounded-2xl' src={ticket.teamTwoLogo || 'https://i.postimg.cc/1tt7SQYT/flag2.jpg'} alt='Right Team' />
                                                        </div>
                                                    </div>
                                                    {ticket.transactions && ticket.transactions.length > 0 && (
                                                        <div className='absolute bottom-0 right-0 bg-green-600 p-1 rounded-tl-xl'>
                                                            <div className='flex items-center justify-center'>
                                                                <div className='text-base font-light text-white px-0.5'>Won {ticket.transactions[0].coins} coins</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </article>
                                            </div>
                                        </>
                                    )
                                })}

                            {completedContests.length === 0 && (
                                <>
                                    <img className='h-20' src={checkIcon} alt='' />
                                    <p className='text-2xl text-gray-500 mt-2'>No Contests found</p>
                                </>
                            )}
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
            <BottomNavigationComponent />
        </>
    )
}
