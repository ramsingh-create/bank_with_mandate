import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {Login} from "./components/pages/Login";
import { BankDetails } from "./components/pages/BankDetails";
import Loader from "./components/pages/Loader";
import { Success } from "./components/pages/Success";
import { PhysicalMandate } from "./components/pages/PhysicalMandate";
import { Mandate } from "./components/pages/Mandate";
import { BankMandateInfo } from "./components/pages/BankMandateInfo";
import { BankMandateSelectOnboarding } from "./components/pages/BankMandateSelectOnboarding";
import { PhysicalMandateUpload } from "./components/pages/PhysicalMandateUpload";
// import Loader from "./components/pages/Loader";


export default function App() {
  const mode = useSelector((state: any) => state.theme.mode);

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <Loader/>
      <Router>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/BankDetails" element={<BankDetails/>} />
            <Route path="/BankMandateInfo" element={<BankMandateInfo/>} />
            <Route path="/BankMandateSelectOnboarding" element={<BankMandateSelectOnboarding/>} />
            <Route path="/Success" element={<Success/>} />
            <Route path="/PhysicalMandate" element={<PhysicalMandate/>} />
            <Route path="/Mandate" element={<Mandate/>} />
            <Route path="/PhysicalMandateUpload" element={<PhysicalMandateUpload/>} />
        </Routes>
      </Router>
    </div>
  );
}
