"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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
            toolInfos: [{ title: "", url: "", icon: null }]
        }
    ]);

    useEffect(() => {
        const init = async () => {
            const editData = localStorage.getItem("editTool");
            const res = await fetch(`/rocket/api/clients`, { credentials: "include" });
            if (!res.ok) return;
            const data: ClientRow[] = await res.json();
            setRows(data);

            if (editData) {
                const parsed = JSON.parse(editData);
                const clientIds = Array.isArray(parsed.clients)
                    ? parsed.clients.map((c: any) => c.id)
                    : [];
                setSelectedClients(clientIds);
                setTools([{
                    toolTitle: parsed.title || "",
                    toolInfos: Array.isArray(parsed.links)
                        ? parsed.links.map((l: any) => ({
                            title: l.title || "",
                            url: l.url || "",
                            icon: l.icon || null,
                        }))
                        : [{ title: "", url: "", icon: null }],
                }]);
                localStorage.removeItem("editTool");
            } else {
                setSelectedClients(data.map(item => item.id));
            }
        };
        init();
    }, []);

    // ======= CLIENT =======
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

    // ===== TOOL ======
    const removeTool = (toolIndex: number) => {
        setTools(tools.filter((_, i) => i !== toolIndex));
    };

    const updateToolTitle = (index: number, value: string) => {
        const updated = [...tools];
        updated[index].toolTitle = value;
        setTools(updated);
    };

    const addToolInfo = (toolIndex: number) => {
        const updated = [...tools];
        updated[toolIndex].toolInfos.push({ title: "", url: "", icon: null });
        setTools(updated);
    };

    const removeToolInfo = (toolIndex: number, infoIndex: number) => {
        const updated = [...tools];
        updated[toolIndex].toolInfos = updated[toolIndex].toolInfos.filter((_, i) => i !== infoIndex);
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
        if (selectedClients.length === 0) { alert("Please select at least one client"); return; }
        if (tools.length === 0) { alert("Please add at least one tool"); return; }
        try {
            const res = await fetch(`/rocket/api/tools`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_ids: selectedClients, tools })
            });
            const data = await res.json();
            if (!res.ok) { alert(data.error || "Something went wrong"); return; }
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
            alert("Failed to save");
        }
    };

    const handleIconUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        toolIndex: number,
        infoIndex: number
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "tool-icons");
        try {
            const res = await fetch(`/rocket/api/upload`, { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) return;
            updateToolInfo(toolIndex, infoIndex, "icon", data.path);
        } catch (error) {
            console.log("Upload failed:", error);
        }
    };

    return (
        <>
            <div className="container mt-4">
                {/* PAGE HEADER */}
                <div className="d-flex align-items-center gap-3 mb-4 tl-page-header">
                    <div className="tl-page-header-icon">
                        <i className="fa-solid fa-link"></i>
                    </div>
                    <div>
                        <h1>Tool Links</h1>
                        <p>Add and manage tool links for the selected client.</p>
                    </div>
                </div>

                {/* CLIENT DROPDOWN */}
                <div className="client-dropdown mb-3">
                    <label>Select Client</label>
                    <div className="dropdown-box" onMouseLeave={() => setDropdownOpen(false)}>
                        <div className="dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            Select Clients <i className="fa-solid fa-angle-down"></i>
                        </div>
                        {dropdownOpen && (
                            <div className="dropdown-list">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="select_all_clients"
                                        checked={rows.length > 0 && rows.every(item => selectedClients.includes(item.id))}
                                        onChange={handleSelectAll}
                                    />
                                    Select All
                                </label>
                                {rows.map(item => (
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
                            <button className="remove-btn" onClick={() => removeTool(toolIndex)}>
                                <i className="fa-solid fa-x"></i>
                            </button>
                        )}

                        <h4>Tool Title</h4>
                        <div className="tool-title-row mb-4">
                            <input
                                type="text"
                                className="tool-title-input"
                                name={`tools[${toolIndex}][toolTitle]`}
                                value={tool.toolTitle}
                                onChange={(e) => updateToolTitle(toolIndex, e.target.value)}
                                placeholder="e.g. Ads"
                            />
                            <button className="btn-add-info" onClick={() => addToolInfo(toolIndex)}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <hr className="section-divider" />

                        {/* TOOL INFO */}
                        {tool.toolInfos.map((info, infoIndex) => (
                            <div key={infoIndex} className="tool-info-row mb-4">
                                {tool.toolInfos.length > 1 && (
                                    <button className="remove-small" onClick={() => removeToolInfo(toolIndex, infoIndex)}>
                                        <i className="fa-solid fa-x"></i>
                                    </button>
                                )}

                                {/* ICON */}
                                <div className="icon-section-label">Icon</div>
                                <div className="icon-upload-area">
                                    <div className="upload-dropzone">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleIconUpload(e, toolIndex, infoIndex)}
                                        />
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                        <div className="drop-text">Choose file or drag &amp; drop</div>
                                        <div className="drop-hint">PNG, JPG or SVG (max. 2MB)</div>
                                    </div>
                                    <div className="upload-preview">
                                        <div className="upload-preview-box">
                                            {info.icon
                                                ? <img src={info.icon} alt="icon" />
                                                : (
                                                    <div className="stack-icon">
                                                        
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="upload-preview-text">
                                            <strong>Upload an icon for this tool</strong>
                                            <span>Recommended size: 512x512px</span>
                                        </div>
                                    </div>
                                </div>

                                {/* TITLE */}
                                <div className="mt-3">
                                    <label className="field-label">Title</label>
                                    <input
                                        type="text"
                                        className="field-input"
                                        name={`tools[${toolIndex}][toolInfos][${infoIndex}][title]`}
                                        value={info.title}
                                        onChange={(e) => updateToolInfo(toolIndex, infoIndex, "title", e.target.value)}
                                        placeholder="Enter title"
                                    />
                                </div>

                                {/* URL */}
                                <div className="mt-3">
                                    <label className="field-label">URL</label>
                                    <input
                                        type="url"
                                        className="field-input"
                                        name={`tools[${toolIndex}][toolInfos][${infoIndex}][url]`}
                                        value={info.url}
                                        onChange={(e) => updateToolInfo(toolIndex, infoIndex, "url", e.target.value)}
                                        placeholder="Enter URL"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* ACTION BUTTONS */}
                <div className="d-flex gap-2 justify-content-end mt-5">
                    <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={() => router.push("/rocket/admin/dashboard/tool-management")}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-save"
                        onClick={handleSubmit}
                    >
                        <i className="fa-solid fa-floppy-disk me-2"></i> Save Tools
                    </button>
                </div>
            </div>
        </>
    );
}