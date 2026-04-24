"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchField } from "@heroui/react";
import Pagination from "@/components/pagination";

export type EmployeeRow = {
  id: number;
  firstname: string;
  lastname: string;
  profileImg: string;
  dob: string;
  country: string;
  address: string;
  gender: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export function AllEmployeeManagement() {
  const router = useRouter();

  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // load employees
  const load = useCallback(async () => {
    try {
      setError(null);

      const res = await fetch(`/rocket/api/employees`, {
        credentials: "include",
      });

      if (!res.ok) {
        setError("Could not load employees.");
        return;
      }

      const data = (await res.json()) as EmployeeRow[];
      setRows(data);
    } catch (err) {
      console.log("EMP LOAD ERROR:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // delete employee
  const handleDelete = useCallback(
    async (id: number) => {
      const result = await Swal.fire({
        title: "Delete employee?",
        text: "This cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      const res = await fetch(`/rocket/api/employees/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        setError("Delete failed.");
        return;
      }

      await Swal.fire({
        title: "Deleted",
        text: "Employee removed successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      load();
    },
    [load]
  );

  // filter logic (FIXED + optimized)
  const filteredTools = useMemo(() => {
    const searchText = search.toLowerCase();

    return rows.filter((emp) => {
      const fullName = `${emp.firstname} ${emp.lastname}`.toLowerCase();

      return (
        fullName.includes(searchText) ||
        emp.email.toLowerCase().includes(searchText) ||
        emp.phone.toLowerCase().includes(searchText)
      );
    });
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

  return (
    <div className="mb-10">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fs-4 mb-1">Employees</h2>
          <p className="text-secondary mb-0 small">
            Add, edit, or remove employee accounts (employee role only).
          </p>
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
            type="button"
            className="btn btn-primary"
            onClick={() => {
              router.push("/rocket/admin/dashboard/add-employee");
            }}
          >
            Add employee
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>{" "}
          Records Per Page
        </p>
      </div>

      <div className="card table-responsive">
        <table className="table mb-0 text-nowrap table-hover">
          <thead className="table-light border-light">
            <tr>
              <th>Profile Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>D-O-B</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Country</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-secondary">
                  Loading…
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-secondary">
                  No employees found.
                </td>
              </tr>
            ) : (
              currentData.map((r) => (
                <tr key={r.id} className="align-middle">
                  <td>
                    {r.profileImg ? (
                      <img src={r.profileImg} width="50" height="50" />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>
                    {r.firstname} {r.lastname}
                  </td>

                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>
                    {r.dob
                      ? new Date(r.dob).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{r.gender}</td>
                  <td>{r.address}</td>
                  <td>{r.country}</td>

                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => {
                        router.push(
                          `/rocket/admin/dashboard/add-employee?id=${r.id}`
                        );
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        handleDelete(r.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
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