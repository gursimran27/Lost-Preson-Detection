// useRef hook is used  to provide a mutable variable , and it doesnot re-render the component when this variable get updated.  Secondly useRef is used to directly access the Dome-element for this just add ref="" in the element which you want to access.
// useRef hook return an object called current and all the values are in it
// eg-> const ref=useRef(0)     console.log(ref.current)


import { useEffect } from "react";

// This hook detects clicks outside of the specified component and calls the provided handler function.
export default function useOnClickOutside(ref, handler) {
    // console.log("inside the custom hook........");

  useEffect(() => {
    // Define the listener function to be called on click/touch events
    const listener = (event) => {
      // If the click/touch event originated inside the ref element, do nothing
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Otherwise, call the provided handler function
      handler(event);  
    };

    // Add event listeners for mousedown and touchstart events on the document
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Only run this effect when the ref or handler function changes
}


// when i not clicked on the profile btn then at that time ref=null beacuse the dropdown is not opened and when the dropdown get opened then the ref=<div><link></link> <div></div></div> 