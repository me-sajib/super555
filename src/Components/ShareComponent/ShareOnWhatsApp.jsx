import React from 'react'

const ShareOnWhatsApp = ({ referralCode }) => {
    const handleWhatsAppShare = () => {
        const message = encodeURIComponent(`Sign up using my referral code ${referralCode} to win 50 Super Coins : https://super5.live/login?referralCode=${referralCode}`)
        const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className='flex items-center justify-center'>
            <button className='bg-green-600 px-4 py-2 rounded text-white font-bold' onClick={handleWhatsAppShare}>
                Refer on WhatsApp
            </button>
        </div>
    )
}

export default ShareOnWhatsApp
