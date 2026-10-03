/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardKPIs } from './components/DashboardKPIs';
import { ResourceCatalog } from './components/ResourceCatalog';
import { TransferPipeline } from './components/TransferPipeline';
import { NeededResourcesBoard } from './components/NeededResourcesBoard';
import { CampusImpactView } from './components/CampusImpactView';
import { AdminAuditView } from './components/AdminAuditView';
import { ToastContainer } from './components/ToastContainer';
import { ItemDetailModal } from './components/ItemDetailModal';
import { RequestModal } from './components/RequestModal';
import { ListItemModal } from './components/ListItemModal';
import { PostNeedModal } from './components/PostNeedModal';
import { GatePassModal } from './components/GatePassModal';
import { ArrowRightLeft, Leaf, Shield, HeartHandshake } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Institutional Top Navigation & Role Switcher */}
      <Header />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* KPI Summary Banner (Shown on Catalog, Pipeline & Analytics) */}
        {(activeTab === 'catalog' || activeTab === 'pipeline') && (
          <DashboardKPIs />
        )}

        {/* Dynamic Workspace Views */}
        {activeTab === 'catalog' && <ResourceCatalog />}
        {activeTab === 'pipeline' && <TransferPipeline />}
        {activeTab === 'wishlist' && <NeededResourcesBoard />}
        {activeTab === 'analytics' && <CampusImpactView />}
        {activeTab === 'admin' && <AdminAuditView />}
      </main>

      {/* Interactive Global Modals */}
      <ItemDetailModal />
      <RequestModal />
      <ListItemModal />
      <PostNeedModal />
      <GatePassModal />

      {/* Toasts */}
      <ToastContainer />

      {/* Institutional Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">UniShare • Campus Resource Exchange Platform</p>
              <p className="text-[11px] text-slate-400">
                Authorized university equipment transfer, surplus management, and circular sustainability system.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
            <a 
              href="/UniShare-SourceCode.zip" 
              download="UniShare-SourceCode.zip"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              📦 Download Source ZIP
            </a>
            <span>•</span>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Sustainability Metrics
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('pipeline')} className="hover:text-emerald-700 transition-colors">
              Transfer Pipeline
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Compliance & Audit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
