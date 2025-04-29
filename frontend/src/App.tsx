
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from "react-toastify";
import { Provider } from './providers/providers';

function App() {


  return (
    <BrowserRouter>
    <Provider>
    <Routes>
      <Route path="/" element={<Home/>} />
    </Routes>
    <ToastContainer 
          position="top-right"
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
      </Provider>
    </BrowserRouter>
  )
}

export default App
