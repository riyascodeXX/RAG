import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Homepage from "./routes/homepage/Homepage"
import Dashboardpage from "./routes/dashboardpage/Dashboardpage";
import Chatpage from "./routes/chatpage/Chatpage";
import Rootlayout from "./layout/Rootlayout";
import Dashboardlayout from "./layout/Dashboardlayout"
import Signinpage from "./routes/signinpage/Signinpage";
import Signuppage from "./routes/signuppage/Signuppage";





const router = createBrowserRouter([
  {
    element:<Rootlayout />,
    children:[
      {
        path:"/",
        element:<Homepage />
      },
      {
        path:"/sign-in/*",
        element:<Signinpage/>
      },
      {
        path:"/sign-up/*",
        element:<Signuppage />
      },
      {
        element:<Dashboardlayout />,
        children:[
          {
            path:"/dashboard",
            element:<Dashboardpage />
          },
          {
            path:"/dashboard/chats/:id",
            element:<Chatpage />
          }]
      },
    ]
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);






/*import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './index.css'
import Homepage from './routes/homepage/Homepage.jsx'
import Dashboardpage from './routes/dashboardpage/Dashboardpage.jsx'
import Chatpage from './routes/chatpage/Chatpage.jsx'





const router =createBrowserRouter([
  {path:"/",
    element:
    <Homepage />
    },{
      path:"about",
      element:<Dashboardpage />
      ,
      children:[{path:"dashborad/chats/:id",element:<Chatpage />}]
    },
])




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)*/
