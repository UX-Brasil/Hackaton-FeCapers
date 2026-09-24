import {Header} from '@/components/layout/header';
import {Footer} from '@/components/layout/footer';
import {HeroSection} from '@/components/sections/hero-section';
import {ProposalSection} from '@/components/sections/proposal-section';
import {PillarsSection} from '@/components/sections/pillars-section';
import {CommunityGallerySection} from '@/components/sections/community-gallery-section';
import {AreasSection} from '@/components/sections/areas-section';
import {JourneySection} from '@/components/journey/journey-section';
import {AreaDiscoverySection} from '@/components/journey/area-discovery-section';
import {TestimonialsSection} from '@/components/sections/testimonials-section';
import {CommunitySection} from '@/components/sections/community-section';
import {CareerSupportSection} from '@/components/sections/career-support-section';
import {InitiativesSection} from '@/components/sections/initiatives-section';
import {SupportSection} from '@/components/sections/support-section';
import {FinalCTASection} from '@/components/sections/final-cta-section';
import {ScrollToTop} from '@/components/ui/scroll-to-top';
import {Toaster} from '@/components/ui/toaster';
import {Motion} from '@/components/motion/motion';
import {JunoAssistant} from '@/components/juno/juno-assistant';

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <HeroSection />
        <ProposalSection />
        <PillarsSection />
        <CommunityGallerySection />
        <AreasSection />
        <JourneySection />
        <AreaDiscoverySection />
        <TestimonialsSection />
        <CommunitySection />
        <CareerSupportSection />
        <InitiativesSection />
        <SupportSection />
        <FinalCTASection />
      </main>
      <Footer />
      <ScrollToTop />
      <JunoAssistant />
      <Toaster />
      <Motion />
    </>
  );
}
