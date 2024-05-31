import "./App.css";
import {Route, Routes} from "react-router-dom"
import TestImage from "./components/TestImage"
import NavBar from "./components/Navbar";
import Template from "./components/Template"
import Error from "./components/Error"



function App() {



  return (
          <div className="w-[100vw] md:h-[100vh]  bg-richblack-900 flex flex-col overflow-auto ">
            
                <NavBar/>


                {/* all routes */}

                    <Routes>

                        <Route path="/" element={<Template/>}/>
                         
                        <Route path="/test" element={<TestImage/>}/>

                         {/* .....404 Page..... */}
                         <Route path="*" element={<Error/>} />
                             

                    </Routes>


          </div>
  );
}

export default App;
