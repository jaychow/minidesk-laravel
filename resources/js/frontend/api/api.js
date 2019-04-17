import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: window.APP_URL,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}
