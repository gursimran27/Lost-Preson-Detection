import React from 'react'
import signupImg from "../assets/signup.png"
import ImageUpload from './ImageUploader'

const Template = ({setIsLoggedIn}) => {
  return (
    <div>

        <ImageUpload
          title="Join the million learning to code with StudyNotion for free"
          desc1="Build Skills for today, tomorrow, and beyond"
          desc2="Education to future-proof your carrer"
          image={signupImg}
          formtype="signup"
          setIsLoggedIn={setIsLoggedIn}
        />

    </div>
  )
}

export default Template