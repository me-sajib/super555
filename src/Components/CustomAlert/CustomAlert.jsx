import React from 'react'
import MuiAlert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

function CustomAlert({ successMessage, errorMessage, openSuccessAlert, closeSuccessAlert, openErrorAlert, closeErrorAlert }) {
    return (
        <div>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openSuccessAlert} autoHideDuration={2000} onClose={closeSuccessAlert}>
                    <Alert onClose={closeSuccessAlert} severity='success' sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openErrorAlert} autoHideDuration={2000} onClose={closeErrorAlert}>
                    <Alert onClose={closeErrorAlert} severity='error' sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    )
}

export default CustomAlert
