import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  X,
  Sparkles,
  AlertCircle,
  UploadCloud
} from 'lucide-react';

export const CreateSupportRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedOrderId = searchParams.get('orderId') || '';

  const { customerOrders, createTicket } = useCustomer();

  const [category, setCategory] = useState(
    preselectedOrderId ? 'Damaged Product' : 'Order Tracking'
  );
  const [orderId, setOrderId] = useState(preselectedOrderId);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<{
    name: string;
    url: string;
    size: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Order Tracking',
    'Damaged Product',
    'Refund',
    'Return',
    'Payment',
    'Other'
  ];

  const handleSimulateUpload = () => {
    setAttachment({
      name: 'damaged_item_photo_proof.jpg',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      size: '2.4 MB'
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject.trim()) {
      errs.subject = 'Subject is required. Please provide a brief title.';
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Please describe your issue in detail (at least 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newTicket = createTicket({
        category,
        orderId: orderId || undefined,
        subject,
        description,
        attachment: attachment || undefined
      });

      setIsSubmitting(false);
      navigate(`/portal/tickets/${newTicket.id}`);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Support Tickets
        </Link>
        <PageHeader
          title="Create Support Request"
          subtitle="Our autonomous AI support agent will immediately evaluate your request and assist you."
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Issue Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Issue Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold ring-1 ring-blue-600/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Related Order Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Related Order <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">No specific order (General Inquiry)</option>
              {customerOrders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  #{ord.id} — {ord.date} (${ord.amount.toFixed(2)}) • {ord.items[0]?.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting your order enables our AI assistant to instantly look up courier waybills and policy rules.
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
              }}
              placeholder="e.g. Wireless headphones arrived with cracked headband"
              className={`w-full text-sm px-3 py-2 bg-white border rounded-md text-slate-900 focus:outline-none focus:ring-1 ${
                errors.subject
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-blue-600'
              }`}
            />
            {errors.subject && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.subject}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Please provide details about what happened, serial numbers if applicable, and how you would prefer this resolved..."
              className={`w-full text-sm px-3 py-2 bg-white border rounded-md text-slate-900 focus:outline-none focus:ring-1 resize-none ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-blue-600'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Optional Attachment Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Photo / Document Evidence <span className="text-slate-400 font-normal">(Optional)</span>
            </label>

            {attachment ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
                <div className="flex items-center gap-3">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-12 h-12 rounded object-cover border border-blue-300"
                  />
                  <div>
                    <span className="font-semibold block truncate">{attachment.name}</span>
                    <span className="text-[11px] text-blue-600">{attachment.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1 hover:bg-blue-100 rounded text-blue-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-colors"
              >
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-medium text-slate-700 block">
                  Click to attach evidence photo (Simulation)
                </span>
                <span className="text-[11px] text-slate-400">
                  PNG, JPG, or PDF up to 10MB
                </span>
              </div>
            )}
          </div>

          {/* Helpful Information Callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              ResolveIQ AI will review your submission against store policies in seconds. You can track agent decisions and reply directly in the ticket thread.
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link to="/portal/tickets">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Support Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
