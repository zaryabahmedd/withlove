import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
import CardSharePage from './pages/card/CardSharePage'
import AboutPage from './pages/about/AboutPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import TermsPage from './pages/legal/TermsPage'
import { ensureGuestSession } from './utils/guestSession'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

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
  const location = useLocation()
  const isCardSharePage = location.pathname.startsWith('/card/')
  
  const [ready, setReady] = useState(isCardSharePage) // Skip preloader for card share pages
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    ensureGuestSession()
  }, [])

  return (
    <>
      {!isCardSharePage && <Preloader onComplete={() => setReady(true)} />}
      {ready && (
        <>
          <ScrollToTop />
          {!isCardSharePage && <Navbar isDark={isDark} toggleTheme={() => setIsDark(d => !d)} />}
          <Routes>
            <Route path="/" element={
              <>
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            <Route path="/home" element={
              <>
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            <Route path="/sample-2" element={<LandingPage />} />
            <Route path="/create" element={
              <main><CardEditor /></main>
            } />
            <Route path="/about" element={
              <>
                <main><AboutPage /></main>
                <Footer />
              </>
            } />
            <Route path="/privacy" element={
              <>
                <main><PrivacyPage /></main>
                <Footer />
              </>
            } />
            <Route path="/terms" element={
              <>
                <main><TermsPage /></main>
                <Footer />
              </>
            } />
            <Route path="/card/:id" element={<CardSharePage />} />
          </Routes>
        </>
      )}
    </>
  )
}
