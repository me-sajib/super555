import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { BASE_URL } from '../../API/Constants'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import coinImage from '../../Assets/coin.png'
import { shouldShowContest } from '../../Utils/Contest'
import super5logo5 from '../../Assets/super5logo5.png'

function FAQs() {
    const [apiCalled, setApiCalled] = useState(false)
    const [faqList, setFAQList] = useState([])

    const getSettingsData = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`${BASE_URL}/api/settings/data/faqs`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Data :', data)
                if (data.status === 200) {
                    const list = data.data.settings.list
                    console.log('List : ', list)
                    setFAQList(list)
                    setApiCalled(true)
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
        <div className='text-black bg-gray-100 pb-96'>
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
            <h1 className='font-bold text-center my-8 text-2xl'>Frequently Asked Questions</h1>
            <div className='mx-8 text-xl'>
                {faqList.length > 0 &&
                    faqList.map((rule) => {
                        return (
                            <>
                                <Accordion sx={{ width: '100%' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                                        {rule.question}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='text-base'>{rule.answer}</div>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        )
                    })}
            </div>

            <BottomNavigationComponent />
        </div>
    )
}

export default FAQs
