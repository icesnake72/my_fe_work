import { Link, useLocation } from 'react-router-dom'
import './GNB.css'

function GNB() {
  const location = useLocation()
  
  return (
    <nav className="gnb">
      <div className="gnb-container">
        <div className="gnb-left">
          <Link to="/home" className={`gnb-link ${location.pathname === '/home' ? 'active' : ''}`}>
            HOME
          </Link>
          <Link to="/my-works" className={`gnb-link ${location.pathname === '/my-works' ? 'active' : ''}`}>
            MY WORKS
          </Link>
          <Link to="/about-me" className={`gnb-link ${location.pathname === '/about-me' ? 'active' : ''}`}>
            ABOUT ME
          </Link>
          <Link to="/contact" className={`gnb-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            CONTACT
          </Link>
        </div>
        <div className="gnb-right">
          <Link to="/login" className="gnb-link auth-link">
            로그인
          </Link>
          <Link to="/signup" className="gnb-link auth-link">
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default GNB

