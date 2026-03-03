import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
  
import SidebarLogs from "../ConfigData/SidebarLogs.json";

import { DataPages } from "../ConfigData/DataPages";
import DashboardLayout from "../Layouts/DashboardLayout";
import Loading from "../Components/loader";

/**
 * Route Factory: Generates routes based on configuration
 * 
 * @param {Array} sidebarLogs - List of all pages/modules from SidebarLogs.json
 * @param {Object} dataPages - Detailed configuration for each page (Components, API, Schemas)
 * @returns {Array<React.ReactNode>} Array of <Route> components for the Router
 */
const RouteFactory = (sidebarLogs, dataPages) => {
    return sidebarLogs.map((page, index) => {
        const pathPage = `${page.keyModule != null ? `${page.keyModule}/` : ''}${page.routePage}`;
        const elementsPage = dataPages[page.keyPage];
        
        if (!elementsPage) return null;

        const ResourcePage = `${page.keyPage}`;
        const ComponentView = elementsPage?.componentViwe || React.Fragment;
        const AddEditPage = elementsPage?.componentAddEdit || React.Fragment;

        return (
            <React.Fragment key={index}>
                <Route 
                    path={pathPage}
                    element={
                        <Suspense fallback={<Loading />}>
                            <ComponentView ConfiPage={page} DataPage={elementsPage} keyPage={page.keyPage} ResourcePage={ResourcePage} />
                        </Suspense>
                    } 
                />
                <Route
                    path={`${pathPage}/:option/:id`}
                    element={
                        <Suspense fallback={<Loading />}>
                            <AddEditPage ConfiMainPage={page} DataPage={elementsPage} keyPage={page.keyPage} ResourcePage={ResourcePage} ApiPage={elementsPage.Api} />
                        </Suspense>
                    }
                />
            </React.Fragment>
        );
    });
};

/**
 * DynamicRouter Component
 * 
 * The main route generator for the authenticated application.
 * It reads the `SidebarLogs` and `DataPages` configuration to automatically
 * build the React Router DOM <Routes> tree.
 * 
 * Usage:
 * Used directly in App.jsx — rendered when userToken exists in localStorage.
 * 
 * @returns {JSX.Element} The <Routes> component populated with dynamic pages.
 */
export default function DynamicRouter() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route element={<DashboardLayout />}>
                    {/* Dynamically Generated Routes */}
                    {RouteFactory(SidebarLogs, DataPages)}
                    
                    {/* Default Redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
