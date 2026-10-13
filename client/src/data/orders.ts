import { Order } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-1041',
    customerId: 'CUST-001',
    customerName: 'Aman Sharma',
    customerEmail: 'aman.sharma@example.com',
    date: 'Oct 09, 2026',
    amount: 189.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-101',
        name: 'Wireless Over-Ear Studio Headphones (ANC)',
        variant: 'Midnight Black / High-Res Audio',
        quantity: 1,
        price: 149.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'ITEM-102',
        name: 'Braided Audio Cable & Travel Case',
        variant: 'Carbon / 1.5m',
        quantity: 1,
        price: 40.00,
        image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9823481023',
      carrier: 'FedEx Express',
      status: 'Delivered to front door',
      estimatedDelivery: 'Oct 10, 2026',
      deliveredDate: 'Oct 10, 2026, 2:15 PM'
    },
    payment: {
      method: 'Visa',
      last4: '4242',
      transactionId: 'ch_3Nkd89KLsp0192Aa',
      paidAt: 'Oct 09, 2026, 10:14 AM'
    }
  },
  {
    id: 'ORD-1040',
    customerId: 'CUST-002',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    date: 'Oct 08, 2026',
    amount: 450.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-103',
        name: 'Ultra-Wide Curved Monitor Light Bar',
        variant: 'Matte Black / Wireless Dial',
        quantity: 2,
        price: 225.00,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9811244019',
      carrier: 'UPS Ground',
      status: 'Delivered to reception',
      estimatedDelivery: 'Oct 11, 2026',
      deliveredDate: 'Oct 11, 2026, 11:30 AM'
    },
    payment: {
      method: 'Mastercard',
      last4: '8831',
      transactionId: 'ch_3Nm192KJds9910Bb',
      paidAt: 'Oct 08, 2026, 3:45 PM'
    }
  },
  {
    id: 'ORD-1039',
    customerId: 'CUST-003',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designlab.co',
    date: 'Oct 07, 2026',
    amount: 120.00,
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Cancelled',
    items: [
      {
        id: 'ITEM-104',
        name: 'Minimalist Desk Mat Studio Edition',
        variant: 'Slate Felt / 900x400mm',
        quantity: 2,
        price: 60.00,
        image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9800492100',
      carrier: 'DHL Express',
      status: 'Return received at fulfillment center',
      deliveredDate: 'Oct 09, 2026, 4:00 PM'
    },
    payment: {
      method: 'Apple Pay (Amex)',
      last4: '1004',
      transactionId: 'ch_3Np872OPaa1102Cc',
      paidAt: 'Oct 07, 2026, 9:20 AM'
    }
  },
  {
    id: 'ORD-1038',
    customerId: 'CUST-005',
    customerName: 'Chloe Bennett',
    customerEmail: 'cbennett@cloudflow.net',
    date: 'Oct 07, 2026',
    amount: 89.99,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    items: [
      {
        id: 'ITEM-105',
        name: 'Aluminum Laptop Stand 360 Rotation',
        variant: 'Silver Anodized',
        quantity: 1,
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9799201944',
      carrier: 'USPS Priority',
      status: 'In transit - Out for delivery today',
      estimatedDelivery: 'Oct 13, 2026'
    },
    payment: {
      method: 'Visa',
      last4: '1129',
      transactionId: 'ch_3Nq441ZZqq9930Dd',
      paidAt: 'Oct 07, 2026, 1:12 PM'
    }
  },
  {
    id: 'ORD-1037',
    customerId: 'CUST-007',
    customerName: 'Amara Patel',
    customerEmail: 'amara.patel@horizonhealth.org',
    date: 'Oct 06, 2026',
    amount: 320.00,
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Processing',
    items: [
      {
        id: 'ITEM-106',
        name: 'Wireless Noise-Cancelling Headset',
        variant: 'Midnight Navy',
        quantity: 1,
        price: 320.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-Pending',
      carrier: 'FedEx Home',
      status: 'Awaiting warehouse pick & pack',
      estimatedDelivery: 'Oct 15, 2026'
    },
    payment: {
      method: 'ACH Direct Debit',
      last4: '9012',
      transactionId: 'ch_3Nr981QQll8840Ee',
      paidAt: 'Pending verification'
    }
  },
  {
    id: 'ORD-1036',
    customerId: 'CUST-004',
    customerName: 'David Kim',
    customerEmail: 'david.kim@apexventures.com',
    date: 'Oct 05, 2026',
    amount: 210.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-107',
        name: 'Smart USB-C Multiport Dock 12-in-1',
        variant: 'Titanium Gray',
        quantity: 1,
        price: 210.00,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9781109923',
      carrier: 'Canada Post Xpresspost',
      status: 'Delivered to mailbox',
      deliveredDate: 'Oct 08, 2026, 1:40 PM'
    },
    payment: {
      method: 'Visa',
      last4: '7741',
      transactionId: 'ch_3Ns771MMkk7720Ff',
      paidAt: 'Oct 05, 2026, 11:00 AM'
    }
  },
  {
    id: 'ORD-1035',
    customerId: 'CUST-006',
    customerName: 'Liam Gallagher',
    customerEmail: 'liam.g@soundpulse.co.uk',
    date: 'Oct 04, 2026',
    amount: 540.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-108',
        name: 'Studio Reference Audio Monitors (Pair)',
        variant: 'Walnut Finish / 5-inch',
        quantity: 1,
        price: 540.00,
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9774321098',
      carrier: 'Royal Mail Special Delivery',
      status: 'Delivered and signed by recipient',
      deliveredDate: 'Oct 07, 2026, 9:55 AM'
    },
    payment: {
      method: 'Mastercard',
      last4: '3419',
      transactionId: 'ch_3Nt662LLjj6610Gg',
      paidAt: 'Oct 04, 2026, 4:30 PM'
    }
  },
  {
    id: 'ORD-1034',
    customerId: 'CUST-008',
    customerName: 'Thomas Wright',
    customerEmail: 'twright@synthetica.ai',
    date: 'Oct 03, 2026',
    amount: 75.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-109',
        name: 'Precision Wireless Vertical Mouse',
        variant: 'Charcoal Black',
        quantity: 1,
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9760098711',
      carrier: 'UPS Ground',
      status: 'Delivered to parcel locker',
      deliveredDate: 'Oct 06, 2026, 3:10 PM'
    },
    payment: {
      method: 'Visa',
      last4: '0901',
      transactionId: 'ch_3Nu551KKhh5500Hh',
      paidAt: 'Oct 03, 2026, 8:15 AM'
    }
  },
  {
    id: 'ORD-1033',
    customerId: 'CUST-001',
    customerName: 'Aman Sharma',
    customerEmail: 'aman.sharma@example.com',
    date: 'Sep 21, 2026',
    amount: 230.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-110',
        name: 'Desk Dual-Arm Monitor Mount Heavy Duty',
        variant: 'Matte White',
        quantity: 1,
        price: 230.00,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9751122334',
      carrier: 'FedEx Ground',
      status: 'Delivered',
      deliveredDate: 'Sep 24, 2026, 1:00 PM'
    },
    payment: {
      method: 'Visa',
      last4: '4242',
      transactionId: 'ch_3Nv440JJgg4490Ii',
      paidAt: 'Sep 21, 2026, 2:40 PM'
    }
  },
  {
    id: 'ORD-1032',
    customerId: 'CUST-002',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    date: 'Sep 15, 2026',
    amount: 110.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      {
        id: 'ITEM-111',
        name: 'GaN 140W Fast Travel Charger 4-Port',
        variant: 'Space Gray',
        quantity: 1,
        price: 110.00,
        image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=150&auto=format&fit=crop&q=80'
      }
    ],
    tracking: {
      number: 'TRK-9749988771',
      carrier: 'UPS 2nd Day Air',
      status: 'Delivered',
      deliveredDate: 'Sep 17, 2026, 10:20 AM'
    },
    payment: {
      method: 'Mastercard',
      last4: '8831',
      transactionId: 'ch_3Nw339IIff3380Jj',
      paidAt: 'Sep 15, 2026, 5:12 PM'
    }
  }
];
