import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import AudienceChat from "./AudienceChat.jsx";
import apiClient from "../api/client.js";
import wsClient from "../api/ws";

function Admin() {
  const [queuedComments, setQueuedComments] = useState([]);

  useEffect(() => {
    wsClient.connectWebSocket();
    apiClient.getComments().then((data) => {
      setQueuedComments(data);
    });
  }, []);

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

  const sendNextComment = () => {
    if (wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
      let nextComment = queuedComments[0];
      if (!nextComment) {
        console.log("No more comments to send, skipping...");
        return;
      }

      wsClient.sendComment(nextComment.user, nextComment.message);

      if (queuedComments.length > 1) {
        setQueuedComments(queuedComments.slice(1));
      } else {
        console.log(
          "No more comments to send, setting queuedComments to empty array...",
        );
        setQueuedComments([]);
      }

      console.log("queuedComments", queuedComments);
    }
  };

  return (
    <div className="admin-cues-container">
      <div className="admin-controls mb-4">
        <button onClick={sendTestMessage} className="test-message-button">
          Trigger "You have a new message"
        </button>
      </div>
      <div className="grid grid-cols-5 justify-center admin-cues-grid items-center">
        <section className="admin-cues-section grid col-span-2">
          <AudienceChat initialComments={queuedComments} isAdmin={true} />
        </section>
        <div className="flex justify-center items-center col-span-1">
          <button onClick={sendNextComment} className="test-message-button">
            Send next ➡️
          </button>
        </div>
        <section className="admin-cues-section grid col-span-2">
          <AudienceChat />
        </section>
      </div>
    </div>
  );
}

export default Admin;
