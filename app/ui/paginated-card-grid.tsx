'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InfoCard from '@/app/ui/InfoCard';

type CardItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

export default function PaginatedCardGrid({ items, colsMd = 3, pageSize = 6 }: { items: readonly CardItem[]; colsMd?: 2 | 3; pageSize?: number }) {
  const [page, setPage] = useState(0);
  const pages = useMemo(() => Math.ceil(items.length / pageSize), [items.length, pageSize]);
  const start = page * pageSize;
  const visible = items.slice(start, start + pageSize);

  const canPrev = page > 0;
  const canNext = page < pages - 1;

  return (
    <div className="relative">
      <div className={`grid grid-cols-3 md:grid-cols-${colsMd} gap-4 md:gap-6`}>
        {visible.map((item) => (
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

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Previous"
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next"
          disabled={!canNext}
          onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}


