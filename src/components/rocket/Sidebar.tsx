"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export function RocketSidebar({ clients, employee, activeClient, setActiveClient }: any) {
  const router = useRouter();

  useEffect(() => {
    if (clients?.length > 0 && !activeClient) {
      setActiveClient(clients[0].id);
    }
  }, [clients]);

  const handleLogout = async () => {
    await fetch(`${baseUrl}/api/auth/employee/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/rocket/");
    router.refresh();
  };

  return (
    <div className="sidebar-employee">
      <ul>
        {clients?.length > 0 ? (
          clients.map((client: any) => {
            const isActive = activeClient === client.id;
            return (
              <li key={client.id} className={isActive ? "active" : ""}
                onClick={() => {
                  setActiveClient(client.id);
                }} >
                <i className="fa-solid fa-user" /> {client.name}
              </li>
            );
          })
        ) : (
          <li>No client is assigned</li>
        )}
        <li onClick={() => router.push('/rocket/employee/chat')}>Chat</li>
      </ul>

      <div className="sidebar-employee-bottom">
        <div className="" onClick={() => router.push('/rocket/employee/dashboard/favourite')} >
          <i className="fa-solid fa-star goldenStar" /> Favoritter
        </div>

        <div className="bottom1">
          <span className="user-card">
            <img src={employee?.profileImg || `${baseUrl}/images/avatar/default.png`} alt="profile" className="profile-img" width="50" height="50" />
            <span>
              {employee?.firstname} {employee?.lastname}
            </span>
          </span>
          <button type="button" className="logout-icon" onClick={handleLogout} >
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </div>
    </div>
  );
}
