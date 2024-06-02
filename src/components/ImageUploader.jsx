import React, { useState } from 'react';
import frameImg from "../assets/frame.png"
import logImg from "../assets/lost.jpg"
import Loader from "./Loader"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setImage } from '../Slices/imageSlice';



function ImageUploader() {

    const dispatch = useDispatch()

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);

    const [name,setName]=useState("");


    function changeHandler(e){
        setName(
            e.target.value
        )
    }

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    };




    const handleUpload = () => {
        setLoading(true)
        const toastId = toast.loading("Loading...")
        if (!selectedFile) {
            toast.error("Please select a file to upload.")
            toast.dismiss(toastId)
            setLoading(false)
            return;
        }   

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", name);

        // console.log(formData,name);

        fetch("http://localhost:5000/upload", {
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
            return response.json();
        })
        .then(data => {
            toast.success("Image Uploaded Successfully")
            console.log(data); // Response from the backend
            toast.dismiss(toastId)
            setLoading(false)
            dispatch(setImage(previewUrl))
            navigate("/test")
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
                <div className='flex md:flex-row flex-col-reverse justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0 md:items-start items-center'>
            
            
            <div className=' w-11/12 max-w-[450px] mx-0 mt-20'>
                <div className="flex flex-col w-full gap-y-4 mt-6">

                <label className='w-full'>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.353rem] mb-1'>
                        Lost Person Name<sup className='text-pink- 200'>*</sup>
                    </p>

                    <input 
                    required
                    type="text"
                    value={name}
                    name="name"
                    onChange={changeHandler}
                    placeholder="Enter name here"
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] '
                    />

                </label>
                

                <div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className='text-richblack-25 '/>
                </div>

                </div>

                <button className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6 animate-pulse hover:animate-none transition-all duration-200 hover:scale-[0.9]' onClick={handleUpload}>
               Submit
                </button>
            </div>



            <div className='relative w-11/12 max-w-[450px]'>
                <img 
                src={frameImg} 
                alt="pattern" 
                width={558} 
                height={584} 
                loading="lazy"
                className=''
                 />


                <img 
                src={logImg} 
                alt="student" 
                width={558} 
                height={584} 
                loading="lazy" 
                className='absolute -top-4 right-4'
                />

            </div>
            
        </div>
                )
            }
        </>
    );
}

export default ImageUploader;
