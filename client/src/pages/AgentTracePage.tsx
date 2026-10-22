import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { api } from '../services/api';
import { Ticket, AgentTraceRun } from '../types';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronRight,
  Clock,
  Wrench,
  CheckCircle2,
  Sparkles,
  Inbox,
  Loader2
} from 'lucide-react';

export const AgentTracePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = id || 'TKT-1041';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [traceRun, setTraceRun] = useState<AgentTraceRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadTrace = async () => {
      try {
        setLoading(true);
        const [tickRes, trace] = await Promise.all([
          api.getTicketById(ticketId).catch(() => null),
          api.getAgentTraceForTicket(ticketId).catch(() => null),
        ]);

        if (tickRes) setTicket(tickRes.ticket);
        if (trace) {
          setTraceRun(trace);
          const defaultOpen: Record<string, boolean> = {};
          trace.steps.forEach((s) => {
            defaultOpen[s.id] = true;
          });
          setOpenSteps(defaultOpen);
        }
      } catch (err) {
        console.error('Error loading trace:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTrace();
  }, [ticketId]);

  const toggleStep = (stepId: string) => {
    setOpenSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const getStepBadge = (eventType: string) => {
    switch (eventType) {
      case 'tool_call':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <Wrench className="w-3 h-3" /> Tool Call
          </span>
        );
      case 'tool_result':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="w-3 h-3" /> Tool Result
          </span>
        );
      case 'escalation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20">
            <Sparkles className="w-3 h-3" /> Escalation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20">
            {eventType}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading real database execution trace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to={`/tickets/${ticketId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to ticket #{ticketId}
        </Link>
      </div>

      <PageHeader
        title={`Agent Execution Trace — #${ticketId}`}
        subtitle={
          ticket
            ? `Detailed step-by-step reasoning & tool calls recorded in database for "${ticket.subject}".`
            : `Detailed agent reasoning trace recorded in database.`
        }
        actions={
          <div className="flex items-center gap-2">
            <Link to={`/tickets/${ticketId}`}>
              <Button variant="secondary" size="sm" icon={<Inbox className="w-4 h-4" />}>
                View Ticket
              </Button>
            </Link>
          </div>
        }
      />

      {/* Summary KPI header */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block">Total Steps</span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {traceRun?.totalSteps || 0}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Tool Calls Executed</span>
          <span className="text-base font-bold text-amber-600 font-mono">
            {traceRun?.toolCalls || 0}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Final Status</span>
          <span className="text-base font-semibold text-emerald-700">
            {traceRun?.finalOutcome || 'Completed'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Underlying Model</span>
          <span className="text-base font-semibold text-slate-800">
            {traceRun?.model || 'Gemini 1.5 Pro'}
          </span>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-4">
        {traceRun && traceRun.steps.length > 0 ? (
          traceRun.steps.map((step, idx) => {
            const isOpen = openSteps[step.id];

            return (
              <div
                key={step.id}
                className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <div
                  onClick={() => toggleStep(step.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-semibold text-slate-600">
                      {idx + 1}
                    </span>
                    {getStepBadge(step.eventType)}
                    <span className="text-xs font-medium text-slate-900">
                      {step.toolName ? `Tool: ${step.toolName}` : step.summary}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {step.timestamp}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/40">
                    <p className="text-xs text-slate-600">{step.summary}</p>

                    {step.payload && (
                      <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] overflow-x-auto">
                        <pre>{JSON.stringify(step.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No agent trace entries recorded in the database for ticket #{ticketId}.
          </div>
        )}
      </div>
    </div>
  );
};
