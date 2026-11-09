import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Services from '@/pages/Services/Services'
import Projects from '@/pages/Projects/Projects'
import Contact from '@/pages/Contact/Contact'
import NotFound from '@/pages/NotFound/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'projects', element: <Projects /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
