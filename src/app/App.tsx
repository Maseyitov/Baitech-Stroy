import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'motion/react'
import { router } from '@/routes'

export default function App() {
  return (
    <HelmetProvider>
      {/* reducedMotion="user": у людей с включённым «уменьшением движения» большие перемещения отключаются */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </HelmetProvider>
  )
}
