const { BASE_URL } = require('./Constants')

exports.fetchData = async (url) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        const response = await fetch(`${BASE_URL}/${url}`, requestOptions)
        const data = await response.json()

        if (data.status === 200) {
            return data.data
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}
