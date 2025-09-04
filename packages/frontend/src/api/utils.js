// API Client for communicating with the backend

var HOST = "localhost:3001";
var HTTP_PROTOCOL = "http";
var WS_PROTOCOL = "ws";

if (process.env.NODE_ENV === "development") {
  // Code to run in development mode
  console.log(
    "Using local API",
    HTTP_PROTOCOL + "://" + HOST,
    "\n" + "Using local WebSocket",
    WS_PROTOCOL + "://" + HOST,
  );
} else {
  // Code for other environments (e.g., production)
  HOST = "refract0r-server-969549239554.us-central1.run.app";
  HTTP_PROTOCOL = "https";
  WS_PROTOCOL = "wss";
  console.log(
    "Using remote API",
    HTTP_PROTOCOL + "://" + HOST,
    "\n" + "Using remote WebSocket",
    WS_PROTOCOL + "://" + HOST,
  );
}

export { HOST, HTTP_PROTOCOL, WS_PROTOCOL };
