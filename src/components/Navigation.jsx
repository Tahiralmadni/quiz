import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/Navigation.module.css';

const Navigation = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        Quiz App
      </div>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/scoreboard" className={styles.link}>Scoreboard</Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout ({userName})
        </button>
      </div>
    </nav>
  );
};

export default Navigation;