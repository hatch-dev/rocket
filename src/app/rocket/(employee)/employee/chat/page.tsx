"use client";

import { useContext } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { EmployeeContext } from "@/context/EmployeeContext";

export default function Page() {

  const { employee, clients, activeClient } = useContext(EmployeeContext);

  // Find active client
  const activeClientData = clients?.find(
    (c: any) => c.id === activeClient
  );

  return (
    <div style={{ display: "block", width: "100%" }}>

      <div>
        <ChatWindow
          userId={employee?.id}
          clientId={activeClient}
          clientName={activeClientData?.name}
        />
      </div>

    </div>
  );
}