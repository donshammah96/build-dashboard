import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getSqlClient } from '../lib/db';
import { 
  invoices, 
  customers, 
  revenue, 
  users, 
  professionals, 
  clients, 
  professional_certifications, 
  professional_specialties, 
  professional_services, 
  licence_verification_logs,
  client_invoices,
  professional_invoices
} from '../lib/placeholder-data';

async function seedUsers() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS users`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL CHECK (role IN ('admin', 'client', 'professional')),
      phone VARCHAR(50),
      avatar_url VARCHAR(500),
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP,
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, first_name, last_name, email, password, role, phone, avatar_url, is_verified, is_active, created_at, updated_at, last_login_at)
        VALUES (${user.id}, ${user.first_name}, ${user.last_name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.phone}, ${user.avatar_url}, ${user.is_verified}, ${user.is_active}, ${user.created_at}, ${user.updated_at}, ${user.last_login_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedProfessionals() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS professionals`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS professionals (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_name VARCHAR(255) NOT NULL,
      business_email VARCHAR(255) NOT NULL,
      business_description TEXT NOT NULL,
      image_url VARCHAR(500),
      years_of_experience INT NOT NULL,
      business_license_number VARCHAR(255) NOT NULL,
      license_issuing_county VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL CHECK (status IN ('pending', 'verified')),
      verified_at TIMESTAMP,
      verified_by UUID REFERENCES users(id) ON DELETE CASCADE,
      business_address_street VARCHAR(255) NOT NULL,
      business_address_city VARCHAR(255) NOT NULL,
      business_address_county VARCHAR(255) NOT NULL,
      business_address_zip VARCHAR(255) NOT NULL,
      business_address_country VARCHAR(255) NOT NULL,
      business_address_latitude DECIMAL(10, 8) NOT NULL,
      business_address_longitude DECIMAL(11, 8) NOT NULL,
      service_radius_kilometers INT DEFAULT 50,
      serves_remote BOOLEAN NOT NULL DEFAULT FALSE,
      accepts_credit_cards BOOLEAN NOT NULL DEFAULT FALSE,
      accepts_cash BOOLEAN NOT NULL DEFAULT FALSE,
      accepts_mpesa BOOLEAN NOT NULL DEFAULT FALSE,
      accepts_apple_pay BOOLEAN NOT NULL DEFAULT FALSE,
      accepts_google_pay BOOLEAN NOT NULL DEFAULT FALSE,
      accepts_bank_transfer BOOLEAN NOT NULL DEFAULT FALSE,
      average_rating DECIMAL(3, 2) DEFAULT 0,
      total_reviews INT DEFAULT 0,
      completed_projects INT DEFAULT 0,
      completed_projects_value INT DEFAULT 0,
      completed_projects_value_currency VARCHAR(3) NOT NULL DEFAULT 'KSH',
      completed_projects_value_currency_symbol VARCHAR(3) NOT NULL DEFAULT 'KSH',
      completed_projects_value_currency_symbol_position VARCHAR(3) NOT NULL DEFAULT 'left',
      subscription_tier VARCHAR(255) NOT NULL DEFAULT 'free',
      subscription_tier_expiration_date TIMESTAMP,
      is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
      profile_completed_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP,
    );
    CREATE INDEX IF NOT EXISTS idx_professionals_geo ON professionals USING GIST (
      point(business_address_longitude, business_address_latitude)
    );
    CREATE INDEX IF NOT EXISTS idx_professionals_status ON professionals(status);
  `;  

  const insertedProfessionals = await Promise.all(
    professionals.map(async (professional) => {
      return sql`
        INSERT INTO professionals (id, user_id, business_name, business_email, business_description, image_url, years_of_experience, business_license_number, license_issuing_county, status, verified_at, verified_by, business_address_street, business_address_city, business_address_county, business_address_zip, business_address_country, business_address_latitude, business_address_longitude, service_radius_kilometers, serves_remote, accepts_credit_cards, accepts_cash, accepts_mpesa, accepts_apple_pay, accepts_google_pay, accepts_bank_transfer, average_rating, total_reviews, completed_projects, completed_projects_value, completed_projects_value_currency, completed_projects_value_currency_symbol, completed_projects_value_currency_symbol_position, subscription_tier, subscription_tier_expiration_date, is_profile_complete, profile_completed_at, created_at, updated_at, last_login_at)
        VALUES (${professional.id}, ${professional.user_id}, ${professional.business_name}, ${professional.business_email}, ${professional.business_description}, ${professional.avatar_url}, ${professional.years_of_experience}, ${professional.business_license_number}, ${professional.license_issuing_county}, ${professional.status}, ${professional.verified_at}, ${professional.verified_by}, ${professional.business_address_street}, ${professional.business_address_city}, ${professional.business_address_county}, ${professional.business_address_zip}, ${professional.business_address_country}, ${professional.business_address_latitude}, ${professional.business_address_longitude}, ${professional.service_radius_kilometers}, ${professional.serves_remote}, ${professional.accepts_credit_cards}, ${professional.accepts_cash}, ${professional.accepts_mpesa}, ${professional.accepts_apple_pay}, ${professional.accepts_google_pay}, ${professional.accepts_bank_transfer}, ${professional.average_rating}, ${professional.total_reviews}, ${professional.completed_projects}, ${professional.completed_projects_value}, ${professional.completed_projects_value_currency}, ${professional.completed_projects_value_currency_symbol}, ${professional.completed_projects_value_currency_symbol_position}, ${professional.subscription_tier}, ${professional.subscription_tier_expiration_date}, ${professional.is_profile_complete}, ${professional.profile_completed_at}, ${professional.created_at}, ${professional.updated_at}, ${professional.last_login_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedProfessionals;
}

async function seedProfessionalCertifications() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS professional_certifications`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS professional_certifications (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
      certification_name VARCHAR(255) NOT NULL,
      certification_number VARCHAR(255) NOT NULL,
      issuing_authority VARCHAR(255) NOT NULL,
      certification_expiration_date TIMESTAMP,
      certificate_image_url VARCHAR(500),
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    );
  `;

  const insertedProfessionalCertifications = await Promise.all(
    professional_certifications.map(async (professional_certification) => {
        return sql`
        INSERT INTO professional_certifications (id, professional_id, certification_name, certification_number, certification_expiration_date, created_at, updated_at)
        VALUES (${professional_certification.id}, ${professional_certification.professional_id}, ${professional_certification.certification_name}, ${professional_certification.certification_number}, ${professional_certification.certification_expiration_date}, ${professional_certification.created_at}, ${professional_certification.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedProfessionalCertifications;
}

async function seedProfessionalSpecialties() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS professional_specialties`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS professional_specialties (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
      specialty_type VARCHAR(255) NOT NULL CHECK (specialty_type IN ('hardware', 'commercial', 'residential', 'industrial', 'kitchen remodeling', 'construction', 'engineering', 'design', 'architecture', 'planning', 'consulting', 'electrical', 'plumbing', 'painting', 'flooring', 'roofing', 'other')),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    );
  `;

  const insertedProfessionalSpecialties = await Promise.all(
    professional_specialties.map(async (professional_specialty) => {
      return sql`
        INSERT INTO professional_specialties (id, professional_id, specialty_type, created_at, updated_at)
        VALUES (${professional_specialty.id}, ${professional_specialty.professional_id}, ${professional_specialty.specialty_type}, ${professional_specialty.created_at}, ${professional_specialty.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedProfessionalSpecialties;
}

async function seedProfessionalServices() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS professional_services`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS professional_services (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
      service_name VARCHAR(255) NOT NULL,
      service_description TEXT NOT NULL,
      hourly_rate INT NOT NULL,
      fixed_price_range_min DECIMAL (10, 2) NOT NULL,
      fixed_price_range_max DECIMAL (10, 2) NOT NULL,
      fixed_price_range_currency VARCHAR(3) NOT NULL DEFAULT 'KSH',
      fixed_price_range_currency_symbol VARCHAR(3) NOT NULL DEFAULT 'KSH',
      fixed_price_range_currency_symbol_position VARCHAR(3) NOT NULL DEFAULT 'left',
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    );
  `;

  const insertedProfessionalServices = await Promise.all(
    professional_services.map(async (professional_service) => {
      return sql`
        INSERT INTO professional_services (id, professional_id, service_name, service_description, hourly_rate, fixed_price_range_min, fixed_price_range_max, fixed_price_range_currency, fixed_price_range_currency_symbol, fixed_price_range_currency_symbol_position, is_available, is_active, created_at, updated_at)
        VALUES (${professional_service.id}, ${professional_service.professional_id}, ${professional_service.service_name}, ${professional_service.service_description}, ${professional_service.hourly_rate}, ${professional_service.fixed_price_range_min}, ${professional_service.fixed_price_range_max}, ${professional_service.fixed_price_range_currency}, ${professional_service.fixed_price_range_currency_symbol}, ${professional_service.fixed_price_range_currency_symbol_position}, ${professional_service.is_available}, ${professional_service.is_active}, ${professional_service.created_at}, ${professional_service.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedProfessionalServices;
} 

async function seedLicenceVerificationLogs() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS licence_verification_logs`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS licence_verification_logs (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
      admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      verification_status VARCHAR(255) NOT NULL CHECK (verification_status IN ('pending', 'verified')),
      previous_verification_status VARCHAR(255) NOT NULL CHECK (previous_verification_status IN ('pending', 'verified')),
      previous_verification_status_notes TEXT NOT NULL,
      new_verification_status VARCHAR(255) NOT NULL CHECK (new_verification_status IN ('pending', 'verified')),
      new_verification_status_notes TEXT NOT NULL,
      license_number VARCHAR(255) NOT NULL,
      license_issuing_county VARCHAR(255) NOT NULL,
      license_issuing_country VARCHAR(255) NOT NULL,
      license_issuing_date TIMESTAMP NOT NULL,
      license_issuing_expiration_date TIMESTAMP NOT NULL,
      verification_documents_urls TEXT[] NOT NULL,
      verification_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    );
  `;

  const insertedLicenceVerificationLogs = await Promise.all(
    licence_verification_logs.map(async (licence_verification_log) => {
      return sql`
        INSERT INTO licence_verification_logs (id, professional_id, admin_id, verification_status, previous_verification_status, previous_verification_status_notes, new_verification_status, new_verification_status_notes, license_number, license_issuing_county, license_issuing_country, license_issuing_date, license_issuing_expiration_date, verification_documents_urls, verification_date, created_at, updated_at)
        VALUES (${licence_verification_log.id}, ${licence_verification_log.professional_id}, ${licence_verification_log.admin_id}, ${licence_verification_log.verification_status}, ${licence_verification_log.previous_verification_status}, ${licence_verification_log.previous_verification_status_notes}, ${licence_verification_log.new_verification_status}, ${licence_verification_log.new_verification_status_notes}, ${licence_verification_log.license_number}, ${licence_verification_log.license_issuing_county}, ${licence_verification_log.license_issuing_country}, ${licence_verification_log.license_issuing_date}, ${licence_verification_log.license_issuing_expiration_date}, ${licence_verification_log.verification_documents_urls}, ${licence_verification_log.verification_date}, ${licence_verification_log.created_at}, ${licence_verification_log.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedLicenceVerificationLogs;
}

async function seedClients() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS clients`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(500),
      default_address_street VARCHAR(255) NOT NULL,
      default_address_city VARCHAR(255) NOT NULL,
      default_address_county VARCHAR(255) NOT NULL,
      default_address_zip VARCHAR(255) NOT NULL,
      default_address_country VARCHAR(255) DEFAULT 'Kenya',
      default_address_latitude DECIMAL(10, 8) DEFAULT 0,
      default_address_longitude DECIMAL(11, 8) DEFAULT 0,
      contact_preference VARCHAR(20) DEFAULT 'any' CHECK (contact_preference IN ('email', 'phone', 'any')),
      project_budget_preference_min DECIMAL(10, 2) DEFAULT 0,
      project_budget_preference_max DECIMAL(10, 2) DEFAULT 0,
      project_budget_preference_currency VARCHAR(3) DEFAULT 'KSH',
      project_budget_preference_currency_symbol VARCHAR(3) DEFAULT 'KSH',
      project_budget_preference_currency_symbol_position VARCHAR(3) DEFAULT 'left',
      total_invoices INT DEFAULT 0,
      total_pending INT DEFAULT 0,
      total_paid INT DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP,
    );
  `;

  const insertedClients = await Promise.all(
    clients.map(async (client) => {
      // Get user data for the client
      const user = users.find(u => u.id === client.user_id);
      const firstName = user?.first_name || 'Unknown';
      const lastName = user?.last_name || 'Client';
      const email = user?.email || 'unknown@example.com';
      const imageUrl = user?.avatar_url || '/customers/default-avatar.png';
      
      return sql`
        INSERT INTO clients (id, user_id, first_name, last_name, email, image_url, default_address_street, default_address_city, default_address_county, default_address_zip, default_address_country, default_address_latitude, default_address_longitude, contact_preference, project_budget_preference_min, project_budget_preference_max, project_budget_preference_currency, project_budget_preference_currency_symbol, project_budget_preference_currency_symbol_position, total_invoices, total_pending, total_paid, created_at, updated_at, last_login_at)
        VALUES (${client.id}, ${client.user_id}, ${firstName}, ${lastName}, ${email}, ${imageUrl}, ${client.default_address_street}, ${client.default_address_city}, ${client.default_address_county}, ${client.default_address_zip}, ${client.default_address_country}, ${client.default_address_latitude}, ${client.default_address_longitude}, ${client.contact_preference}, ${client.project_budget_preference_min}, ${client.project_budget_preference_max}, ${client.project_budget_preference_currency}, ${client.project_budget_preference_currency_symbol}, ${client.project_budget_preference_currency_symbol_position}, 0, 0, 0, ${client.created_at}, ${client.updated_at}, ${client.last_login_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
  return insertedClients;
}

async function seedInvoices() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS invoices`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date});
      `,
    ),
  );

  return insertedInvoices;
}

async function seedClientInvoices() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS client_invoices`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS client_invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedClientInvoices = await Promise.all(
    client_invoices.map(
      (client_invoice) => sql`
        INSERT INTO client_invoices (id, client_id, amount, status, date)
        VALUES (${client_invoice.id}, ${client_invoice.client_id}, ${client_invoice.amount}, ${client_invoice.status}, ${client_invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedClientInvoices;
}

async function seedProfessionalInvoices() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS professional_invoices`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS professional_invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedProfessionalInvoices = await Promise.all(
    professional_invoices.map(
      (professional_invoice) => sql`
        INSERT INTO professional_invoices (id, professional_id, amount, status, date)
        VALUES (${professional_invoice.id}, ${professional_invoice.professional_id}, ${professional_invoice.amount}, ${professional_invoice.status}, ${professional_invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedProfessionalInvoices;
}

async function seedCustomers() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS customers`;
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  const sql = getSqlClient();
  await sql`DROP TABLE IF EXISTS revenue`;
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    console.log('Starting database seeding...');
    
    await seedUsers();
    console.log('✓ Users seeded');
    
    await seedCustomers();
    console.log('✓ Customers seeded');
    
    await seedInvoices();
    console.log('✓ Invoices seeded');
    
    await seedRevenue();
    console.log('✓ Revenue seeded');
    
    await seedProfessionals();
    console.log('✓ Professionals seeded');
    
    await seedProfessionalCertifications();
    console.log('✓ Professional certifications seeded');
    
    await seedProfessionalSpecialties();
    console.log('✓ Professional specialties seeded');
    
    await seedProfessionalServices();
    console.log('✓ Professional services seeded');
    
    await seedClients();
    console.log('✓ Clients seeded');
    
    await seedClientInvoices();
    console.log('✓ Client invoices seeded');
    
    await seedLicenceVerificationLogs();
    console.log('✓ License verification logs seeded');
    
    await seedProfessionalInvoices();
    console.log('✓ Professional invoices seeded');

    console.log('Database seeding completed successfully!');
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Database seeding failed:', error);
    return NextResponse.json({ error: 'Database seeding failed', details: String(error) }, { status: 500 });
  }
}