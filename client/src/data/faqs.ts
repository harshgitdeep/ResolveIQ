export interface FAQItem {
  id: string;
  category: 'Orders and Shipping' | 'Returns and Refunds' | 'Damaged or Missing Items' | 'Payments' | 'Account Help';
  question: string;
  answer: string;
}

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Damaged or Missing Items',
    question: 'What should I do if my item arrived broken or damaged?',
    answer: 'Please take clear photos of the damaged item and exterior packaging box, then create a support request under "Damaged Product". Our AI assistant will automatically evaluate your proof against our policy for instant replacement or refund processing.'
  },
  {
    id: 'faq-2',
    category: 'Returns and Refunds',
    question: 'How long do refunds take to appear on my statement?',
    answer: 'Once approved, refunds are credited back to your original payment method within 3 to 5 business days, depending on your card issuer or banking institution.'
  },
  {
    id: 'faq-3',
    category: 'Orders and Shipping',
    question: 'How do I track my delivery status?',
    answer: 'You can check real-time courier tracking on the "My Orders" tab. Select your order to view the carrier waybill, current transit checkpoints, and estimated delivery dates.'
  },
  {
    id: 'faq-4',
    category: 'Returns and Refunds',
    question: 'What is ResolveIQ’s standard return policy window?',
    answer: 'Eligible items can be returned within 30 days of confirmed delivery. Products must include original accessories and retail packaging.'
  },
  {
    id: 'faq-5',
    category: 'Damaged or Missing Items',
    question: 'Do I have to pay return shipping if the product arrived defective?',
    answer: 'No. For transit damage or manufacturing defects reported within 14 days, return shipping is 100% free with pre-paid return labels.'
  },
  {
    id: 'faq-6',
    category: 'Payments',
    question: 'Where can I download my invoice with tax breakdown?',
    answer: 'Invoices are available for download under your Order Details page once payment settlement has cleared.'
  },
  {
    id: 'faq-7',
    category: 'Account Help',
    question: 'How do I update my shipping address for a pending order?',
    answer: 'If your order is still in "Processing" state and hasn’t been dispatched, submit an Order Tracking ticket immediately and our agent can update the destination address.'
  }
];
