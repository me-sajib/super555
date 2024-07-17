import React, { useEffect, useState } from 'react'
import BottomNavigationComponent from '../BottomNavigation/BottomNavigation'
import { useLocation } from 'react-router-dom'
import { Box } from '@mui/system'
import { styled } from '@mui/material/styles'
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

function ViewLeaderboard() {
    const location = useLocation()
    const [apiCalled, setApiCalled] = useState(false)
    const [participantsList, setParticipantsList] = useState([])

    const getLeaderboardOfContest = async (contestId) => {
        const data = await fetchData(`api/user/contest/leaderboard/${contestId}`)
        if (data) {
            console.log('Data : ', data)
            setApiCalled(true)
            setParticipantsList(data.leaderboard)
        }
    }

    useEffect(() => {
        const path = location.pathname
        const contestId = path.substring(18)
        console.log('Contest Id : ', contestId)
        if (!apiCalled) {
            getLeaderboardOfContest(contestId)
        }
    }, [apiCalled, location.pathname])

    return (
        <>
            <div>
                <Box sx={{ flexGrow: 2 }}>
                    <h1 className='my-5 text-2xl font-bold text-center text-gray-500'>Leaderboard</h1>
                    <Grid align='center' justify='center' sx={{ margin: 1 }}>
                        <Grid>
                            <TableContainer>
                                <Table sx={{}} aria-label='customized table'>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Rank</StyledTableCell>
                                            <StyledTableCell align='left'>Name</StyledTableCell>
                                            <StyledTableCell align='left'>Score</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {participantsList.map((participant, index) => {
                                            return (
                                                <StyledTableRow key={participant.uid}>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {participant.rank}
                                                    </StyledTableCell>
                                                    <StyledTableCell align='left'>{participant.username}</StyledTableCell>
                                                    <StyledTableCell align='left'>{participant.score}</StyledTableCell>
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

export default ViewLeaderboard
