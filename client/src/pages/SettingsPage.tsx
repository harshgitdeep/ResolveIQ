import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { InfoCard } from '../components/InfoCard';
import {
  Sliders,
  Shield,
  Bot,
  Bell,
  CheckCircle,
  HelpCircle,
  Save
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'General' | 'Support Policies' | 'AI Agent' | 'Notifications'>('General');

  // Form mock state (visual controls)
  const [workspaceName, setWorkspaceName] = useState('ResolveIQ Demo');
  const [supportEmail, setSupportEmail] = useState('support@example.com');
  const [maxSteps, setMaxSteps] = useState('8');
  const [humanApprovalRefunds, setHumanApprovalRefunds] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState('0.85');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const navSections = [
    { name: 'General', icon: Sliders },
    { name: 'Support Policies', icon: Shield },
    { name: 'AI Agent', icon: Bot },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage platform parameters, support rules, and AI autopilot behaviors."
        actions={
          <Button variant="primary" icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Secondary Navigation */}
        <div className="md:col-span-3 bg-white rounded-lg border border-slate-200/90 p-2 shadow-2xs space-y-1">
          {navSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.name;
            return (
              <button
                key={sec.name}
                onClick={() => setActiveSection(sec.name as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {sec.name}
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-9 space-y-5">
          {activeSection === 'General' && (
            <InfoCard title="General Workspace Settings">
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    This identifier is visible to support team members and automated notifications.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Support Inbound Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Customers receive automated email ticket replies from this designated address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Default Timezone
                  </label>
                  <select
                    defaultValue="UTC-7"
                    className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="UTC-7">Pacific Time (US & Canada) - UTC-07:00</option>
                    <option value="UTC-5">Eastern Time (US & Canada) - UTC-05:00</option>
                    <option value="UTC+0">Coordinated Universal Time - UTC+00:00</option>
                    <option value="UTC+5:30">India Standard Time - UTC+05:30</option>
                  </select>
                </div>
              </div>
            </InfoCard>
          )}

          {activeSection === 'Support Policies' && (
            <InfoCard title="Policy Execution Thresholds">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Human approval required for high-value refunds
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Automatically route refund requests exceeding $200.00 to human managers.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={humanApprovalRefunds}
                      onChange={(e) => setHumanApprovalRefunds(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Automatic escalation on agent failure
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Escalate ticket immediately to human tier if customer sentiment remains negative.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoEscalate}
                      onChange={(e) => setAutoEscalate(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Max Refund Limit for Autonomous Approval
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      defaultValue={250}
                      className="w-full text-sm pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            </InfoCard>
          )}

          {activeSection === 'AI Agent' && (
            <InfoCard title="AI Agent Engine Configuration">
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Maximum Agent Steps (Per Inbound Ticket)
                  </label>
                  <input
                    type="number"
                    value={maxSteps}
                    onChange={(e) => setMaxSteps(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Standard is 8 iterative tool-calling cycles before halting for safety.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Minimum RAG Confidence Threshold
                  </label>
                  <input
                    type="text"
                    value={aiConfidenceThreshold}
                    onChange={(e) => setAiConfidenceThreshold(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Scores below 0.85 prompt the agent to ask clarifying questions rather than assume.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary LLM Engine
                  </label>
                  <select
                    defaultValue="gemini-1.5-pro"
                    className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended for Tool-use)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-low latency)</option>
                  </select>
                </div>
              </div>
            </InfoCard>
          )}

          {activeSection === 'Notifications' && (
            <InfoCard title="Notification Preferences">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Email alerts for escalated tickets
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Receive an instant alert when a ticket requires human agent intervention.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </InfoCard>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500">
            UI Prototype Note: Setting toggles and input values are visual demonstrations and do not affect live backend configs.
          </div>
        </div>
      </div>
    </div>
  );
};
