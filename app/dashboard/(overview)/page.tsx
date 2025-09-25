import { Card } from '../../ui/dashboard/cards';
import RevenueChart from '../../ui/dashboard/revenue-chart';
import LatestInvoices from '../../ui/dashboard/latest-invoices';
import { oxygen } from '../../ui/fonts';
import{ Suspense } from 'react';
import CardWrapper from '../../ui/dashboard/cards';
import { 
    InvoiceSkeleton, 
    RevenueChartSkeleton, 
    CardSkeleton 
} from '../../ui/skeletons';


export const dynamic = 'force-dynamic';

export default async function Page() {
    return (
        <main>
            <h1 className={`${oxygen.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<InvoiceSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}