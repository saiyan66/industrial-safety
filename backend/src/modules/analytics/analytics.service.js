import { getPpeAggregates, getViolationsByZone, getComplianceTrend, getPpeViolations, getViolationsByCamera, getActiveAlertsCount, getViolationsToday, getHighSeverityAlerts, getZonesBreached, getCameraHealthStats, getLastEventTime} from "./analytics.repository.js";

export const fetchPpeOverview = async () => {
  const data = await getPpeAggregates();

  const total = data.total || 0;

  return {
    complianceRate: total ? Math.round((data.compliant / total) * 100) : 0,
    violations: data.violations || 0,
    missingHelmet: data.missingHelmet || 0,
    missingVest: data.missingVest || 0
  };
};

export const fetchViolationsByZone = async () => {
  return await getViolationsByZone();
}

export const fetchComplianceTrend = async () => {
  return await getComplianceTrend();
}

export const fetchPpeViolations = async () => {
  return await getPpeViolations();
}

export const fetchViolationsByCamera = async () => {
  return await getViolationsByCamera()
}

export const fetchActiveAlertsCount = async () => {
  const count = await getActiveAlertsCount();
  return count;
};

export const fetchViolationsToday = async () => {
  const count = await getViolationsToday();
  return count;
};


export const fetchHighSeverityAlerts = async () => {
  const count = await getHighSeverityAlerts();
  return count;
};


export const fetchZonesBreached = async () => {
  const count = await getZonesBreached();
  return count;
};


export const fetchSystemHealth = async () => {

  const stats = await getCameraHealthStats();
  const lastEvent = await getLastEventTime();

  const total = stats.totalCameras || 0;
  const active = stats.activeCameras || 0;
  const offline = stats.offlineCameras || 0;

  const health = total === 0
    ? 0
    : Math.round((active / total) * 100);

    let pipelineStatus = "healthy";

    if (lastEvent) {
  
      const lastEventTime = new Date(lastEvent);
      const now = new Date();
  
      const diffMinutes =
        (now - lastEventTime) / (1000 * 60);
  
      if (diffMinutes > 10) {
        pipelineStatus = "unhealthy";
      }
  
    }

  return {
    totalCameras: total,
    activeCameras: active,
    offlineCameras: offline,
    cameraHealth: health,
    pipelineStatus,
    lastEventTime: lastEvent
  };

};









// export const fetchPpeOverview = async () => {
//     return {
//       totalWorkers: 120,
//       compliantWorkers: 95,
//       violations: 25,
//       missingHelmet: 12,
//       missingVest: 8,
//       missingGloves: 5,
//       complianceRate: 79
//     };
//   };