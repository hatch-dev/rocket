import { Favourite } from "@/components/rocket/Favourite";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function Page() {

  return (
    < Favourite/>
  );
}