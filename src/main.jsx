import React from 'react'
import ReactDOM from 'react-dom/client'
import Menu from './Menu.jsx'
import './style.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import { getFiles } from './getFiles.js'

const router = createBrowserRouter([
  {
    path: '/Aniwave/',
    element: <Menu/>,
    loader: getFiles
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
