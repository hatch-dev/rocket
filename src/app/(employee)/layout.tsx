"use client";

import { ReactNode, useEffect, useState } from "react";
import { RocketHeader } from "@/components/rocket/Header";
import { RocketSidebar } from "@/components/rocket/Sidebar";
import { EmployeeContext } from "@/context/EmployeeContext";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  
  // ================= STATE =================
  const [employee, setEmployee] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [activeClient, setActiveClient] = useState<any>(null);

  // ================= FETCH EMPLOYEE + CLIENTS =================
useEffect(() => {
  fetch("/api/employees/me", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      console.log("EMP DATA:", data);

      setEmployee(data.employee);
      setClients(data.clients);

      if (data.clients?.length > 0) {
        setActiveClient(data.clients[0].id);
      }
    })
    .catch(err => console.log("ERROR:", err));
}, []);

  return (
    <>
      <link rel="stylesheet" href="/assets/css/style.css" />

      <EmployeeContext.Provider
        value={{
          employee,
          clients,
          activeClient,
          setActiveClient
        }}
      >

        <RocketHeader employee={employee} />

        <div className="wrapper">

          <RocketSidebar
            clients={clients}
            employee={employee}
            activeClient={activeClient}
            setActiveClient={setActiveClient}
          />

          <div className="content-employee">
            {children}
          </div>

        </div>

      </EmployeeContext.Provider>
    </>
  );
}