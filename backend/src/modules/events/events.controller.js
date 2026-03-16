import {
  createEventService,
  getRecentEventsService,
  resolveEventService,
  getAlertsService
} from "./events.service.js";

export const createEvent = async (req, res) => {
  try {
    const result = await createEventService(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const getRecentEvents = async (req, res) => {
  try {
    const data = await getRecentEventsService();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const resolveEvent = async (req, res) => {
  try {
    const result = await resolveEventService(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getAlerts = async (req, res) => {
  try {
    const alerts = await getAlertsService();
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      error: "Failed to fetch alerts"
    });

  }
};
