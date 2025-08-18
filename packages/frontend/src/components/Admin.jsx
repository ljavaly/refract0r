import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import queuedComments from "../data/queued-comments.json";
import StreamChat from "./StreamChat.jsx";

function Admin() {
  return (
    <div className="admin-cues-container">
      <div className="grid grid-cols-2 justify-center admin-cues-grid">
        <section className="admin-cues-section p-3">
          <StreamChat initialComments={queuedComments} />
        </section>

        <section className="admin-cues-section p-3">
          <StreamChat />
        </section>
      </div>
    </div>
  );
}

export default Admin;
