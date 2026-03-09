import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/ui/Navbar'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import About from './components/sections/About'
import CallToAction from './components/sections/CallToAction'
import Footer from './components/sections/Footer'
import Preloader from './components/ui/Preloader'
import HomePage from './pages/home/HomePage'
import CardEditor from './pages/create/CardEditor'

function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <CallToAction />
        <About />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <>
      <Preloader onComplete={() => setReady(true)} />
      {ready && (
        <>
          <Navbar isDark={isDark} toggleTheme={() => setIsDark(d => !d)} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={
              <>
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            <Route path="/sample-2" element={
              <>
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            <Route path="/create" element={
              <main><CardEditor /></main>
            } />
          </Routes>
        </>
      )}
    </>
  )
}
