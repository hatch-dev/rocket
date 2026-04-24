"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchField } from '@heroui/react';
import Pagination from "@/components/pagination";
import Swal from "sweetalert2";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
type ToolData = {
  client: {
    id: number;
    name: string;
  };
  tool: {
    title: string;
    links: {
      title: string;
      url: string;
      icon: string;
    }[];
  };
};

export function ToolManagement() {
  const router = useRouter();
  const [data, setData] = useState<ToolData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/tools/list`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.log("Error loading tools:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Group tools by title
  const groupedTools = Object.values(
    data.reduce((acc: any, item) => {
      const title = item.tool.title;
      if (!acc[title]) {
        acc[title] = {
          title: title,
          links: item.tool.links,
          clients: [],
        };
      }
      acc[title].clients.push({
        id: item.client.id,
        name: item.client.name,
      });
      return acc;
    }, {})
  );
  // Filter logic
  const filteredTools = groupedTools.filter((tool: any) => {
    const searchText = search.toLowerCase();
    const matchTitle = tool.title.toLowerCase().includes(searchText);
    const matchLinks = tool.links.some((link: any) =>
      link.title.toLowerCase().includes(searchText)
    );
    return matchTitle || matchLinks;
  });

  //  total pages
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);

  // Get current page data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredTools.slice(startIndex, startIndex + itemsPerPage);

  // For edit button
  const handleEdit = (tool: any) => {
    localStorage.setItem("editTool", JSON.stringify(tool));
    router.push("/rocket/admin/dashboard/add-tool");
  };

  // if no match found 
  useEffect(() => {
    if (search && filteredTools.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No match found",
        text: "Try different keyword",
      });
    }
  }, [search]);

  // for delete button 
  const handleDelete = async (title: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this tool",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${baseUrl}/api/tools/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (!res.ok) {
        Swal.fire("Error", "Delete failed", "error");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        Swal.fire("Error", "Delete failed", "error");
        return;
      }
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: "Deleted successfully",
        showConfirmButton: false,
        timer: 2000
      });
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-10">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fs-4 mb-1">Tool Management</h2>
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
          <button type="button" className="btn btn-primary" onClick={() => { router.push("/rocket/admin/dashboard/add-tool"); }} >
            Add Tool
          </button></div>

      </div>
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
          </select>
          Records Per Page
        </p>
      </div>
      <div className="card">
        <table className="table mb-0 text-nowrap table-hover">
          <thead className="table-light border-light">
            <tr>
              <th>Tool Title</th>
              <th>Tool Links</th>
              <th>Assigned Clients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((tool: any, index) => (

              <tr key={index}>
                <td>{tool.title}</td>
                <td>
                  {tool.links.map((link: any, i: number) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-3 border border-2 p-2 rounded">

                      <a href={link.url} target="_blank">
                        <img src={link.icon} alt="icon" width="30" height="30"
                        />

                        <span> {link.title}</span>
                      </a>
                    </div>
                  ))}
                </td>
                <td>
                  <select name="" id="">
                  {/* <option value="selected_clients">Assigned Clients</option> */}

                    {tool.clients.map((client: any, i: number) => (  
                      
                      <option value="{i}" className="">{client.name}</option>
                    ))}
                  </select>
                  
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => handleEdit(tool)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(tool.title)}
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
          Total : {filteredTools.length} records / Current Page {currentPage} of {totalPages}
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