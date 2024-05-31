import React, { useState } from 'react';
import frameImg from "../assets/frame.png"
import Loader from "./Loader"
import { toast } from "react-hot-toast"
import ConfirmationModal from './ConformationModal';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



function ImageUploaderWithResponse() {
    const image=useSelector((state)=>state.image.image)
    console.log(image);

    const navigate=useNavigate()

    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [responseImage, setResponseImage] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const backHandler=()=>{
        navigate("/")
    }

    const handleUpload = () => {
        setLoading(true)
        const toastId = toast.loading("Finding The Match🕰️...")
        if (!selectedFile) {
            toast.error("Please select a file to upload.")
            toast.dismiss(toastId)
            setLoading(false)
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        fetch("http://localhost:5000/test", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                setLoading(false)
                toast.error("Error While Uploading")
                toast.dismiss(toastId)
                throw new Error("Failed to upload image.");
            }
            return response.blob();
        })
        .then(blob => {
            // Convert blob to URL
            const imageUrl = URL.createObjectURL(blob);
            toast.success("Image Uploaded Successfully")
            toast.dismiss(toastId)
            setLoading(false)
            setResponseImage(imageUrl);
        })
        .catch(error => {
            console.error("Error uploading image:", error);
            toast.error("Error While Uploading")
            toast.dismiss(toastId)
            setLoading(false)
        });
    };

    return (
        <>
            {
                loading ?
                (<Loader/>)
                :
                (
                <div>
                <div className='flex md:flex-row-reverse flex-col-reverse justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0 md:items-start items-center'>
            
            
            <div className='w-11/12 max-w-[450px] mx-0 mt-24'>
                <div className="flex flex-col w-full gap-y-4 mt-6">

                <label className='w-full'>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.353rem] mb-1'>
                        Upload the Test Image<sup className='text-pink- 200'>*</sup>
                    </p>

                </label>
                

                <div>
                <input type="file" accept="image/*" onChange={handleFileChange}  className='text-richblack-25' />

                </div>

                </div>

                <button className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6 animate-pulse hover:animate-none transition-all duration-200 hover:scale-[0.9]' onClick={handleUpload}>
               Submit
                </button>
            </div>



            <div className='relative w-11/12 max-w-[450px] mt-20'>
               
                <img 
                src={image} 
                alt="Losr Person Image" 
                width={558} 
                height={584} 
                loading="lazy" 
                className='absolute -top-4 right-4'
                />

            </div>
            
        </div>

                    <button className='bg-yellow-50 rounded-[10px] font-medium text-richblack-900 px-[25px] py-[10px] mt-40 animate-bounce float-right mr-20' onClick={backHandler}>Back</button>
                </div>
                )
            }

            {/* when confirmationModal is null then donot render component <onfirmationModal/> else render*/}
        {
            responseImage && <ConfirmationModal responseImage={responseImage} handler={()=>setResponseImage(null)}/>
        }
        </>
    );
}

export default ImageUploaderWithResponse;

