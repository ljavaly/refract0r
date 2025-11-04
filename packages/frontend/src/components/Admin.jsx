import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import AudienceChat from "./AudienceChat.jsx";
import apiClient from "../api/client.js";
import wsClient from "../api/ws";

function Admin() {
  const [queuedComments, setQueuedComments] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [activeTab, setActiveTab] = useState("audience-chat");

  useEffect(() => {
    wsClient.connectWebSocket();
  }, []);

  const loadSceneComments = (scene) => {
    if (!scene) {
      // Clear comments when no scene is selected
      setSelectedScene("");
      setQueuedComments([]);
      return;
    }

    setSelectedScene(scene);
    apiClient
      .getCommentsByScene(scene)
      .then((data) => {
        setQueuedComments(data);
      })
      .catch((error) => {
        console.log("Failed to load scene comments:", error);
        setQueuedComments([]);
      });
  };

  const sendTestMessage = () => {
    if (wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: "unreadMessage",
        user: "Admin",
        timestamp: new Date().toISOString(),
        sessionId: wsClient.sessionId,
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
    }
  };

  return (
    <div className="admin-cues-container">
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "audience-chat" ? "active" : ""}`}
          onClick={() => setActiveTab("audience-chat")}
        >
          Audience Chat
        </button>
        <button
          className={`admin-tab ${activeTab === "inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
      </div>

      {activeTab === "audience-chat" && (
        <>
          <div className="grid grid-cols-5 justify-center admin-cues-grid items-center">
            <section className="admin-cues-section grid col-span-2">
              <div className="mb-4">
                <select
                  id="scene-select"
                  value={selectedScene}
                  onChange={(e) => loadSceneComments(e.target.value)}
                  className="scene-select-dropdown"
                >
                  <option value="">Choose a scene...</option>
                  <option value="1_rp_home_invasion">1 - RP Home Invasion</option>
                  <option value="2_grwm_big_brother_fresh_direct_1">
                    2 - GRWM Big Brother Fresh Direct 1
                  </option>
                  <option value="3_ama_louie_s">3 - AMA Louies</option>
                  <option value="4_grwm_survivor">4 - GRWM Survivor</option>
                  <option value="5_ama_coney_island">5 - AMA Coney Island</option>
                  <option value="6_workout">6 - Workout</option>
                  <option value="7_angusxbeef">7 - Angus x Beef</option>
                  <option value="8_fresh_direct_2">8 - Fresh Direct 2</option>
                  <option value="9_wolf">9 - Wolf</option>
                  <option value="10_rick_morty">10 - Rick and Morty</option>
                  <option value="11_mirror_test">11 - Mirror Test</option>
                  <option value="12_grace">12 - Grace</option>
                </select>
              </div>
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
        </>
      )}

      {activeTab === "inbox" && (
        <div className="admin-inbox-tab">
          <div className="admin-controls mb-4">
            <button onClick={sendTestMessage} className="test-message-button">
              Trigger "You have a new message"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
