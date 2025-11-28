import GNB from '../components/GNB'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  return (
    <>
      <GNB />
      <div className="home-container">
        <h1>Home 페이지</h1>
        <p>환영합니다!</p>
      </div>
      <Footer />
    </>
  )
}

export default Home

