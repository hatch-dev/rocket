"use client";

import { useEffect, useState, useCallback } from "react";

export function AdminDashboard() {

  const [counts, setCounts] = useState({
    employees: 0,
    clients: 0,
    tools: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadCounts = useCallback(async () => {
    try {

      const [empRes, clientRes, toolRes] = await Promise.all([
        fetch("/api/employees", { credentials: "include" }),
        fetch("/api/clients", { credentials: "include" }),
        fetch("/api/tools/list", { credentials: "include" }),
      ]);

      const [empData, clientData, toolData] = await Promise.all([
        empRes.json(),
        clientRes.json(),
        toolRes.json(),
      ]);

      const uniqueToolsCount = Array.isArray(toolData)
        ? new Set(toolData.map((t: any) => t.tool?.title)).size
        : 0;

      setCounts({
        employees: Array.isArray(empData) ? empData.length : 0,
        clients: Array.isArray(clientData) ? clientData.length : 0,
        tools: uniqueToolsCount,
      });

    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  return (
    <div>
      <h1>Welcome to Admin Dashboard</h1>

      <main className="content-admindashboard py-4">
        <div className="container-fluid">
          <div className="row g-3 mb-3">

            <div className="col-lg-4 col-12">
              <div className="card p-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-2">
                <h2 className="fs-6">Total Employees</h2>
                <h3>{loading ? "..." : counts.employees}</h3>
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="card p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-2">
                <h2 className="fs-6">Total Clients</h2>
                <h3>{loading ? "..." : counts.clients}</h3>
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="card p-4 bg-info bg-opacity-10 border border-info border-opacity-25 rounded-2">
                <h2 className="fs-6">Total Tools</h2>
                <h3>{loading ? "..." : counts.tools}</h3>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}