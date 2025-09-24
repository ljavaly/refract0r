import "./App.css";

import TopNav from "./components/TopNav";
import Stream from "./components/Stream";
import Inbox from "./components/Inbox";
import Admin from "./components/Admin";
import Browse from "./components/Browse";
import SideNav from "./components/SideNav";

import React, { useEffect, useState } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState("stream"); // Default to 'video' page
  const [path, setPath] = useState(window.location.pathname);

  // Track browser navigation
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
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
    // If currently on /admin, navigate back to root for regular pages
    if (path === "/admin") {
      navigate("/");
    }
    setCurrentPage(page);
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
        <SideNav onPageChange={handlePageChange} onNavigate={navigate} />
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
