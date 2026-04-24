"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export type ClientRow = {
    id: number;
    name: string;
    icon: string;
    created_at: string;
};

type ToolInfo = {
    title: string;
    url: string;
    icon: string | null;
};

type Tool = {
    toolTitle: string;
    toolInfos: ToolInfo[];
};

export function AddToolLinks() {
    const router = useRouter();
    const [rows, setRows] = useState<ClientRow[]>([]);
    const [selectedClients, setSelectedClients] = useState<number[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [tools, setTools] = useState<Tool[]>([
        {
            toolTitle: "",
            toolInfos: [
                {
                    title: "",
                    url: "",
                    icon: null
                }
            ]
        }
    ]);

    useEffect(() => {
        const init = async () => {
           
            const editData = localStorage.getItem("editTool");

            const res = await fetch(`${baseUrl}/api/clients`, { credentials: "include" });
            if (!res.ok) return;

            const data: ClientRow[] = await res.json();
            setRows(data);

            if (editData) {
                const parsed = JSON.parse(editData);
                console.log("Edit Data:", parsed);

                const clientIds = Array.isArray(parsed.clients)
                    ? parsed.clients.map((c: any) => c.id)
                    : [];

                console.log("SETTING EDIT CLIENTS:", clientIds);

                setSelectedClients(clientIds);

                setTools([
                    {
                        toolTitle: parsed.title || "",
                        toolInfos: Array.isArray(parsed.links)
                            ? parsed.links.map((l: any) => ({
                                title: l.title || "",
                                url: l.url || "",
                                icon: l.icon || null,
                            }))
                            : [{ title: "", url: "", icon: null }],
                    },
                ]);

                localStorage.removeItem("editTool");
            } else {
                // New tool — select all clients by default
                console.log("SETTING DEFAULT ALL CLIENTS");
                setSelectedClients(data.map(item => item.id));
            }
        };

        init();
    }, []);

    // ================= CLIENT =================
    const handleSelect = (id: number) => {
        if (selectedClients.includes(id)) {
            setSelectedClients(selectedClients.filter(i => i !== id));
        } else {
            setSelectedClients([...selectedClients, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedClients.length === rows.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(rows.map(item => item.id));
        }
    };

    // ================= TOOL =================
    const removeTool = (toolIndex: number) => {
        const updated = tools.filter((_, i) => i !== toolIndex);
        setTools(updated);
    };

    const updateToolTitle = (index: number, value: string) => {
        const updated = [...tools];
        updated[index].toolTitle = value;
        setTools(updated);
    };

    const addToolInfo = (toolIndex: number) => {
        const updated = [...tools];
        updated[toolIndex].toolInfos.push({
            title: "",
            url: "",
            icon: null
        });
        setTools(updated);
    };

    const removeToolInfo = (toolIndex: number, infoIndex: number) => {
        const updated = [...tools];
        updated[toolIndex].toolInfos =
            updated[toolIndex].toolInfos.filter((_, i) => i !== infoIndex);
        setTools(updated);
    };

    const updateToolInfo = (
        toolIndex: number,
        infoIndex: number,
        field: keyof ToolInfo,
        value: any
    ) => {
        const updated = [...tools];
        updated[toolIndex].toolInfos[infoIndex][field] = value;
        setTools(updated);
    };

    const handleSubmit = async () => {
        console.log("Submitting...");
        console.log("Clients:", selectedClients);
        console.log("Tools:", tools);

        if (selectedClients.length === 0) {
            alert("Please select at least one client");
            return;
        }

        if (tools.length === 0) {
            alert("Please add at least one tool");
            return;
        }

        try {
            const res = await fetch(`${baseUrl}/api/tools`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_ids: selectedClients,
                    tools: tools
                })
            });

            const data = await res.json();
            console.log("Response:", data);

            if (!res.ok) {
                alert(data.error || "Something went wrong");
                return;
            }

            router.push("/rocket/admin/dashboard/tool-management");
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: "Tools saved successfully",
                showConfirmButton: false,
                timer: 2000
            });

        } catch (error) {
            console.log("Submit Error:", error);
            alert("Failed to save");
        }
    };

    // icon upload for tool links
    const handleIconUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        toolIndex: number,
        infoIndex: number
    ) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log("No file selected");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "tool-icons");
        try {
            console.log("Uploading file:", file.name);
            const res = await fetch(`${baseUrl}/api/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                console.log("Upload error:", data.error);
                return;
            }
            console.log("Uploaded path:", data.path);
            updateToolInfo(toolIndex, infoIndex, "icon", data.path);
        } catch (error) {
            console.log("Upload failed:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Tool Links</h1>

            {/* CLIENT DROPDOWN */}
            <div className="client-dropdown">
                <label>Select Client</label>
                <div className="dropdown-box" onMouseLeave={() => setDropdownOpen(false)}>
                    <div onClick={() => setDropdownOpen(!dropdownOpen)}>
                        Select Clients <i className="fa-solid fa-angle-down"></i>
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown-list">
                            <label>
                                <input
                                    type="checkbox"
                                    name="select_all_clients"
                                    checked={
                                        rows.length > 0 &&
                                        rows.every((item) => selectedClients.includes(item.id))
                                    }
                                    onChange={handleSelectAll}
                                />
                                Select All
                            </label>
                            {rows.map((item) => (
                                <label key={item.id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.includes(item.id)}
                                        onChange={() => handleSelect(item.id)}
                                    />
                                    {item.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* TOOL LIST */}
            {tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="tool-box mt-4">
                    {tools.length > 1 && (
                        <button
                            className="remove-btn"
                            onClick={() => removeTool(toolIndex)}
                        >
                            <i className="fa-solid fa-x"></i>
                        </button>
                    )}

                    <h4>Tool Title</h4>
                    <input
                        type="text"
                        name={`tools[${toolIndex}][toolTitle]`}
                        value={tool.toolTitle}
                        onChange={(e) => updateToolTitle(toolIndex, e.target.value)}
                        placeholder="e.g. Ads"
                    />
                    <button
                        className="btn btn-info mt-2"
                        onClick={() => addToolInfo(toolIndex)}
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>

                    {/* TOOL INFO */}
                    {tool.toolInfos.map((info, infoIndex) => (
                        <div key={infoIndex} className="tool-info-row">
                            {tool.toolInfos.length > 1 && (
                                <button
                                    className="remove-small"
                                    onClick={() => removeToolInfo(toolIndex, infoIndex)}
                                >
                                    <i className="fa-solid fa-x"></i>
                                </button>
                            )}
                            <div>
                                <p>Icon</p>
                                <input
                                    type="file"
                                    onChange={(e) => handleIconUpload(e, toolIndex, infoIndex)}
                                />
                                {info.icon && (
                                    <div style={{ marginTop: "8px" }}>
                                        <img
                                            src={info.icon}
                                            alt="icon"
                                            width="40"
                                            height="40"
                                            style={{ objectFit: "contain", border: "1px solid #ddd", padding: "4px" }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p>Title</p>
                                <input
                                    type="text"
                                    name={`tools[${toolIndex}][toolInfos][${infoIndex}][title]`}
                                    value={info.title}
                                    onChange={(e) =>
                                        updateToolInfo(toolIndex, infoIndex, "title", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <p>URL</p>
                                <input
                                    type="url"
                                    name={`tools[${toolIndex}][toolInfos][${infoIndex}][url]`}
                                    value={info.url}
                                    onChange={(e) =>
                                        updateToolInfo(toolIndex, infoIndex, "url", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <div className="d-flex gap-2 mt-5">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push("/rocket/admin/dashboard/tool-management")}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-success mt-4"
                    onClick={handleSubmit}
                >
                    Save Tools
                </button>
            </div>
        </div>
    );
}
