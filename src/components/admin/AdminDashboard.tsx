"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
export function AdminDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [counts, setCounts] = useState({
    employees: 0,
    clients: 0,
    tools: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadCounts = useCallback(async () => {
    try {

      const [empRes, clientRes, toolRes] = await Promise.all([
        fetch(`/rocket/api/employees`, { credentials: "include" }),
        fetch(`/rocket/api/clients`, { credentials: "include" }),
        fetch(`/rocket/api/tools/list`, { credentials: "include" }),
      ]);

      const [empData, clientData, toolData] = await Promise.all([
        empRes.json(),
        clientRes.json(),
        toolRes.json(),
      ]);

      // ===== SORT + TAKE LAST 5 =====
      const latestEmployees = Array.isArray(empData)
        ? [...empData].sort((a, b) => b.id - a.id).slice(0, 5)
        : [];

      const latestClients = Array.isArray(clientData)
        ? [...clientData].sort((a, b) => b.id - a.id).slice(0, 5)
        : [];

      // ===== SET STATE =====
      setEmployees(latestEmployees);
      setClients(latestClients);

      // ===== COUNTS (FULL DATA) =====
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
        <div className="container-fluid mb-6">
          <div className="row g-3 mb-3">

            <div className="col-lg-4 col-12">
              <div className="card p-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-2">
                <h2 className="fs-6">Total Employees</h2>
                <h3 className="d-flex gap-2 icon-count1"> <i className="fa-solid fa-user"></i> <span className="mr-3">{loading ? "..." : counts.employees}</span></h3>
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="card p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-2">
                <h2 className="fs-6">Total Clients</h2>
                <h3 className="d-flex gap-2 icon-count2"><i className="fa-solid fa-user-group"></i><span className="mr-3">{loading ? "..." : counts.clients}</span></h3>
              </div>
            </div>

            <div className="col-lg-4 col-12">
              <div className="card p-4 bg-info bg-opacity-10 border border-info border-opacity-25 rounded-2">
                <h2 className="fs-6">Total Tools</h2>
                <h3 className="d-flex gap-2 icon-count3"><i className="fa-solid fa-wrench"></i><span >{loading ? "..." : counts.tools}</span></h3>
              </div>
            </div>

          </div>
        </div>

        <div className="recent-employees-clients d-flex justify-content-between w-100">

          <div className="recent-employees-container" style={{ width: "48%" }}>
            <div className="title-recent-employees d-flex justify-content-between mb-3">
              <h4>Recent Employees</h4>
              <Link href={"/rocket/admin/dashboard/employees"}>View All<span className="mx-2"><i className="fa-solid fa-angle-right"></i></span></Link>
            </div>

            {employees.map((emp) => (
              <div key={emp.id} className="recent-info">
                <div className="info d-flex mb-2 border border-1 rounded p-2">

                  <div className="image" style={{ width: "15%" }}>
                    <img
                      src={emp.profileImg || `/assets/images/slack-icon.png`}
                      width="50"
                      height="50"
                    />
                  </div>

                  <div className="data d-flex justify-content-between align-items-center" style={{ width: "85%" }}>
                    <div className="name-designation">
                      <h5>{emp.firstname} {emp.lastname}</h5>
                    </div>

                    <div className="arrow">
                      <i className="fa-solid fa-angle-right"></i>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div style={{ width: "1px", background: "#cccccc70" }}></div>

          <div className="recent-clients-container" style={{ width: "48%" }}>
            <div className="title-recent-client d-flex justify-content-between mb-3">
              <h4>Recent Clients</h4>
              <Link href={"/rocket/admin/dashboard/client-management"}>View All<span className="mx-2"><i className="fa-solid fa-angle-right"></i></span></Link>
            </div>

            {clients.map((client) => (
              <div key={client.id} className="recent-info">
                <div className="info d-flex mb-2 border border-1 rounded p-2">

                  <div className="image" style={{ width: "15%" }}>
                    <img
                      src={client.icon || `/assets/images/slack-icon.png`}
                      width="50"
                      height="50"
                    />
                  </div>

                  <div className="data d-flex justify-content-between align-items-center" style={{ width: "85%" }}>
                    <div className="name-designation">
                      <h5>{client.name}</h5>
                    </div>

                    <div className="arrow">
                      <i className="fa-solid fa-angle-right"></i>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}