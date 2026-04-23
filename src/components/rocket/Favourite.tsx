"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEmployee } from "@/context/EmployeeContext";
import { RocketCard } from "@/components/rocket/Card";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export function Favourite() {
  const { activeClient, setActiveClient, clients } = useEmployee();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const reload = () => {
      if (!activeClient) return;
      fetch(`${baseUrl}/api/favorites?clientId=${activeClient}`)
        .then(res => res.json())
        .then(favs => setData(favs));
    };
    reload();
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", reload);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("favoritesUpdated", reload);
      }
    };
  }, [activeClient]);

  // group tools
  const grouped: any = {};
  data.forEach((f: any) => {
    if (!f.toolLink) return;
    const group = f.toolLink?.tool?.title || "Others";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(f.toolLink);
  });

  return (
    <div className="favorites">
      <div className="heading d-flex gap-4 align-items-center m-2">
        <h3 style={{ margin: 0 }}>Mine Favoritter</h3>

        <select
          value={activeClient || ""}
          onChange={(e) => setActiveClient(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Client</option>

          {clients?.map((client: any) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(grouped).length === 0 && <p>No favorites yet</p>}

      {Object.keys(grouped).map((group) => (
        <RocketCard key={group} title={group}>
          {grouped[group].map((item: any) => (
            <Link key={item.id} href={item.url} target="_blank">
              <div className="item">
                <img src={item.icon} alt="" />
                {item.title}
              </div>
            </Link>
          ))}
        </RocketCard>
      ))}
    </div>
  );
}