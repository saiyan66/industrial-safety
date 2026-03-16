import {
  insertEvent,
  fetchRecentEvents,
  resolveEventById,
  fetchAlerts
} from "./events.repository.js";

export const createEventService = async (payload) => {

  if (!payload.event_type)
    throw new Error("event_type required");

  let severity = "low";

  if (!payload.is_compliant) {
    if (payload.metadata?.missing?.includes("helmet"))
      severity = "high";
    else
      severity = "medium";
  }
  return await insertEvent({
    ...payload,
    severity
  });
};

export const getRecentEventsService = async () => {
  return await fetchRecentEvents();
};


export const resolveEventService = async (id) => {
  await resolveEventById(id);
  return { message: "Event resolved" };
};

export const getAlertsService = async () => {
  const alerts = await fetchAlerts();
  return alerts;
}