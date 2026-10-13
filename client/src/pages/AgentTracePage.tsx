import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { mockTickets } from '../data/tickets';
import { mockAgentTraces } from '../data/agentTraces';
import { Button } from '../components/Button';
import {
  ArrowLeft,
  Bot,
  Terminal,
  ChevronDown,
  ChevronRight,
  Clock,
  Wrench,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Inbox
} from 'lucide-react';

export const AgentTracePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = id || 'TKT-1041';

  const ticket = mockTickets.find((t) => t.id === ticketId) || mockTickets[0];
  const traceRun = mockAgentTraces[ticket.id] || mockAgentTraces['TKT-1041'];

  // State to toggle collapsible JSON blocks
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({
    'trace-1': false,
    'trace-2': true,
    'trace-3': true,
    'trace-4': false,
    'trace-5': true,
    'trace-6': true,
    'trace-7': false,
  });

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
      case 'agent_decision':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20">
            <Sparkles className="w-3 h-3" /> Agent Decision
          </span>
        );
      case 'reply_prepared':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <Bot className="w-3 h-3" /> Reply Prepared
          </span>
        );
      case 'request':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20">
            <Inbox className="w-3 h-3" /> Customer Inbound
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          to={`/tickets/${ticket.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to ticket workspace ({ticket.id})
        </Link>
      </div>

      <PageHeader
        title={`AI Agent Execution Trace — ${ticket.id}`}
        subtitle={`Chronological LLM autonomous reasoning & tool execution pipeline for "${ticket.subject}".`}
        actions={
          <div className="flex items-center gap-2">
            <Link to={`/tickets/${ticket.id}`}>
              <Button variant="secondary" size="sm">
                View Ticket Thread
              </Button>
            </Link>
          </div>
        }
      />

      {/* Compact Run Summary Banner */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Execution Run Summary
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="sm:border-r border-slate-100 sm:pr-3">
            <div className="text-[11px] text-slate-400">Total Steps</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{traceRun.totalSteps}</div>
          </div>
          <div className="sm:border-r border-slate-100 sm:pr-3">
            <div className="text-[11px] text-slate-400">Tool Calls</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{traceRun.toolCalls}</div>
          </div>
          <div className="sm:border-r border-slate-100 sm:pr-3">
            <div className="text-[11px] text-slate-400">Execution Duration</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{traceRun.duration}</div>
          </div>
          <div className="sm:border-r border-slate-100 sm:pr-3 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400">Model Engine</div>
            <div className="text-sm font-semibold font-mono text-slate-800 mt-1 truncate">
              {traceRun.model}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400">Final Outcome</div>
            <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
              {traceRun.finalOutcome}
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-900">Event Execution Pipeline</h2>
          </div>
          <span className="text-xs text-slate-400">Click any step to inspect payload</span>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {traceRun.steps.map((step, idx) => {
            const isOpen = !!openSteps[step.id];

            return (
              <div key={step.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600 z-10 shadow-2xs">
                  {idx + 1}
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3.5 hover:border-slate-300 transition-colors">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {getStepBadge(step.eventType)}
                      {step.toolName && (
                        <span className="font-mono text-xs font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {step.toolName}()
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-900">
                        {step.summary}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.timestamp}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible JSON payload */}
                  {isOpen && step.payload && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                        <span>Payload & Parameters</span>
                        <span>application/json</span>
                      </div>
                      <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
                        {JSON.stringify(step.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
