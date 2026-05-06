"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RocketCard } from "@/components/rocket/Card";
import { RocketChatWidget } from "@/components/rocket/ChatWidget";
import { useEmployee } from "@/context/EmployeeContext";
type Props = {
  clients: any;
  employee: any;
};

export function EmployeeRocketDashboard({ clients, employee }: Props) {
  const { activeClient } = useEmployee();
  // ====== STATE =======
  const [tools, setTools] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  // ===== FETCH TOOLS ======
  useEffect(() => {
    if (!activeClient) return;

    fetch(`/rocket/api/employees/tools?clientId=${activeClient}`)
      .then(res => res.json())
      .then(data => {
        setTools(data);
      })
      .catch(err => console.log("TOOLS ERROR:", err));

  }, [activeClient]);

  // load favorites
  useEffect(() => {
    if (!activeClient) return;

    fetch(`/rocket/api/favorites?clientId=${activeClient}`)
      .then(res => res.json())
      .then(data => {
        const ids = data.map((f: any) => Number(f.toolLinkId));
        setFavorites(ids);
      });

  }, [activeClient]);

  // toggle
  const toggleFavorite = async (link: any) => {
  const res = await fetch(`/rocket/api/favorites/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      clientId: activeClient,
      toolLinkId: link.id,
      employeeId: employee.id
    })
  });

  const data = await res.json();

  if (data.added) {
    setFavorites((prev) => [...new Set([...prev, link.id])]);
  } else {
    setFavorites((prev) => prev.filter(id => id !== link.id));
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("favoritesUpdated"));
  }
};
  // check
  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <>
      <div className="wrapper-1">
        <div className="content-employee">
          <div className="title">Velkommen til Rocket!</div>
          <div className="subtitle">
            Velg en kunde under for raske snarveier.
          </div>
          <div className="grid">
            {tools.map((group: any) => (
              <RocketCard key={group.title} title={group.title}>
                {group.links.map((link: any) => (
                  <Link key={link.id} href={link.url} target="_blank">
                    <div className="item" style={{ position: "relative" }}>
                      <img src={link.icon} alt="" />
                      {link.title}

                      {/*  FAVORITE ICON */}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(link);
                        }}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 8,
                          cursor: "pointer",
                        }}
                      >
                        <i
                          className={
                            isFavorite(link.id)
                              ? "fa-solid fa-star"
                              : "fa-regular fa-star"
                          }
                          style={{
                            color: isFavorite(link.id) ? "#ebb434" : "#999",
                          }}
                        />
                      </span>

                    </div>

                  </Link>
                ))}

              </RocketCard>
            ))}
          </div>

        </div>

        <RocketChatWidget />
      </div>
    </>
  );
}