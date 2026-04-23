"use client";

import { AuthLogoutButton } from "@/components/auth/AuthLogoutButton";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

type NavKey = "dash" | "emp" | "clientManagement" | "toolManagement" ;

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  const isEmployee = pathname.startsWith("/admin/dashboard/employees");
  const isAdmin = pathname.startsWith("/admin/dashboard");
  const isAddEmployee = pathname.startsWith("/admin/dashboard/add-employee");
  const isToolManagement = pathname.startsWith("/admin/dashboard/tool-management");
  const isClientManagement = pathname.startsWith("/admin/dashboard/client-management");
  const isaddClient = pathname.startsWith("/admin/dashboard/add-client");
  const isaddtool = pathname.startsWith("/admin/dashboard/add-tool");

const activeNav: NavKey = useMemo(() => {

  if (isToolManagement) return "toolManagement";
  if (isClientManagement) return "clientManagement";
  if (isaddClient) return "clientManagement";
  if (isaddtool) return "toolManagement";
  if (isEmployee) return "emp";
  if (isAddEmployee) return "emp";
  if (pathname === "/admin/dashboard") return "dash";

  return "dash";

}, [pathname, isEmployee, isAddEmployee, isClientManagement, isToolManagement]);

  const logoHref = isAdmin ? "/admin/dashboard" : "/admin/dashboard/employees";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const toggleDesktop = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((m) => !m);
  }, []);

  const sidebarClass = [
    "sidebar",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-show" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const topbarClass = [
    "navbar",
    "border-bottom",
    "fixed-top",
    "topbar",
    "px-3",
    collapsed ? "full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contentClass = ["content", "py-10", collapsed ? "full" : ""]
    .filter(Boolean)
    .join(" ");

  const overlayClass = ["overlay", mobileOpen ? "show" : ""]
    .filter(Boolean)
    .join(" ");

  const navClass = (key: NavKey) =>
    ["nav-link", activeNav === key ? "active" : ""].filter(Boolean).join(" ");

  return (
    <>
      <div
        id="overlay"
        className={overlayClass}
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
        onKeyDown={(e) => e.key === "Escape" && closeMobile()}
        role="presentation"
      />

      <nav
        id="topbar"
        className={`${topbarClass} w-100 d-flex flex-wrap align-items-center justify-content-between gap-2`}
      >
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            id="toggleBtn"
            className="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm"
            onClick={toggleDesktop}
            aria-label="Toggle sidebar"
          >
            <i className="ti ti-layout-sidebar-left-expand" />
          </button>

          <button
            type="button"
            id="mobileBtn"
            className="btn btn-light btn-icon btn-sm d-lg-none me-2"
            onClick={toggleMobile}
            aria-label="Open menu"
          >
            <i className="ti ti-layout-sidebar-left-expand" />
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <AuthLogoutButton kind={isAdmin ? "admin" : "employee"} />
          <ul className="list-unstyled d-flex align-items-center mb-0 gap-1">
            <li className="dropdown">
             
            </li>
            <li className="ms-3 dropdown">
              <a
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/images/avatar/avatar-1.jpg"
                  alt=""
                  className="avatar avatar-sm rounded-circle"
                />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end p-0"
                style={{ minWidth: 200 }}
              >
                <div>
                  
                  <div className="p-3 d-flex flex-column gap-1 small lh-lg">
                    <a href="#!">
                      <span>Home</span>
                    </a>
                    <a href="#!">
                      <span> Inbox</span>
                    </a>
                    <a href="#!">
                      <span> Chat</span>
                    </a>
                    <a href="#!">
                      <span> Activity</span>
                    </a>
                    <a href="#!">
                      <span> Account Settings</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <aside id="sidebar" className={sidebarClass}>
        <div className="logo-area">
          <Link href={logoHref} className="d-inline-flex align-items-center">
            <span className="logo-text ms-2">
              <Image
                src="/assets/images/rocket-logo.png"
                alt="Moonlanding"
                width={170}
                height={50}
              />
            </span>
          </Link>
        </div>
        
        <ul className="nav flex-column">
          <li className="px-4 py-2">
            <small className="nav-text">Main</small>
          </li>
          
            <li>
              <Link className={navClass("dash")} href="/admin/dashboard"
                onClick={closeMobile}
              >
                <i className="fa-solid fa-house"></i>
                <span className="nav-text text-white">Dashboard</span>
              </Link>
            </li>
          
            <>
              <li>
                <Link className={navClass("emp")} href="/admin/dashboard/employees"
                  onClick={closeMobile}
                >
                  
                   <i className="fa-solid fa-user"></i>
                  <span className="nav-text">Employee Management</span>
                </Link>
              </li>
            </>
          <>
          <li>
            <Link className={navClass("clientManagement")} href="/admin/dashboard/client-management"
                  onClick={closeMobile}>
                     <i className="fa-solid fa-user-group"></i>
                     <span className="nav-text">Client Management</span>
                  </Link>
          </li>
           <li>
            <Link className={navClass("toolManagement")} href="/admin/dashboard/tool-management"
                  onClick={closeMobile}>
                   <i className="fa-solid fa-wrench"></i>
                     <span className="nav-text">Tool Management</span>
                  </Link>
          </li>
          </>
        </ul>
      </aside>

      <main id="content" className={contentClass}>
        {children}
      </main>
    </>
  );
}
