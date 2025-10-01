import {
  CustomerField,
  CustomersTableType,
  ClientField,
  ClientsTableType,
  ProfessionalField,
  ProfessionalsTableType,
  ClientInvoiceTable,
  ProfessionalInvoiceTable,
  ProfessionalInvoice,
  ClientInvoice,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { getSqlClient } from './db';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const db = getSqlClient();
    const data = await db<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const db = getSqlClient();
    const data = await db<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const db = getSqlClient();
    const invoiceCountPromise = db`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = db`SELECT COUNT(*) FROM customers`;
    const clientCountPromise = db`SELECT COUNT(*) FROM clients`;
    const professionalCountPromise = db`SELECT COUNT(*) FROM professionals`;
    const invoiceStatusPromise = db`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      clientCountPromise,
      professionalCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const numberOfClients = Number(data[2][0].count ?? '0');
    const numberOfProfessionals = Number(data[3][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[4][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[4][0].pending ?? '0');
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
      numberOfClients,
      numberOfProfessionals,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const db = getSqlClient();
    const invoices = await db<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const db = getSqlClient();
    const data = await db`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const db = getSqlClient();
    const data = await db<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const db = getSqlClient();
    const customers = await db<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const db = getSqlClient();
    const data = await db<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchClients() {
  try {
    const db = getSqlClient();
    const clients = await db<ClientField[]>`
      SELECT
        id,
        first_name,
        last_name,
        email,
        image_url
      FROM clients
      ORDER BY first_name ASC
    `;
    return clients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all clients.');
  }
}

export async function fetchFilteredClients(query: string) {
  try {
    const db = getSqlClient();
    const data = await db<ClientsTableType[]>`
      SELECT
        clients.id,
        clients.user_id,
        clients.first_name,
        clients.last_name,
        clients.email,
        clients.image_url,
        clients.default_address_street,
        clients.default_address_city,
        clients.default_address_county,
        clients.default_address_zip,
        clients.default_address_country,
        clients.default_address_latitude,
        clients.default_address_longitude,
        clients.contact_preference,
        clients.project_budget_preference_min,
        clients.project_budget_preference_max,
        clients.project_budget_preference_currency,
        clients.project_budget_preference_currency_symbol,
        clients.project_budget_preference_currency_symbol_position,
        clients.project_budget_preference_currency_symbol_position_position,
        clients.created_at,
        clients.updated_at,
        clients.last_login_at,
        COUNT(client_invoices.id) AS total_invoices,
        SUM(CASE WHEN client_invoices.status = 'pending' THEN client_invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN client_invoices.status = 'paid' THEN client_invoices.amount ELSE 0 END) AS total_paid
      FROM clients
      LEFT JOIN client_invoices ON clients.id = client_invoices.client_id
      WHERE 
        clients.first_name ILIKE ${`%${query}%`} OR 
        clients.last_name ILIKE ${`%${query}%`} OR 
        clients.email ILIKE ${`%${query}%`}
      GROUP BY clients.id, clients.user_id, clients.first_name, clients.last_name, clients.email, clients.image_url,
               clients.default_address_street, clients.default_address_city, clients.default_address_county,
               clients.default_address_zip, clients.default_address_country, clients.default_address_latitude,
               clients.default_address_longitude, clients.contact_preference, clients.project_budget_preference_min,
               clients.project_budget_preference_max, clients.project_budget_preference_currency,
               clients.project_budget_preference_currency_symbol, clients.project_budget_preference_currency_symbol_position,
               clients.project_budget_preference_currency_symbol_position_position, clients.created_at, clients.updated_at, clients.last_login_at
      ORDER BY clients.first_name ASC
    `;

    const clients = data.map((client) => ({
      ...client,
      total_pending: formatCurrency(client.total_pending),
      total_paid: formatCurrency(client.total_paid),
    }));
    return clients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch client table.');
  }
}

export async function fetchProfessionals() {
  try {
    const db = getSqlClient();
    const professionals = await db<ProfessionalField[]>`
      SELECT
        id,
        business_name,
        business_email,
        business_description
      FROM professionals
      ORDER BY business_name ASC
    `;
    return professionals;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all professionals.');
  }
}

export async function fetchFilteredProfessionals(query: string) {
  try {
    const db = getSqlClient();
    const data = await db<ProfessionalsTableType[]>`
      SELECT
        professionals.id,
        professionals.user_id,
        professionals.business_name,
        professionals.business_email,
        professionals.business_description,
        professionals.image_url,
        professionals.years_of_experience,
        professionals.business_license_number,
        professionals.license_issuing_county,
        professionals.status,
        professionals.verified_at,
        professionals.verified_by,
        professionals.business_address_street,
        professionals.business_address_city,
        professionals.business_address_county,
        professionals.business_address_zip,
        professionals.business_address_country,
        professionals.business_address_latitude,
        professionals.business_address_longitude,
        professionals.service_radius_kilometers,
        professionals.serves_remote,
        professionals.accepts_credit_cards,
        professionals.accepts_cash,
        professionals.accepts_mpesa,
        professionals.accepts_apple_pay,
        professionals.accepts_google_pay,
        professionals.accepts_bank_transfer,
        professionals.average_rating,
        professionals.total_reviews,
        professionals.completed_projects,
        professionals.completed_projects_value,
        professionals.completed_projects_value_currency,
        professionals.completed_projects_value_currency_symbol,
        professionals.completed_projects_value_currency_symbol_position,
        professionals.completed_projects_value_currency_symbol_position_position,
        professionals.subscription_tier,
        professionals.subscription_tier_expiration_date,
        professionals.is_profile_complete,
        professionals.profile_completed_at,
        professionals.created_at,
        professionals.updated_at,
        professionals.last_login_at
      FROM professionals
      WHERE 
        professionals.business_name ILIKE ${`%${query}%`} OR 
        professionals.business_email ILIKE ${`%${query}%`} OR
        professionals.business_description ILIKE ${`%${query}%`}
      ORDER BY professionals.business_name ASC
    `;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch professional table.');
  }
}

export async function fetchProfessionalInvoices() {
  try {
    const db = getSqlClient();
    const professionalInvoices = await db<ProfessionalInvoice[]>`
      SELECT
        professional_invoices.id,
        professional_invoices.professional_id,
        professional_invoices.amount,
        professional_invoices.status,
        professional_invoices.date
      FROM professional_invoices
      ORDER BY professional_invoices.date DESC
    `;
    return professionalInvoices;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch professional invoices.');
  }
}

export async function fetchClientInvoices() {
  try {
    const db = getSqlClient();
    const clientInvoices = await db<ClientInvoice[]>`
      SELECT
        client_invoices.id,
        client_invoices.client_id,
        client_invoices.amount,
        client_invoices.status,
        client_invoices.date
      FROM client_invoices
      ORDER BY client_invoices.date DESC
    `;
    return clientInvoices;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch client invoices.');
  }
}

export async function fetchFilteredClientInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const db = getSqlClient();
    const invoices = await db<ClientInvoice[]>`
      SELECT
        client_invoices.id,
        client_invoices.client_id,
        client_invoices.amount,
        client_invoices.date,
        client_invoices.status
      FROM client_invoices
      JOIN clients ON client_invoices.client_id = clients.id
      WHERE
        clients.first_name ILIKE ${`%${query}%`} OR
        clients.last_name ILIKE ${`%${query}%`} OR
        clients.email ILIKE ${`%${query}%`} OR
        client_invoices.amount::text ILIKE ${`%${query}%`} OR
        client_invoices.date::text ILIKE ${`%${query}%`} OR
        client_invoices.status ILIKE ${`%${query}%`}
      ORDER BY client_invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch client invoices.');
  }
}

export async function fetchFilteredProfessionalInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const db = getSqlClient();
    const invoices = await db<ProfessionalInvoice[]>`
      SELECT
        professional_invoices.id,
        professional_invoices.professional_id,
        professional_invoices.amount,
        professional_invoices.date,
        professional_invoices.status
      FROM professional_invoices
      JOIN professionals ON professional_invoices.professional_id = professionals.id
      WHERE
        professionals.business_name ILIKE ${`%${query}%`} OR
        professionals.business_email ILIKE ${`%${query}%`} OR
        professional_invoices.amount::text ILIKE ${`%${query}%`} OR
        professional_invoices.date::text ILIKE ${`%${query}%`} OR
        professional_invoices.status ILIKE ${`%${query}%`}
      ORDER BY professional_invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch professional invoices.');
  }
}

export async function fetchClientInvoicesPages(query: string) {
  try {
    const db = getSqlClient();
    const data = await db`SELECT COUNT(*)
    FROM client_invoices
    JOIN clients ON client_invoices.client_id = clients.id
    WHERE
      clients.first_name ILIKE ${`%${query}%`} OR
      clients.last_name ILIKE ${`%${query}%`} OR
      clients.email ILIKE ${`%${query}%`} OR
      client_invoices.amount::text ILIKE ${`%${query}%`} OR
      client_invoices.date::text ILIKE ${`%${query}%`} OR
      client_invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of client invoices.');
  }
}

export async function fetchProfessionalInvoicesPages(query: string) {
  try {
    const db = getSqlClient();
    const data = await db`SELECT COUNT(*)
    FROM professional_invoices
    JOIN professionals ON professional_invoices.professional_id = professionals.id
    WHERE
      professionals.business_name ILIKE ${`%${query}%`} OR
      professionals.business_email ILIKE ${`%${query}%`} OR
      professional_invoices.amount::text ILIKE ${`%${query}%`} OR
      professional_invoices.date::text ILIKE ${`%${query}%`} OR
      professional_invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of professional invoices.');
  }
}