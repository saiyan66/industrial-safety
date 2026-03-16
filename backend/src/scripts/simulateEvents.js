import axios from "axios";

const BASE_URL = "http://localhost:5000/events";

const cameras = [1, 2, 3, 4];
const zones = [1, 2, 3, 4];

const eventTypes = [
  "PPE_OK",
  "PPE_VIOLATION"
];

const severities = ["low", "medium", "high"];

function generateEvent() {

  const isViolation = Math.random() < 0.4;

  return {
    event_type: isViolation ? "PPE_VIOLATION" : "PPE_OK",
    camera_id: cameras[Math.floor(Math.random() * cameras.length)],
    zone_id: zones[Math.floor(Math.random() * zones.length)],
    is_compliant: !isViolation,
    severity: isViolation
      ? severities[Math.floor(Math.random() * severities.length)]
      : "low",
    metadata: isViolation
      ? { missing: ["helmet"] }
      : {}
  };

}

async function sendEvent() {
  try {
    const event = generateEvent();
    await axios.post(BASE_URL, event);
    console.log("Event inserted:", event);
  } catch (err) {
    console.error("Failed to insert event:", err.message);
  }
}
setInterval(sendEvent, 5000);