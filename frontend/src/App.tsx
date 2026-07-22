import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/dashboard'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
          console.log(token)
        navigate("/");
        return;
    }

    fetch("http://127.0.0.1:5000/dashboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
    })
    .then(res => {
        if (res.status != 200) {  
            console.log("Current token:", localStorage.getItem("token"));
            localStorage.removeItem("token");
            navigate("/");
        }
    });
}, []);
  
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
