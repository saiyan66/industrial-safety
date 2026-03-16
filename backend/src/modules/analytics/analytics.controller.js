import { fetchPpeOverview, fetchViolationsByZone, fetchComplianceTrend, fetchPpeViolations, fetchViolationsByCamera, fetchActiveAlertsCount, fetchViolationsToday ,fetchHighSeverityAlerts, fetchZonesBreached, fetchSystemHealth} from "./analytics.service.js";

export const getPpeOverview = async (req, res) => {
  try {
    const data = await fetchPpeOverview();
    res.json(data);
  } catch (err) {
    console.error("BACKEND ERROR:", err); 
    res.status(500).json({ message: err.message });
  }
};

export const getViolationsByZone = async (req,res)=>{
  try{
    const data = await fetchViolationsByZone()
    res.json(data)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

export const getComplianceTrend = async (req,res)=>{
  try{
    const data = await fetchComplianceTrend()
    res.json(data)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

export const getPpeViolations = async (req,res)=>{
  try{
    const data = await fetchPpeViolations()
    res.json(data)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

export const getViolationsByCamera = async (req,res)=>{
  try{
    const data = await fetchViolationsByCamera()
    res.json(data)
  }catch(err){
    console.error("Camera violations error:", err)
    res.status(500).json({message:err.message})
  }
}

export const getActiveAlerts = async (req, res) => {
  try {
    const count = await fetchActiveAlertsCount();
    res.json({ activeAlerts: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch active alerts" });
  }
};

export const getViolationsTodayCount = async (req, res) => {
  try {
    const count = await fetchViolationsToday();
    res.json({ violationsToday: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch today's violations" });
  }
};


export const getHighSeverityAlertsCount = async (req, res) => {
  try {
    const count = await fetchHighSeverityAlerts();
    res.json({ highSeverity: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch high severity alerts"
    });
  }
};

export const getZonesBreachedCount = async (req, res) => {
  try {
    const count = await fetchZonesBreached();
    res.json({ zonesBreached: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch zones breached"
    });
  }
};

export const getSystemHealth = async (req, res) => {

  try {

    const data = await fetchSystemHealth();
    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch system health"
    });

  }

};