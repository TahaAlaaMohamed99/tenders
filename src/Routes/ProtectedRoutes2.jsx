import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
  
import SidebarLogs from "../ConfigData/SidebarLogs.json";

import { DataPages } from "../ConfigData/DataPages";
import DashboardLayout from "../Layouts/DashboardLayout";
import Loading from "../Components/loader";

 


/**
 * CreatedRoutes creates routes for the app
 * @param {array} itempages - array of pages settings
 * @param {object} datePages - object of pages settings
 * @param {string} mainRoute - root route of the app
 * @returns {array} array of routes
 */

const CreatedRoutes = (itempages, datePages) => {
    return itempages.map((page, index) => {
        const pathPage = `${page.keyModule != null ? `${page.keyModule}/` : ''}${page.routePage}`;
        const elementsPage = datePages[page.keyPage]
        if (elementsPage == null) {
            return null
        }
        const ResourcePage = `${page.keyPage}`
        const ComponentViwe = elementsPage?.componentViwe
        const AddEditPage = elementsPage?.componentAddEdit

        return (
            <React.Fragment key={index}>
                <Route path={pathPage}
                    element={
                        <Suspense fallback={<Loading />}>
                            <ComponentViwe ConfiPage={page} DataPage={elementsPage} keyPage={page.keyPage} ResourcePage={ResourcePage} />
                        </Suspense>
                    } />
                <Route
                    path={`${pathPage}/:option/:id`}
                    element={
                        <Suspense fallback={<Loading />}>
                            <AddEditPage ConfiMainPage={page} keyPage={page.keyPage} ResourcePage={ResourcePage} ApiPage={elementsPage.Api} />
                        </Suspense>}
                />
            </React.Fragment>
        )
    })
}
export default function ProtectedRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes >
            
                <Route element={<DashboardLayout />}>
                    {/* <Route path="/" element={<Dashboard />} /> */}
                    {/* Created Routes pages  Main */}
                    {CreatedRoutes(SidebarLogs, DataPages)}
                    <Route index element={<Navigate to="/dashboard" replace />} />

                </Route>
            </Routes>
        </Suspense>
    );
}
