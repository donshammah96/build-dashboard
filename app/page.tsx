import Image from 'next/image';
import { oxygen } from './ui/fonts';
import GoogleSignIn from './ui/GoogleSignIn';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import InfoCard from './ui/InfoCard';
import { CardGridSkeleton } from './ui/skeletons';
import { ROUTES } from './lib/links';
import NavLinks from './ui/nav-links';

type CardItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

const WHATS_ON: readonly CardItem[] = [
  { 
    title: 'Idea Books', 
    description: '', 
    imageSrc: '/blueprint.png', 
    imageAlt: 'Idea books cover',
    href: ROUTES.ideaBooks

  },
  { 
    title: 'Find a Professional', 
    description: '', 
    imageSrc: '/professional.png', 
    imageAlt: 'Professional services',
    href: ROUTES.findProfessional
  },
  { 
    title: 'Speak with an Advisor', 
    description: '', 
    imageSrc: '/contact1.png', 
    imageAlt: 'Advisor support',
    href: ROUTES.speakWithAdvisor
  },
] as const;

const VENDORS: readonly CardItem[] = [
  { 
    title: 'Tiles and Bathrooms', 
    description: '', 
    imageSrc: '/tiles.png', 
    imageAlt: 'Tiles and Bathrooms',
    href: ROUTES.hardwareShops
  },
  { 
    title: 'Flooring', 
    description: '', 
    imageSrc: '/flooring.png', 
    imageAlt: 'Flooring',
    href: ROUTES.commercialStores
  },
  {
    title: 'Cabinets', 
    description: '', 
    imageSrc: '/cabinet.png', 
    imageAlt: 'Cabinets',
    href: ROUTES.cabinets
  },
  {
    title: 'Furniture', 
    description: '', 
    imageSrc: '/furniture.png', 
    imageAlt: 'Furniture',
    href: ROUTES.furniture
  },
  {
    title: 'Electrical and Lighting', 
    description: '', 
    imageSrc: '/lighting.png', 
    imageAlt: 'Electrical and Lighting',
    href: ROUTES.electricalAndLighting
  },
  {
    title: 'Plumbing', 
    description: '', 
    imageSrc: '/plumbing.png', 
    imageAlt: 'Plumbing',
    href: ROUTES.plumbing
  },
  {
    title: 'Paint and Wallpapers', 
    description: '', 
    imageSrc: '/paint.png', 
    imageAlt: 'Paint and Wallpapers',
    href: ROUTES.paintAndWallpapers
  },
  {
    title: 'Kitchen Fixtures', 
    description: '', 
    imageSrc: '/kitchen-fixtures.png', 
    imageAlt: 'Kitchen Fixtures',
    href: ROUTES.flooringAndTile
  }
] as const;

const PROFESSIONALS: readonly CardItem[] = [
  {
    title: 'General Contractors', 
    description: '', 
    imageSrc: '/contractor.png', 
    imageAlt: 'General Contractors',
    href: ROUTES.generalContractors
  },
  { 
    title: 'Engineers', 
    description: '', 
    imageSrc: '/engineers.png', 
    imageAlt: 'Engineers at work',
    href: ROUTES.engineers
  },
  { 
    title: 'Designers', 
    description: '', 
    imageSrc: '/design.png', 
    imageAlt: 'Design sketches',
    href: ROUTES.designers
  },
  { 
    title: 'Architects', 
    description: '', 
    imageSrc: '/architect.png', 
    imageAlt: 'Architectural plans',
    href: ROUTES.architects
  },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-6 md:px-20 py-12">
      <h2 className="text-2xl md:text-2xl font-bold text-black mb-4">{title}</h2>
      {children}
    </section>
  );
}

const HomeCardGrid = dynamic(() => import('./ui/home-card-grid'), {
  loading: () => <CardGridSkeleton count={3} colsMd={3} />,
  ssr: true,
});

export default function Page() {

  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 relative h-[500px] md:h-[600px] rounded-lg overflow-hidden">
        {/* Background Images (switch by breakpoint) */}
        <Image
          src="/logo1.png"
          fill
          priority
          sizes="(min-width: 768px) 100vw, 100vw"
          className="object-cover md:hidden"
          alt="Hero background mobile"
        />
        <Image
          src="/logo1.png"
          fill
          priority
          sizes="(min-width: 768px) 100vw, 100vw"
          className="object-cover hidden md:block"
          alt="Hero background desktop"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Overlay: title + Google sign-in */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className={`${oxygen.className} text-2xl md:text-4xl md:leading-normal font-bold`}>
              Welcome to Build Market. Ideal Place To Find Professionals.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className={`${oxygen.className} text-lg font-bold`}>Continue with</p>
              <GoogleSignIn />
              <p className="text-sm opacity-90">Use your Google account to get started quickly.</p>
            </div>
          </div>
        </div>
      </div>
      <Section title="What’s on Build Market">
        <Suspense fallback={<CardGridSkeleton count={3} colsMd={3} />}>
          <HomeCardGrid items={WHATS_ON} colsMd={3} />
        </Suspense>
      </Section>

      <Section title="Browse Professionals Near You">
        <Suspense fallback={<CardGridSkeleton count={3} colsMd={3} />}>
          <HomeCardGrid items={PROFESSIONALS} colsMd={3} />
        </Suspense>
      </Section>

      <Section title="Browse Vendors Near You">
        <Suspense fallback={<CardGridSkeleton count={2} colsMd={2} />}>
          <HomeCardGrid items={VENDORS} colsMd={2} />
        </Suspense>
      </Section>
    </main>
  );
}