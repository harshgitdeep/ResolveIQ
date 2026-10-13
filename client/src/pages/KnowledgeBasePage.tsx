import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { mockPolicies } from '../data/policies';
import {
  FileText,
  Plus,
  Info,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Returns', 'Shipping', 'Payments', 'Warranty', 'General'];

  const filteredPolicies = mockPolicies.filter((policy) => {
    const matchesSearch =
      policy.title.toLowerCase().includes(search.toLowerCase()) ||
      policy.description.toLowerCase().includes(search.toLowerCase()) ||
      policy.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ? true : policy.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="Manage the policies ResolveIQ uses to answer customer questions."
        actions={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add Document
          </Button>
        }
      />

      {/* Informational Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-4 flex items-start gap-3">
        <div className="p-1 rounded bg-blue-100 text-blue-700 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-semibold block text-sm mb-0.5">Ground Truth for AI Resolution</span>
          These policy documents are actively embedded and indexed into the ResolveIQ vector store. The AI autopilot cites these official company rules when verifying customer claims, issuing replacements, and approving refunds.
        </div>
      </div>

      {/* Search and Category filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sm:w-72 w-full">
          <SearchInput
            placeholder="Search policies or clauses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Document List Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPolicies.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-600 mt-0.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-md mt-0.5">
                          {doc.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {doc.version}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {doc.lastUpdated}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={doc.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="text-xs text-blue-600 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View Policy
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPolicies.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-slate-500">
                    No policies found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500 flex items-center justify-between">
          <span>{filteredPolicies.length} documents indexed for LLM retrieval</span>
          <span className="font-mono text-[11px] text-slate-400">Embedding model: text-embedding-004</span>
        </div>
      </div>
    </div>
  );
};
