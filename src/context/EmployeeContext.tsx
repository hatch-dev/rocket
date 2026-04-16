"use client";

import { createContext, useContext } from "react";

export const EmployeeContext = createContext<any>(null);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);

  if (!context) {
    console.log(" EmployeeContext NOT FOUND");
    return {};
  }

  return context;
};