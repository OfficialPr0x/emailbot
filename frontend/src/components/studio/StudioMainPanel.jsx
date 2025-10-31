import { Suspense, lazy } from 'react'
import NeuLoader from '@/components/NeuLoader'

// Core Modules (loaded immediately)
import AnalyticsModule from './AnalyticsModule'
import ContentCalendarModule from './ContentCalendarModule'
import BrandAssetsModule from './BrandAssetsModule'
import PersonaModeModule from './PersonaModeModule'

// Advanced Modules (lazy loaded)
const NicheIntelModule = lazy(() => import('./NicheIntelModule'))
const CreatorReactorModule = lazy(() => import('./CreatorReactorModule'))
const GrowthEngineModule = lazy(() => import('./GrowthEngineModule'))
const InfluencerEngineModule = lazy(() => import('./InfluencerEngineModule'))
const AudienceBuilderModule = lazy(() => import('./AudienceBuilderModule'))

export default function StudioMainPanel({ activeModule }) {
  const renderModule = () => {
    switch (activeModule) {
      case 'analytics':
        return <AnalyticsModule />
      case 'content':
        return <ContentCalendarModule />
      case 'brand':
        return <BrandAssetsModule />
      case 'persona':
        return <PersonaModeModule />
      case 'niche':
        return (
          <Suspense fallback={<NeuLoader />}>
            <NicheIntelModule />
          </Suspense>
        )
      case 'reactor':
        return (
          <Suspense fallback={<NeuLoader />}>
            <CreatorReactorModule />
          </Suspense>
        )
      case 'growth':
        return (
          <Suspense fallback={<NeuLoader />}>
            <GrowthEngineModule />
          </Suspense>
        )
      case 'influencer':
        return (
          <Suspense fallback={<NeuLoader />}>
            <InfluencerEngineModule />
          </Suspense>
        )
      case 'audience':
        return (
          <Suspense fallback={<NeuLoader />}>
            <AudienceBuilderModule />
          </Suspense>
        )
      default:
        return <AnalyticsModule />
    }
  }

  return (
    <div className="p-6">
      {renderModule()}
    </div>
  )
}

