import React from 'react';
import useLayout from '../Hooks/useLayout';
import MegaGrid from './MegaGrid';
export default function PlaceholderPage({ ResourcePage, ConfiPage, DataPage }) {
  // Set the page title using the layout hook
  useLayout(ResourcePage);

  return (
    <>
    <div className="p-8 bg-white rounded-2xl shadow-sm h-full flex flex-col items-center justify-center text-center">
      <div className="bg-gray-50 p-6 rounded-full mb-4">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{ResourcePage} Page</h1>
      <p className="text-gray-500 max-w-md">
        This module is currently under development. Please check back later for updates.
      </p>
      
    </div>
    <MegaGrid
        GridKey={"Test"}
        columns={DataPage.columns}
        ConfiPage={ConfiPage}
        ResourcePage={ResourcePage}
        routeKey={`edit`}
        ExcelExport={true}
        isSearch={true}
data={[]}

      />
    </>
    
  );
}
