import { Helmet } from 'react-helmet-async'
import { COMPANY } from '@/constants'
import HeroSection from '@/features/home/HeroSection'
import IntroSection from '@/features/home/IntroSection'
import ProjectsCountSection from '@/features/home/ProjectsCountSection'
import PromiseSection from '@/features/home/PromiseSection'
import CareSection from '@/features/home/CareSection'
import ComfortSection from '@/features/home/ComfortSection'
import TrustSection from '@/features/home/TrustSection'
import NextSection from '@/components/layout/NextSection'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{COMPANY.name} — строительная компания</title>
      </Helmet>
      <HeroSection />
      <IntroSection />
      <ProjectsCountSection />
      <PromiseSection />
      <CareSection />
      <ComfortSection />
      <TrustSection />
      <NextSection to="/projects" title="Создаём уникальные проекты" />
    </>
  )
}
