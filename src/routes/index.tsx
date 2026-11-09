import { createBrowserRouter } from 'react-router-dom'
import { CATALOG_PATH } from '@/constants'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Services from '@/pages/Services/Services'
import Projects from '@/pages/Projects/Projects'
import Contact from '@/pages/Contact/Contact'
import Catalog from '@/pages/Catalog/Catalog'
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
      // handle.hideFooter — Layout не рисует футер (страница с фильтрами, как приложение)
      { path: CATALOG_PATH.slice(1), element: <Catalog />, handle: { hideFooter: true } },
      { path: '*', element: <NotFound /> },
    ],
  },
])
