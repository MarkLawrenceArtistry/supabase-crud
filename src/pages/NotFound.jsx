import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>404 Content Not Found</h1>
            <p>Check your URL.</p>
            <button onClick={() => navigate('/')}>Go back</button>
        </div>
    )
}