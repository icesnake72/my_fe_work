import FloatingShapes from '../components/FloatingShapes'
import WelcomeMessage from '../components/WelcomeMessage'
import EnterButton from '../components/EnterButton'
import '../App.css'

function Welcome() {
  return (
    <>
      <FloatingShapes />
      <div className="center-container">
        <WelcomeMessage />
        <EnterButton />
      </div>
    </>
  )
}

export default Welcome

