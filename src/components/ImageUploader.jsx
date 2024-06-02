import React, { useState } from 'react';
import frameImg from "../assets/frame.png"
import logImg from "../assets/lost.jpg"
import Loader from "./Loader"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setImage } from '../Slices/imageSlice';
import { FileUploader } from "react-drag-drop-files";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";

const fileTypes = ["JPG", "JPEG", "PNG"];

function ImageUploader() {

    const dispatch = useDispatch()

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);

    const [name,setName]=useState("");

    const [selectedFile, setSelectedFile] = useState(null);

    const [resetKey, setResetKey] = useState(Date.now());

    function changeHandler(e){
        setName(
            e.target.value
        )
    }


    const handleFileChange = (event) => {
        setSelectedFile(event);
        setPreviewUrl(URL.createObjectURL(event));
    };


    const deleteFileHandler = ()=>{
        setSelectedFile(null);
        setPreviewUrl(null)
        setResetKey(Date.now()); // Change key to force re-render
    }


    const deleteDataHandler = ()=>{
        setLoading(true)
        const toastId = toast.loading("Loading...")
        fetch('http://localhost:5000/delete', {
            method: 'GET'
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete data');
            }
            return response.json();
          })
          .then(data => {
            console.log(data); // Handle success response
            dispatch(setImage(null))
            sessionStorage.removeItem('imageUrl');
            toast.success("Data Deleted Successfully")
            toast.dismiss(toastId)
            setLoading(false)
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("Error While Uploading")
            toast.dismiss(toastId)
            setLoading(false)
          });
    }



    const handleUpload = () => {
        setLoading(true)
        const toastId = toast.loading("Loading...")
        if (!selectedFile) {
            toast.error("Please select a file to upload.")
            toast.dismiss(toastId)
            setLoading(false)
            return;
        }   
        if (!name) {
            toast.error("Please enter name.")
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
            sessionStorage.setItem('imageUrl', JSON.stringify(previewUrl));
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
                <div>
                <div className='flex md:flex-row flex-col-reverse justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0 md:items-start items-center'>
            
            
            <div className=' w-11/12 max-w-[450px] mx-0 mt-20'>
                <div className="flex flex-col w-full gap-y-4 mt-6">

                <label className='w-full'>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.353rem] mb-1'>
                        Lost Person Name<sup className='text-pink- 200'>*</sup>
                    </p>

                    <input 
                   required={true}
                    type="text"
                    value={name}
                    name="name"
                    onChange={changeHandler}
                    placeholder="Enter name here"
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] '
                    />

                </label>
                

                {/* <div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className='text-richblack-25 '/>
                </div> */}
                <div className='text-richblack-25 font-semibold '>
                    <FileUploader  key={resetKey} 
                       // React uses the key prop to identify which elements have changed, are added, or are removed. By changing the key prop value, we effectively tell React to recreate the FileUploader component, resetting its internal state, including any labels or other visual indicators.
                        multiple={false} 
                        handleChange={handleFileChange} 
                        name="file" types={fileTypes} 
                        required={true}
                        // label="Upload or drop a file right here"

                    />
                    <div className='flex items-center gap-x-1 mt-1'>
                        <p className='text-[0.87rem] text-richblack-50 leading-[1.353rem] mb-1'>{selectedFile ? `File uploaded: ${selectedFile.name }` : "no files uploaded yet"}</p>

                        {
                            selectedFile &&
                            <div>
                               <MdDeleteForever onClick={deleteFileHandler} className='text-2xl text-[#FF0000] animate-pulse cursor-pointer' data-tooltip-id="my-tooltip-1"/>
                               <ReactTooltip
                                  id="my-tooltip-1"
                                  place="bottom-start"
                                  variant="dark"
                                 content={`Delete the ${selectedFile.name} files`}
                                />
                            </div>
                        }
                    </div>

                    
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

                
        <button className= 'mt-16 mr-12 bg-yellow-50 rounded-[10px] font-medium text-richblack-900 px-[25px] py-[10px] animate-bounce float-right' onClick={deleteDataHandler}>Delete Data</button>
                    
        </div>
                )
            }


        </>
    );
}

export default ImageUploader;
