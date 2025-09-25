import PaginatedCardGrid from '@/app/ui/paginated-card-grid';

type CardItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

export default function HomeCardGrid({ items, colsMd = 3 }: { items: readonly CardItem[]; colsMd?: 2 | 3 }) {
  return <PaginatedCardGrid items={items} colsMd={colsMd} pageSize={6} />;
}


