import { ClientModel } from "@/components/admin/AddClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function Page(){
  return <ClientModel />;
}