import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();
const port = process.env.PORT || 1444;

// Simulated database for storing open events (in memory)
const emailTrackingLogs = {};

// Route to generate a unique tracking link
app.get("/generate", (req, res) => {
  const uniqueId = uuidv4();
  const trackingLink = `${req.protocol}://${req.get("host")}/track/${uniqueId}`;
  emailTrackingLogs[uniqueId] = { opens: 0, timestamp: new Date() };
  res.json({ trackingLink });
});

// Tracking route
app.get("/track/:id", (req, res) => {
  const { id } = req.params;

  if (emailTrackingLogs[id]) {
    emailTrackingLogs[id].opens += 1;
    emailTrackingLogs[id].lastOpened = new Date();

    // Only log the total number of opens for this ID
    console.clear(); // Optional: Clears the console to prevent logs from repeating
    console.log(`Email opened! ID: ${id}, Total Opens: ${emailTrackingLogs[id].opens}`);
  } else {
    console.log(`Invalid tracking ID: ${id}`);
  }

  // Respond with a transparent 1x1 pixel (useful for email tracking)
  res.set("Content-Type", "image/gif");
  res.send(Buffer.from("R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64"));
});

// Open Route
app.get("/", (req, res) => {
  res.send("Main Tracker");
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
