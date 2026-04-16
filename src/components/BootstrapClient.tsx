"use client";

import { useEffect } from "react";

/** Loads Bootstrap’s JS bundle for dropdowns, etc. (App Router has no `pages/_app`.) */
export function BootstrapClient() {
  useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return null;
}
