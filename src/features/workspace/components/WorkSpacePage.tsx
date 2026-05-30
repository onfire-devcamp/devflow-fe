import React from 'react';
import { Header } from '../../../components/ui/Header';
import { CentralPanel } from './CentralPanel';
import { RightPanel } from './RightPanel';

export default function WorkspacePage() {
  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden font-sans antialiased">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <CentralPanel />
        <RightPanel />
      </div>
    </div>
  );
}
