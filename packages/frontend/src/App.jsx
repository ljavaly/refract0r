import "./App.css";

import TopNav from "./components/TopNav";
import Stream from "./components/Stream";
import Inbox from "./components/Inbox";
import Admin from "./components/Admin";
import Browse from "./components/Browse";
import Bank from "./components/Bank";
import SideNav from "./components/SideNav";

import { Routes, Route } from "react-router-dom";

// Layout component for pages with sidebar
function MainLayout({ children }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

// Layout component for admin page (no sidebar)
function AdminLayout({ children }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Stream />
          </MainLayout>
        }
      />
      <Route
        path="/browse"
        element={
          <MainLayout>
            <Browse />
          </MainLayout>
        }
      />
      <Route
        path="/inbox"
        element={
          <MainLayout>
            <Inbox />
          </MainLayout>
        }
      />
      <Route
        path="/bank"
        element={
          <MainLayout>
            <Bank />
          </MainLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Admin />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
