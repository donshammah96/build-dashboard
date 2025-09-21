import Image from 'next/image';
import { oxygen } from './ui/fonts';
import GoogleSignIn from './ui/GoogleSignIn';
import InfoCard from './ui/InfoCard';

type CardItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

const WHATS_ON: readonly CardItem[] = [
  { title: 'Idea Books', description: 'Browse idea books to find inspiration', imageSrc: '/blueprint.png', imageAlt: 'Idea books cover' },
  { title: 'Find a Professional', description: 'Find a professional for your specific needs.', imageSrc: '/professional.png', imageAlt: 'Professional services' },
  { title: 'Speak with an Advisor', description: 'Contact a knowledgeable guide.', imageSrc: '/contact1.png', imageAlt: 'Advisor support' },
] as const;

const VENDORS: readonly CardItem[] = [
  { title: 'Hardware Shops', description: 'Find hardware shops near you.', imageSrc: '/hardware2.png', imageAlt: 'Hardware store aisle' },
  { title: 'Commercial Stores', description: 'Find specialty stores to suit your specific project needs.', imageSrc: '/hardware.png', imageAlt: 'Commercial storefronts' },
] as const;

const PROFESSIONALS: readonly CardItem[] = [
  { title: 'Engineers', description: 'Find NCA registered engineers near you.', imageSrc: '/engineers.png', imageAlt: 'Engineers at work' },
  { title: 'Designers', description: 'Find accredited designers near you.', imageSrc: '/design.png', imageAlt: 'Design sketches' },
  { title: 'Architects', description: 'Find accredited architects near you.', imageSrc: '/architect.png', imageAlt: 'Architectural plans' },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-6 md:px-20 py-12">
      <h2 className="text-2xl md:text-5xl font-bold text-black mb-8">{title}</h2>
      {children}
    </section>
  );
}

function CardGrid({ items, colsMd = 3 }: { items: readonly CardItem[]; colsMd?: 2 | 3 }) {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-${colsMd} gap-8`}>
      {items.map((item) => (
        <InfoCard
          key={item.title}
          title={item.title}
          description={item.description}
          imageSrc={item.imageSrc}
          imageAlt={item.imageAlt}
          href={item.href}
          sizes={colsMd === 2 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
          priority={false}
        />
      ))}
    </div>
  );
}

export default function Page() {
  // Server Component: avoid calling client-only functions like getProviders here.

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
        <CardGrid items={WHATS_ON} colsMd={3} />
      </Section>

      <Section title="Browse Professionals Near You">
        <CardGrid items={PROFESSIONALS} colsMd={3} />
      </Section>

      <Section title="Browse Vendors Near You">
        <CardGrid items={VENDORS} colsMd={2} />
      </Section>

      
    </main>
  );
}