import { Box, Button, Tab, TextField } from '@mui/material'
import { BASE_URL } from '../../API/Constants'
import React, { useEffect, useState } from 'react'
import SuccessModal from '../SuccessModal/SuccessModal'
import SupportIcon from '../../Assets/support.png'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { showTimeInAgoFormat } from '../../Utils/time'

const HelpAndSupport = () => {
    const navigate = useNavigate()

    const handleReturnHome = () => {
        navigate('/profile')
    }

    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [email, setEmail] = useState('')
    const [ticketNo, setTicketNo] = useState(null)
    const [value, setValue] = useState('1')
    const [apiCalled, setApiCalled] = useState(false)
    const [ticketsList, setTicketsList] = useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const openSuccessModal = () => setSuccessModalOpen(true)
    const closeSuccessModal = () => setSuccessModalOpen(false)

    const handleSubmit = () => {
        if (!email || !subject || !body) {
            return
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: localStorage.getItem('user_id'),
                subject,
                body,
                email
            })
        }

        fetch(`${BASE_URL}/api/user/feedback`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setEmail('')
                setSubject('')
                setBody('')
                console.log('Data : ', data)
                if (data.status === 200) {
                    setTicketNo(data.data.ticketNo)
                    openSuccessModal()
                }
            })
            .catch((error) => {})
    }

    const getSettingsData = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/user/tickets/${localStorage.getItem('user_id')}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    setApiCalled(true)
                    setTicketsList(data.data.tickets)
                } else {
                }
            })
            .catch((error) => {})
    }

    useEffect(() => {
        if (!apiCalled) {
            getSettingsData()
        }
    })

    return (
        <>
            <div className='text-center py-4 relative bg-gray-800 text-white'>
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:font-bold'>
                    <ArrowBack className='font-bold' onClick={() => handleReturnHome()} />
                </div>
                <div className='text-2xl font-bold'>Help and Support</div>
            </div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                            <Tab label='Create Ticket' value='1' />
                            <Tab label='View Tickets' value='2' />
                        </TabList>
                    </Box>
                    <TabPanel value='1'>
                        <div className='flex flex-col gap-4 justify-center'>
                            <div className='flex  flex-col items-center'>
                                <img className='my-4 w-32' src={SupportIcon} alt='' />
                            </div>

                            <div>
                                <TextField sx={{ width: '100%' }} label={`Email address`} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <TextField sx={{ width: '100%' }} label={`Subject`} value={subject} onChange={(e) => setSubject(e.target.value)} />
                            </div>
                            <div>
                                <TextField sx={{ width: '100%' }} label={`Issue / Feedback`} value={body} onChange={(e) => setBody(e.target.value)} />
                            </div>
                            <div className='text-center'>
                                <Button sx={{ width: '100%' }} variant='contained' color='success' onClick={() => handleSubmit()}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value='2'>
                        <div className=''>
                            {ticketsList.length > 0 &&
                                ticketsList.map((ticket) => {
                                    return (
                                        <>
                                            <div class='overflow-hidden rounded-lg shadow-md p-2 my-4'>
                                                <span className='bg-blue-500 text-white rounded-lg p-2'>Ticket #{ticket.serial}</span>
                                                <div className='pt-4'>Subject: {ticket.subject}</div>
                                                <div className=''>Body: {ticket.body}</div>
                                                <div className='text-xs'>Created {showTimeInAgoFormat(ticket.submittedAt)}</div>
                                                <hr className='my-2' />
                                                {ticket.response === '' ? <div className='text-red-500 font-bold'>No response</div> : <div className='font-bold text-green-500'>{ticket.response}</div>}
                                            </div>
                                        </>
                                    )
                                })}
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>

            <SuccessModal open={successModalOpen} handleClose={closeSuccessModal} content={`Your ticket has been created #${ticketNo}`} btnText={'Close'} onButtonClick={closeSuccessModal} />
        </>
    )
}

export default HelpAndSupport
