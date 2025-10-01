import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { oxygen } from '../fonts';
import { fetchCardData } from '../../lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
  clients: UserGroupIcon,
  professionals: UsersIcon,
  projects: BuildingOfficeIcon,
  tasks: ClockIcon,
  task_updates: ClockIcon,
  vendors: BuildingStorefrontIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfClients,
    numberOfProfessionals,
  } = await fetchCardData();

  return (
    <>

      {
        <Card title="Collected" 
        value={totalPaidInvoices} 
        type="collected" />
      }
      {
        <Card title="Pending" 
        value={totalPendingInvoices} 
        type="pending" />
      }
      {
        <Card title="Total Invoices" 
        value={numberOfInvoices} 
        type="invoices" />
      }
      {<Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
      }
      {
        <Card title="Total Clients" 
        value={numberOfClients} 
        type="clients" 
        />
      }
      {
        <Card title="Total Professionals" 
        value={numberOfProfessionals} 
        type="professionals" 
        />
      }
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected' | 'clients' | 'professionals';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${oxygen.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
