import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export const getPpeOverview = async () => {
  const res = await api.get("/analytics/ppe-overview");
  return res.data;
};

export const getRecentEvents = async () => {
  const res = await api.get("/events/recent");
  return res.data;
};

export const resolveEvent = async (id) => {
  const res = await api.patch(`/events/${id}/resolve`);
  return res.data;
};

export const getAlerts = async () => {
  const res = await api.get("/events/alerts");
  return res.data;
};

export const getViolationsByZone = async () => {
  const res = await api.get("/analytics/violations-by-zone");
  return res.data;
};

export const getComplianceTrend = async () => {
  const res = await api.get("/analytics/compliance-trend");
  return res.data;
};

export const getPpeViolations = async () => {
  const res = await api.get("/analytics/ppe-violations");
  return res.data;
};

export const getViolationsByCamera = async () => {
  const res = await api.get("/analytics/violations-by-camera");
  return res.data;
};

export const getActiveAlerts = async () => {
  const res = await api.get("/analytics/active-alerts");
  return res.data;
};

export const getViolationsToday = async () => {
  const res = await api.get("/analytics/violations-today");
  return res.data;
};

export const getHighSeverityAlerts = async () => {
  const res = await api.get("/analytics/high-severity-alerts");
  return res.data;
};

export const getZonesBreached = async () => {
  const res = await api.get("/analytics/zones-breached");
  return res.data;
};

export const getSystemHealth = async () => {
  const res = await api.get("/analytics/system-health");
  return res.data;
};

export default api;






// const BASE_URL = "http://localhost:5000";
// export const getPpeOverview = async () => {
//     const res = await fetch(`${BASE_URL}/analytics/ppe-overview`);
//     if (!res.ok) throw new Error("Failed to fetch");
//     return res.json();
//   };
// export const getRecentEvents = async () => {
//     const res = await fetch(`${BASE_URL}/events/recent`);
//     if (!res.ok) throw new Error("Failed to fetch events");
//     return res.json();

//   };
  
// export const resolveEvent = async (id) => {
//   const res = await fetch(`${BASE_URL}/events/${id}/resolve`, {
//     method: "PATCH"
//   });

//   if (!res.ok) {
//     throw new Error("Failed to resolve event");
//   }

//   return res.json();
// };

// export const getAlerts = async () => {
//     const res = await fetch(`${BASE_URL}/events/alerts`);
//     if (!res.ok) {
//        throw new Error("Failed to fetch alerts");
//     }
//     return res.json();
//  };


// export const getViolationsByZone = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/violations-by-zone`);
//   if (!res.ok) throw new Error("Failed to fetch zone violations");
//   return res.json();
// };

// export const getComplianceTrend = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/compliance-trend`);
//   if (!res.ok) throw new Error("Failed to fetch compliance trend");
//   return res.json();
// };

// export const getPpeViolations = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/ppe-violations`)
//   if (!res.ok) throw new Error("Failed to fetch PPE violations")
//   return res.json()
// }

// export const getViolationsByCamera = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/violations-by-camera`)
//   if (!res.ok) throw new Error("Failed to fetch camera violations")
//   return res.json()
// }

// export const getActiveAlerts = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/active-alerts`);
//   if (!res.ok) throw new Error("Failed to fetch active alerts");
//   return res.json();
// };

// export const getViolationsToday = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/violations-today`);
//   if (!res.ok) throw new Error("Failed to fetch today's violations");
//   return res.json();
// };

// export const getHighSeverityAlerts = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/high-severity-alerts`);
//   if (!res.ok)
//     throw new Error("Failed to fetch high severity alerts");
//   return res.json();
// };

// export const getZonesBreached = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/zones-breached`);
//   if (!res.ok)
//     throw new Error("Failed to fetch zones breached");
//   return res.json();
// };

// export const getSystemHealth = async () => {
//   const res = await fetch(`${BASE_URL}/analytics/system-health`);
//   if (!res.ok) throw new Error("Failed to fetch system health");

//   return res.json();
// };

