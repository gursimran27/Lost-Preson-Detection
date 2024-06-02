import React, { useRef } from 'react'
import useOnClickOutside from '../Hooks/useOnClickOutside'



const ConfirmationModal = ({responseImage,handler}) => {


  // so that if user clicked on rest of space then close the modal
  const ref=useRef(null)
  useOnClickOutside(ref,handler);


  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
    <div className="w-11/12 max-w-[1000px] rounded-lg border border-richblack-400 bg-richblack-800 p-6" ref={ref}>
        <p className="text-2xl font-semibold text-richblack-5 flex w-full justify-center">
            Result
        </p>
        <img src={responseImage} alt="Response Image" className="w-full h-auto" />
        <div className='w-full flex justify-center'>
            <button
                onClick={handler}
                className="mt-4 rounded-md bg-yellow-200 cursor-pointer py-[8px] px-[20px] font-semibold text-richblack-900 animate-pulse hover:animate-none transition-all duration-200 hover:scale-[1.1] flex justify-center "
            >
                Close
            </button>
        </div>
    </div>
</div>

  )
}

export default ConfirmationModal