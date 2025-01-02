import { useState } from 'react'
import './App.css'
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import UserWorkspace from './components/UserWorkspace';
import Settings from './components/Settings';
import Formbot from './components/Formbot';
import EndUserForm from './components/EndUserForm';
import JoinWorkspace from './components/JoinWorkspace';
import Response from './components/Response';

function App() {
  const routerdata = createBrowserRouter([
    {
    path: "/",
    element: <LandingPage />,
    }, 
    {
      path: '/login',
      element: <Login/>,
    },
    {
     path: '/signup',
     element: <Signup/>,
    },
    {
      path: '/userWorkspace',
      element: <UserWorkspace/>,
     },
     {
      path: '/settings',
      element: <Settings/>,
     },
     {
      path: '/formbot',
      element: <Formbot/>,
     },
     {
      path: '/forms/:workspaceId/:formId',
      element: <EndUserForm/>,
     },
     {
      path: '/workspace/:workspaceId/join',
      element: <JoinWorkspace/>,
     },
     {
      path: '/response',
      element: <Response/>,
     }
])

  return (
    <>
    <RouterProvider router={routerdata} />
    </>
  )
}

export default App
