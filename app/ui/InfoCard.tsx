// app/ui/InfoCard.tsx
import Link from 'next/link';
import Image from 'next/image';

type InfoCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  sizes?: string;
  priority?: boolean;
};

export default function InfoCard({ title, description, imageSrc, imageAlt, href, sizes, priority }: InfoCardProps) {
  const content = (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-[3/2]">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes={sizes || '(min-width: 768px) 33vw, 100vw'}
          priority={priority}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} aria-label={title}>
      {content}
    </Link>
  ) : (
    content
  );
}