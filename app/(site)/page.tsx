import Hero from '@/components/landing/Hero';
import TrustStrip from '@/components/landing/TrustStrip';
import Benefits from '@/components/landing/Benefits';
import Features from '@/components/landing/Features';
import ProductPreview from '@/components/landing/ProductPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import Compatibility from '@/components/landing/Compatibility';
import Pricing from '@/components/landing/Pricing';
import PurchaseProcess from '@/components/landing/PurchaseProcess';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <Benefits />
      <Features />
      <ProductPreview />
      <HowItWorks />
      <Compatibility />
      <Pricing />
      <PurchaseProcess />
      <Faq />
      <FinalCta />
    </div>
  );
}
