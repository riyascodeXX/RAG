import { SignUp } from '@clerk/clerk-react'
import './signuppage.css'

const Signuppage = () => {
  return (
    <div className='signuppage'>
        <SignUp path="/sign-up" signInUrl="/sign-in"/>
    </div>
  )
}

export default Signuppage