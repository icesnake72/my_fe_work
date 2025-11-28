import './WelcomeMessage.css'

function WelcomeMessage() {
  return (
    <div className="welcome-container">
      <h1>나의 작업 페이지에 오신걸 환영합니다.</h1>
      <div className="underline-container">
        <div className="underline-line"></div>
        <div className="flame-effect"></div>
      </div>
    </div>
  )
}

export default WelcomeMessage

