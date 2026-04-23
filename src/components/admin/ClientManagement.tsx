"use client";

import { useRouter } from "next/navigation";
import { SearchField } from "@heroui/react";
import Pagination from "@/components/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export type ClientRow = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
};

export function AllClientManagement() {
  const router = useRouter();

  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ [key: number]: number[] }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // handle employee selection
  const handleSelect = (clientId: number, empId: number, checked: boolean) => {
    setSelected((prev) => {
      const existing = prev[clientId] || [];

      const updated = checked
        ? existing.includes(empId)
          ? existing
          : [...existing, empId]
        : existing.filter((id) => id !== empId);

      return { ...prev, [clientId]: updated };
    });
  };

  // load clients
  const load = useCallback(async () => {
    try {
      setError(null);

      const res = await fetch(`${baseUrl}/api/clients`, { credentials: "include" });

      if (!res.ok) {
        setError("Could not load clients.");
        return;
      }

      const data = await res.json();
      setRows(data);

      // initialize selected employees
      const initialSelected: { [key: number]: number[] } = {};

      data.forEach((client: any) => {
        initialSelected[client.id] =
          client.employees?.map((e: any) => e.employeeId) || [];
      });

      setSelected(initialSelected);
    } catch (err) {
      console.log("CLIENT LOAD ERROR:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    load();

    fetch(`${baseUrl}/api/employees/with-employee-id`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          setError("Failed to load employees");
          return;
        }

        setEmployees(data);
      })
      .catch((err) => {
        console.log("EMP FETCH ERROR:", err);
      });
  }, [load]);

  // assign employees
  const assignEmployees = async (clientId: number) => {
    const employeeIds = selected[clientId] || [];

    if (employeeIds.length === 0) {
      await Swal.fire({
        title: "Warning",
        text: "Select at least one employee",
        icon: "warning",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Assign Employees?",
      text: "This will update assigned employees",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`${baseUrl}/api/clients/${clientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ employeeIds }),
    });

    const data = await res.json();

    if (!res.ok) {
      await Swal.fire({
        title: "Error",
        text: "Failed to assign",
        icon: "error",
      });
    } else {
      await Swal.fire({
        title: "Success",
        text: "Employees assigned successfully",
        icon: "success",
      });
    }
  };

  // filter logic (optimized with useMemo)
  const filteredTools = useMemo(() => {
    const searchText = search.toLowerCase();
    return rows.filter((client) =>
      client.name.toLowerCase().includes(searchText)
    );
  }, [rows, search]);

  // pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTools.length / itemsPerPage)
  );

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTools.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTools, currentPage, itemsPerPage]);

  // no match alert (fixed loop issue)
  useEffect(() => {
    if (search.trim() !== "" && filteredTools.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No match found",
        text: "Try different keyword",
      });
    }
  }, [search, filteredTools]);

  return (
    <div className="mb-10">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fs-4 mb-1">Client Management</h2>
        </div>

        <div className="d-flex align-items-center gap-3">
          <SearchField
            name="search"
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              setCurrentPage(1);
            }}
          >
            <label>Search</label>
            <SearchField.Input
              className="w-[280px]"
              placeholder="Search..."
            />
          </SearchField>

          <button
            className="btn btn-primary"
            onClick={() => router.push("/admin/dashboard/add-client")}
          >
            Add Client
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="m-4">
        <p>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
          </select>{" "}
          Records Per Page
        </p>
      </div>

      <div className="card table-responsive">
        <table className="table mb-0 text-nowrap table-hover">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Assign</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.icon ? (
                    <img src={r.icon} width="50" height="50" />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{r.name}</td>

                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      Select Employees
                    </button>

                    <div className="dropdown-menu p-2">
                      {employees.map((emp) => (
                        <label key={emp.id} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={
                              selected[r.id]?.includes(emp.id) || false
                            }
                            onChange={(e) =>
                              handleSelect(r.id, emp.id, e.target.checked)
                            }
                          />
                          {" "}
                          {emp.user.firstname} {emp.user.lastname}
                        </label>
                      ))}

                      <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => assignEmployees(r.id)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </td>

                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() =>
                      router.push(`/admin/dashboard/add-client?id=${r.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={async () => {
                      const confirm = await Swal.fire({
                        title: "Are you sure?",
                        text: "This will delete the client",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                      });

                      if (!confirm.isConfirmed) return;

                      const res = await fetch(`${baseUrl}/api/clients/${r.id}`, {
                        method: "DELETE",
                        credentials: "include",
                      });

                      const data = await res.json();

                      if (!res.ok) {
                        await Swal.fire({
                          title: "Error",
                          text: data.error || "Delete failed",
                          icon: "error",
                        });
                        return;
                      }

                      await Swal.fire({
                        title: "Deleted!",
                        text: "Client deleted successfully",
                        icon: "success",
                      });

                      load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="totalcount">
        <p>
          Total : {filteredTools.length} records / Current Page {currentPage} of{" "}
          {totalPages}
        </p>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}