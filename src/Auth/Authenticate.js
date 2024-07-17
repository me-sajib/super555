
const isAuthenticated = () => {
    try {
        let userState = false
        const isUserAuthenticated = localStorage.getItem('isAuth')
        if (isUserAuthenticated === true || isUserAuthenticated === 'true') {
            userState = true
        }
        return userState
    } catch {
        return false
    }
}

export default isAuthenticated
