import { Link } from 'react-router-dom'
import GNB from '../components/GNB'
import Footer from '../components/Footer'
import './SignupSuccess.css'

function SignupSuccess() {
  return (
    <>
      <GNB />
      <div className="signup-success-container">
        <div className="signup-success-card">
          <div className="success-icon">✓</div>
          <h1>환영합니다!</h1>
          <p className="success-message">
            회원가입이 성공적으로 완료되었습니다.
          </p>
          <div className="success-links">
            <Link to="/home" className="success-link home-link">
              홈으로
            </Link>
            <Link to="/login" className="success-link login-link">
              로그인
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SignupSuccess

