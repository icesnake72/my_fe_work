import { useNavigate } from 'react-router-dom'
import './EnterButton.css'

function EnterButton() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/home')
  }
  
  return (
    <button className="enter-button" onClick={handleClick}>
      <span className="button-shine"></span>
      ENTER
    </button>
  )
}

export default EnterButton

