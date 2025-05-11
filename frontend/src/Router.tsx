import '@/Global.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from '@/components/pages/homepage'
import SecondPage from '@/components/pages/secondpage'
import ProfilePage from './components/pages/profilepage'
import NotFoundPage from './pages/404';

// Define the routes table
// This is a simple array of route definitions
// Each route has a path and a component
// In a real application, you might use a more complex routing library
export const routesTable: any[] = [
  {
    route: '/',
    component: HomePage
  },
  {
    route: '/second',
    component: SecondPage
  },
  {
    route: '/@/:id',
    component: ProfilePage
  },
]

// // Get the URL search params. Example: ?id=123
// const searchParams = new URLSearchParams(window.location.search)

// // Get the URL hash. Example: #hash
// const hash = window.location.hash

// // Get the URL host. Example: localhost:8080
// const host = window.location.host

// // Get the URL protocol. Example: http: or https:
// const protocol = window.location.protocol

// // Get the URL port. Example: 8080
// const port = window.location.port

// // Get the URL origin. Example: http://localhost:8080
// const origin = window.location.origin

// // Get the URL href. Example: http://localhost:8080/test
// const href = window.location.href


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/@/:id" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter
