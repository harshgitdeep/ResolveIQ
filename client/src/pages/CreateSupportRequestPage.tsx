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
  UploadCloud,
  Loader2
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const newTicket = await createTicket({
        category,
        orderId: orderId || undefined,
        subject: subject.trim(),
        description: description.trim(),
        attachment: attachment || undefined
      });

      navigate(`/portal/tickets/${newTicket.id}`);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setErrors({ form: 'An error occurred while creating your ticket in database.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back button */}
      <div>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cancel & return to My Tickets
        </Link>
      </div>

      <PageHeader
        title="Create Support Request"
        subtitle="Submit your issue for instant automated policy verification and fast resolution."
      />

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs">
        {errors.form && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {errors.form}
          </div>
        )}

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Issue Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all ${
                  category === cat
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Linked Order Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Related Order (Optional)
          </label>
          <select
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
          >
            <option value="">No order related / General inquiry</option>
            {customerOrders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id} — ₹{o.amount.toLocaleString()} ({o.items[0]?.name || 'Item'})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">
            Linking your order allows our AI engine to fetch your delivery status and policy instantly.
          </p>
        </div>

        {/* Subject line */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">
            Subject Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Wireless headphones ear cup damaged on arrival"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full text-xs rounded-lg border p-2.5 outline-hidden ${
              errors.subject
                ? 'border-red-300 focus:ring-1 focus:ring-red-500'
                : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.subject && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.subject}
            </p>
          )}
        </div>

        {/* Detailed description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Please share specifics about what happened, including tracking issues, damage details, or what resolution you are requesting..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full text-xs rounded-lg border p-3 outline-hidden ${
              errors.description
                ? 'border-red-300 focus:ring-1 focus:ring-red-500'
                : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </p>
          )}
        </div>

        {/* Photo Attachment Evidence */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Proof & Documentation (Optional)
          </label>
          {attachment ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={attachment.url}
                  alt="Upload preview"
                  className="w-10 h-10 rounded object-cover border"
                />
                <div>
                  <span className="text-xs font-medium text-slate-800 block truncate max-w-xs">
                    {attachment.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{attachment.size}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-medium text-slate-700 block">
                Click to attach photo or receipt
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Supports PNG, JPG, or PDF up to 10MB
              </span>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link to="/portal/tickets">
            <Button variant="secondary" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          >
            {isSubmitting ? 'Saving to Database...' : 'Submit Support Request'}
          </Button>
        </div>
      </form>
    </div>
  );
};
