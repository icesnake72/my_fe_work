import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import './GNB.css'

function GNB() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  
  /**
   * handleLogout 함수
   * 
   * 로그아웃 버튼 클릭 시 호출되는 함수입니다.
   * AuthContext의 logout 함수를 호출하여 서버에 로그아웃 요청을 보내고,
   * 로컬 저장소를 정리한 후 로그인 페이지로 이동합니다.
   */
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 에러가 발생해도 로컬 정리는 완료되었으므로 로그인 페이지로 이동
      navigate('/login')
    }
  }
  
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
          {isAuthenticated ? (
            <>
              <span className="gnb-user-info">
                {user?.name || user?.email || '사용자'}님
              </span>
              <button 
                onClick={handleLogout}
                className="gnb-link auth-link logout-button"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="gnb-link auth-link">
                로그인
              </Link>
              <Link to="/signup" className="gnb-link auth-link">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default GNB

