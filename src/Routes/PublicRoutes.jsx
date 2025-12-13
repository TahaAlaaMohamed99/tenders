import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// import Loader from "../Components/loader";
/*Pages*/
const Tenders = lazy(() => import("../Pages/Tenders"));
 
export default function PublicRoutes() {
  return (
    <Suspense >
      <Routes >
        <Route path="/" index element={<Tenders />} />
         <Route
          path="*"
          element={<Tenders />}
        />
      </Routes>
    </Suspense>
  );
}
