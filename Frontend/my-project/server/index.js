// server/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

// Allow your React app (likely on localhost:5173) to talk to this server
app.use(cors());
app.use(express.json());

// Status endpoint stub
app.get("/api/status", (_req, res) => {
  res.json({
    isOnline: true,
    serverStatus: "up",
    signalStrength: 82,
    latencyMs: 23,
    downloadMbps: 150,
    uploadMbps: 20,
    lastChecked: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Status server running on http://localhost:${PORT}`);
});
