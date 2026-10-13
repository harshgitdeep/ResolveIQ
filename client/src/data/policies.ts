import { PolicyDocument } from '../types';

export const mockPolicies: PolicyDocument[] = [
  {
    id: 'POL-001',
    title: 'Refund and Return Policy',
    category: 'Returns',
    version: 'v2.4',
    lastUpdated: 'Oct 02, 2026',
    status: 'Active',
    description: 'Standard guidelines for customer returns, timelines, and payment refund processing windows.',
    excerpt: 'Customers may return eligible items within 30 days of receipt. Products must be in pristine condition with original retail packaging.'
  },
  {
    id: 'POL-002',
    title: 'Shipping and Delivery Policy',
    category: 'Shipping',
    version: 'v1.8',
    lastUpdated: 'Sep 18, 2026',
    status: 'Active',
    description: 'Rules for courier transit windows, lost parcel investigations, and expedited delivery SLAs.',
    excerpt: 'Standard shipping takes 3-5 business days. Packages marked as delivered but missing require a 24-hour buffer before filing a carrier trace.'
  },
  {
    id: 'POL-003',
    title: 'Damaged Product Policy',
    category: 'Returns',
    version: 'v2.1',
    lastUpdated: 'Sep 29, 2026',
    status: 'Active',
    description: 'Protocols for handling transit damage, visual photographic proof, and accelerated replacements.',
    excerpt: 'Items damaged in transit are eligible for instant 100% refund or priority cross-shipment upon receipt of photographic evidence.'
  },
  {
    id: 'POL-004',
    title: 'Cancellation Policy',
    category: 'General',
    version: 'v1.3',
    lastUpdated: 'Aug 14, 2026',
    status: 'Active',
    description: 'Rules governing pre-fulfillment order cancellations and warehouse cutoff timelines.',
    excerpt: 'Orders may be cancelled self-serve within 60 minutes of placement, prior to warehouse pick-and-pack queue transition.'
  },
  {
    id: 'POL-005',
    title: 'Warranty Policy',
    category: 'Warranty',
    version: 'v3.0',
    lastUpdated: 'Jul 22, 2026',
    status: 'Active',
    description: 'Hardware coverage details, 2-year manufacturer defects, and accidental wear exemptions.',
    excerpt: 'All electronic peripherals include a 24-month limited warranty covering manufacturing component defects and internal circuitry.'
  },
  {
    id: 'POL-006',
    title: 'Payment and Billing Policy',
    category: 'Payments',
    version: 'v2.0',
    lastUpdated: 'Aug 30, 2026',
    status: 'Active',
    description: 'Invoicing procedures, sales tax deductions, VAT handling, and chargeback protocols.',
    excerpt: 'Invoices with VAT deduction can be downloaded 24 hours after order settlement from the customer portal.'
  }
];
