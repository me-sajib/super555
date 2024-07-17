exports.shouldShowContest = (time) => {
    try {
        const timeLeft = Number(time) - new Date().getTime()
        if (timeLeft < 2 * 86400000) {
            return true
        }
        return false
    } catch {
        return false
    }
}

exports.getFirstPrizeOfContest = (contest) => {
    try {
        const rewards = contest.rewards
        let prize = null

        rewards.forEach((reward) => {
            if (reward.rank === 1 && reward.reward.length > 0) {
                prize = reward.reward
            }
        })
        return prize
    } catch {
        return null
    }
}
