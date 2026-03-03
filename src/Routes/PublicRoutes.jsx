import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "../Components/loader";

const Login = lazy(() => import("../Pages/Login"));

export default function PublicRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes >
        <Route path="/" index element={<Login />} />
         <Route
          path="*"
          element={<Login />}
        />
      </Routes>
    </Suspense>
  );
}
