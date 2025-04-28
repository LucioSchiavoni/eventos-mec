
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from "react-toastify";

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
    </Routes>
    <ToastContainer 
          position="top-right"
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
    </BrowserRouter>
  )
}

export default App
