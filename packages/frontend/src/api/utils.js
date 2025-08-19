// API Client for communicating with the backend

var HOST = "localhost:3001";
var HTTP_PROTOCOL = "http";

if (process.env.NODE_ENV === "development") {
  // Code to run in development mode
  console.log(
    "Running in development mode, using local API",
    HTTP_PROTOCOL + "://" + HOST,
  );
} else {
  // Code for other environments (e.g., production)
  HOST = "refract0r-server-969549239554.us-central1.run.app";
  HTTP_PROTOCOL = "https";
  console.log(
    "Running in production mode, using remote API",
    HTTP_PROTOCOL + "://" + HOST,
  );
}

export { HOST, HTTP_PROTOCOL };
