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
                const res = await fetch(`/api/clients/${clientId}`, {
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
            text: initial
                ? "Client will be updated"
                : "New client will be created",
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

                const uploadRes = await fetch("/api/upload", {
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
                ? `/api/clients/${initial.id}`
                : `/api/clients`;

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

            router.push("/admin/dashboard/client-management");

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
        <div className="container mt-4">
            <h2 className="mb-3">
                {initial ? "Edit Client" : "Add Client"}
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label> Icon</label>
                        {initial?.icon && (
                            <div className="mb-2">
                                <img src={initial.icon} style={{ width: "80px", height: "80px" }} />
                            </div>
                        )}
                        <input type="file" name="file" className="form-control" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label> Name</label>
                        <input name="name" defaultValue={initial?.name || ""} className="form-control"
                            required />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary"
                        onClick={() => router.push("/admin/dashboard/client-management") } >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading} >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}