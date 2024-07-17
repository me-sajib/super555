import * as React from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import BallonIcon from '../../Assets/balloon.png'
import { successModalStyle } from '../../Styles/Modal.js'
import { Cancel } from '@mui/icons-material'
import { Button } from '@mui/material'

function SuccessModal({ open, handleClose, content, btnText, onButtonClick }) {
    return (
        <div>
            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500
                    }
                }}>
                <Fade in={open}>
                    <Box sx={successModalStyle}>
                        <div className='flex flex-col items-center gap-6 justify-center mt-8'>
                            <img className='w-32' src={BallonIcon} alt='' />
                            <h1 className='text-center text-xl font-bold text-gray-700'>{content}</h1>
                            <Button sx={{}} variant='contained' color='success' onClick={() => onButtonClick()}>
                                {btnText}
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default SuccessModal
