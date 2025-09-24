import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import queuedComments from "../data/queued-comments.json";
import AudienceChat from "./AudienceChat.jsx";
import wsClient from "../api/ws";

function Admin() {
  const sendTestMessage = () => {
    if (wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: "unreadMessage",
        user: "Admin",
        timestamp: new Date().toISOString(),
      };

      wsClient.ws.send(JSON.stringify(testMessage));
    } else {
      console.warn(
        "WebSocket not connected. State:",
        wsClient.ws ? wsClient.ws.readyState : "WebSocket is null",
      );
    }
  };

  return (
    <div className="admin-cues-container">
      <div className="admin-controls mb-4">
        <button onClick={sendTestMessage} className="test-message-button">
          Trigger "You have a new message"
        </button>
      </div>
      <div className="grid grid-cols-2 justify-center admin-cues-grid">
        <section className="admin-cues-section p-3">
          <AudienceChat initialComments={queuedComments} />
        </section>
      </div>
    </div>
  );
}

export default Admin;
