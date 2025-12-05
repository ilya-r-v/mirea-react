import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <h1>404 - Страница не найдена</h1>
                <p>Извините, запрашиваемая страница не существует.</p>
                <Link to="/" className="btn btn-primary">
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
}

export default NotFound;