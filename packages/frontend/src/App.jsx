import "./App.css";

import TopNav from "./components/TopNav";
import Stream from "./components/Stream";
import Inbox from "./components/Inbox";
import Admin from "./components/Admin";
import Browse from "./components/Browse";
import SideNav from "./components/SideNav";

import React, { useEffect, useState } from "react";

// Centralized path-to-page mapping
const ROUTE_MAP = {
  "/": "stream",
  "/admin": "admin",
  "/browse": "browse",
  "/inbox": "inbox",
};

const PAGE_TO_PATH = {
  stream: "/",
  admin: "/admin",
  browse: "/browse",
  inbox: "/inbox",
};

function App() {
  // Helper function to get page from path
  const getPageFromPath = (path) => ROUTE_MAP[path] || "stream";

  // Helper function to get path from page
  const getPathFromPage = (page) => PAGE_TO_PATH[page] || "/";

  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromPath(window.location.pathname),
  );
  const [path, setPath] = useState(window.location.pathname);

  // Track browser navigation
  useEffect(() => {
    const onPopState = () => {
      const newPath = window.location.pathname;
      setPath(newPath);
      setCurrentPage(getPageFromPath(newPath));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    if (to !== window.location.pathname) {
      window.history.pushState({}, "", to);
      setPath(to);
    }
  };

  // Function to handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(getPathFromPage(page));
  };

  // Admin route gating
  if (path === "/admin") {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <TopNav onPageChange={handlePageChange} onNavigate={navigate} />
        <main className="flex-1 overflow-hidden">
          <Admin />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav onPageChange={handlePageChange} onNavigate={navigate} />
      <div className="flex flex-1 overflow-hidden">
        <SideNav
          onPageChange={handlePageChange}
          onNavigate={navigate}
          currentPage={currentPage}
        />
        <main className="flex-1 overflow-hidden">
          {currentPage === "stream" && <Stream />}
          {currentPage === "browse" && <Browse />}
          {currentPage === "inbox" && <Inbox />}
          {currentPage === "admin" && <Admin />}
        </main>
      </div>
    </div>
  );
}

export default App;
