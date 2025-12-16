import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// import Loader from "../Components/loader";
/*Pages*/
const Currencies = lazy( () => import( "../Pages/Currencies" ) );
const CurrencyAddEdit = lazy( () => import( "../Pages/CurrencyAddEdit" ) );
const Vendors = lazy( () => import( "../Pages/Vendors" ) );
const VendorsAddEdit = lazy( () => import( "../Pages/VendorsAddEdit" ) );
const VendorGroups = lazy( () => import( "../Pages/vendorGroups" ) );
const VendorGroupsAddEdit = lazy( () => import( "../Pages/VendorGroupsAddEdit" ) );
const Login = lazy( () => import( "../Pages/Login" ) );

 
export default function PublicRoutes() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" index element={ <Currencies /> } />
        <Route path="/currencies" element={ <Currencies /> } />
        <Route path="/currencies/:id" element={ <CurrencyAddEdit /> } />
        <Route path="/vendors" element={ <Vendors /> } />
        <Route path="/vendors/:id" element={ <VendorsAddEdit /> } />
        <Route path="/vendor-groups" element={ <VendorGroups /> } />
        <Route path="/vendor-groups/:id" element={ <VendorGroupsAddEdit /> } />
      </Routes>
    </Suspense>
  );
}
