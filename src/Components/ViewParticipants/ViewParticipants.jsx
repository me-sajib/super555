import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { useLocation } from 'react-router-dom'
import { BASE_URL } from '../../API/Constants'
import { Box } from '@mui/system'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { styled } from '@mui/material/styles'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Grid } from '@mui/material'
import { fetchData } from '../../API/useFetch'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        fontSize: 20
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    '&:last-child td, &:last-child th': {
        border: 0
    }
}))

function ViewParticipants() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState(false)
    const [participantsList, setParticipantsList] = useState([])

    const getParticipantsList = async (contestId) => {
        const data = await fetchData(`api/user/contest/participants/${contestId}`)
        if (data) {
            setApiCalled(true)
            setParticipantsList(data.participants)
        }
    }

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(19)
        console.log('Contest Id : ', contestId)
        if (!apiCalled) {
            getParticipantsList(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div>
                <Box sx={{ flexGrow: 2 }}>
                    <h1 className='my-5 text-2xl font-bold text-center text-gray-500'>Participants</h1>
                    <Grid align='center' justify='center' sx={{ margin: 1 }}>
                        <Grid>
                            <TableContainer>
                                <Table sx={{}} aria-label='customized table'>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>User</StyledTableCell>
                                            <StyledTableCell align='left'>Name</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {participantsList.map((participant, index) => {
                                            return (
                                                <StyledTableRow key={participant.uid}>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {index + 1}
                                                    </StyledTableCell>
                                                    <StyledTableCell align='left'>{participant.username}</StyledTableCell>
                                                </StyledTableRow>
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

export default ViewParticipants
