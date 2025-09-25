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
    <div className="flex flex-col rounded-md overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes={sizes || '(min-width: 768px) 33vw, 100vw'}
          priority={priority}
        />
      </div>
      <div className="p-3">
        <h3 className="text-base md:text-lg font-semibold text-black mb-1">{title}</h3>
        {description ? <p className="text-sm text-gray-600">{description}</p> : null}
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