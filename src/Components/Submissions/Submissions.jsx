import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { useLocation } from 'react-router-dom'
import { Box } from '@mui/system'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { Grid } from '@mui/material'
import { fetchData } from '../../API/useFetch'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function Submissions() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState(false)
    const [submissionsList, setSubmissionsList] = useState([])

    const getSubmissionsList = async (contestId) => {
        const data = await fetchData(`api/user/contest/submissions/${contestId}`)
        console.log('Data : ', data)
        if (data) {
            setApiCalled(true)
            setSubmissionsList(data.leaderboard)
        }
    }

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(13)
        console.log('Contest Id : ', contestId)
        if (!apiCalled) {
            getSubmissionsList(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div className='pb-96'>
                <Box sx={{ flexGrow: 2 }}>
                    <h1 className='my-5 text-2xl font-bold text-center text-gray-500'>Submissions</h1>
                    <Grid align='center' justify='center' sx={{ margin: 1 }}>
                        <Grid>
                            <TableContainer>
                                <Table sx={{}} aria-label='customized table'>
                                    <TableBody>
                                        {submissionsList.map((submission, index) => {
                                            return (
                                                <>
                                                    <Accordion sx={{ width: '100%' }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                                                            {submission.username}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            {submission.submissions.map((eachSubmission) => {
                                                                return (
                                                                    <>
                                                                        <div className='font-bold'>{eachSubmission.question}</div>
                                                                        <div>{eachSubmission.answer}</div>
                                                                        <hr/>
                                                                    </>
                                                                )
                                                            })}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <BottomNavigationComponent />
        </>
    )
}

export default Submissions
