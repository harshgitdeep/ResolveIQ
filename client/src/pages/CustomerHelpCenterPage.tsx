import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { mockFAQs } from '../data/faqs';
import {
  HelpCircle,
  Plus,
  Package,
  RotateCcw,
  ShieldAlert,
  CreditCard,
  User,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const CustomerHelpCenterPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = [
    'All',
    'Orders and Shipping',
    'Returns and Refunds',
    'Damaged or Missing Items',
    'Payments',
    'Account Help'
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Orders and Shipping':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'Returns and Refunds':
        return <RotateCcw className="w-4 h-4 text-emerald-600" />;
      case 'Damaged or Missing Items':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'Payments':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'Account Help':
        return <User className="w-4 h-4 text-slate-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredFAQs = mockFAQs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ? true : faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" /> ResolveIQ Knowledge Base
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          How can we help you?
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Search frequently asked questions or connect directly with our AI support agent for instant ticket resolution.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto pt-2">
          <SearchInput
            placeholder="Search answers (e.g. damaged, return window, tracking)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 max-w-3xl mx-auto overflow-hidden">
        {filteredFAQs.map((faq) => {
          const isOpen = openFaqId === faq.id;

          return (
            <div key={faq.id} className="p-4 sm:p-5">
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100 shrink-0">
                    {getCategoryIcon(faq.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {faq.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-3 pl-10 pr-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-l-2 border-blue-500 ml-4 py-1">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFAQs.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500">
            No matching answers found for "{search}". You can create a ticket below!
          </div>
        )}
      </div>

      {/* Still need help callout */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 sm:p-6 text-center max-w-3xl mx-auto space-y-3">
        <h3 className="text-base font-bold text-blue-950">
          Still have questions or need assistance with your order?
        </h3>
        <p className="text-xs text-blue-800 max-w-md mx-auto">
          Our autonomous AI assistant can retrieve your order status, approve damage claims, and process instant replacements in seconds.
        </p>
        <div>
          <Link to="/portal/tickets/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create Support Request
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
