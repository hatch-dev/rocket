"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export type ClientRow = {
    id: number;
    name: string;
    icon: string | null;
    created_at: string | Date;
};

export function ClientModel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get("id");
    const [initial, setInitial] = useState<ClientRow | null>(null);
    const [loadingData, setLoadingData] = useState(!!clientId);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!clientId) return;
        const fetchClient = async () => {
            try {
                const res = await fetch(`/rocket/api/clients/${clientId}`, {
                    credentials: "include"
                });
                if (!res.ok) {
                    setError("Failed to load client");
                    return;
                }
                const data = await res.json();
                setInitial(data);
                console.log("EDIT DATA:", data);
            } catch (err) {
                console.log("FETCH ERROR:", err);
                setError("Something went wrong");
            } finally {
                setLoadingData(false);
            }
        };
        fetchClient();
    }, [clientId]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") || "").trim();
        const file = fd.get("file");
        if (!name) {
            setError("All required fields must be filled");
            return;
        }
        const confirm = await Swal.fire({
            title: initial ? "Are you sure to update?" : "Are you sure to create?",
            text: initial ? "Client will be updated" : "New client will be created",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
        });
        if (!confirm.isConfirmed) return;
        setLoading(true);
        try {
            let imagePath = null;
            if (file instanceof File && file.size > 0) {
                const uploadData = new FormData();
                uploadData.append("file", file);
                uploadData.append("folder", "clientIcon");
                const uploadRes = await fetch(`/rocket/api/upload`, {
                    method: "POST",
                    body: uploadData,
                });
                const uploadResult = await uploadRes.json();
                imagePath = uploadResult.path;
            }

            const body = {
                name,
                icon: imagePath || initial?.icon || null,
            };

            const url = initial?.id
                ? `/rocket/api/clients/${initial.id}`
                : `/rocket/api/clients`;

            const method = initial?.id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                await Swal.fire({
                    title: "Error",
                    text: data.error || "Failed to save client",
                    icon: "error",
                });
                return;
            }

            await Swal.fire({
                title: initial ? "Updated!" : "Created!",
                icon: "success",
            });

            router.push("/rocket/admin/dashboard/client-management");

        } catch (err) {
            console.log("Error:", err);
            await Swal.fire({
                title: "Error",
                text: "Something went wrong",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    if (loadingData) return <p>Loading...</p>;

    return (
        <div className="cm-page">

            {/* ── HEADER ── */}
            <div className="cm-header">
                <div className="cm-header-text">
                    <h2>{initial ? "Edit Client" : "Add Client"}</h2>
                    <p>
                        {initial
                            ? "Update the client details below."
                            : "Enter client details to add a new client to the system."}
                    </p>
                </div>
               
            </div>

            {/* ── CARD ── */}
            <div className="cm-card">
                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="row g-4">

                        {/* Icon column */}
                        <div className="col-md-6">
                            <div className="cm-field-label">
                                <div className="cm-field-icon">
                                    <i className="fa-regular fa-image"></i>
                                </div>
                                Icon
                            </div>

                            {initial?.icon && (
                                <img
                                    src={initial.icon}
                                    alt="Current icon"
                                    className="cm-icon-preview"
                                />
                            )}

                            <div className="cm-dropzone">
                                <input type="file" name="file" accept="image/*" />
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <div className="cm-dropzone-text">Choose a file or drag &amp; drop</div>
                                <div className="cm-dropzone-hint">PNG, JPG or SVG (max. 2MB)</div>
                            </div>
                        </div>

                        {/* Name column */}
                        <div className="col-md-6">
                            <div className="cm-field-label">
                                <div className="cm-field-icon">
                                    <i className="fa-regular fa-user"></i>
                                </div>
                                Name
                            </div>

                            <input
                                name="name"
                                defaultValue={initial?.name || ""}
                                className="cm-name-input"
                                placeholder="Enter client name"
                                required
                            />
                        </div>
                    </div>

                    <hr className="cm-divider" />

                    {/* Action Buttons */}
                    <div className="cm-actions">
                        <button
                            type="button"
                            className="cm-btn-cancel"
                            onClick={() => router.push("/rocket/admin/dashboard/client-management")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cm-btn-save"
                            disabled={loading}
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            {loading ? "Saving..." : "Save Client"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}