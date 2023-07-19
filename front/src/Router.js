import {
    createBrowserRouter,
  } from "react-router-dom";

import App from "./App";
import Login from "./components/login/Login .jsx"
import Profile from "./components/Admin/Profile";
import Student from "./components/Admin/students/Students"
import Grade from "./components/Admin/addGrades/Grade";
import Egrade from "./components/Admin/editGrades/Egrade";


  const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {
                path: "",
                element:<Login/>
            },
            {
                path: "/admin",
                element:<Profile/>,
                children:[
                    {
                        path:"",
                        element:<Student/>
                    },
                    {
                        path:"/admin/ADDgrades",
                        element:<Grade/>
                    },
                    {
                        path:"/admin/EDITgrades",
                        element:<Egrade/>
                    },
                ]
            },
        ]
    }
  ])
  export default Router
  
  