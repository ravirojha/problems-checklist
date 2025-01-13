import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const location = useLocation();

    // Don't show header on home page
    if (location.pathname === '/') return null;

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dp':
                return 'Dynamic Programming';
            case '/graph':
                return 'Graph';
            case '/two-pointers':
                return 'Two Pointers';
            case '/array':
                return 'Array';
            default:
                return '';
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="home-link">Home</Link>
                <h1>{getPageTitle()}</h1>
            </div>
        </header>
    );
};

export default Header; 