import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  getPpeViolations,
  getViolationsByZone,
  getComplianceTrend,
} from "../../../api/api";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import GppBadOutlined from "@mui/icons-material/GppBadOutlined";
import FmdBadOutlined from "@mui/icons-material/FmdBadOutlined";
import "./Charts.css";                     

export default function Charts() {
  const ppeChartRef = useRef(null);
  const zoneChartRef = useRef(null);
  const trendChartRef = useRef(null);

  const [ppeData, setPpeData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [ppe, zones, trend] = await Promise.all([
          getPpeViolations(),
          getViolationsByZone(),
          getComplianceTrend(),
        ]);
        setPpeData(ppe || []);
        setZoneData(zones || []);
        setTrendData(trend || []);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      }
    }
    load();
  }, []);

  // Render charts when data arrives
  useEffect(() => { if (ppeData.length) renderPpeChart(); }, [ppeData]);
  useEffect(() => { if (zoneData.length) renderZoneChart(); }, [zoneData]);
  useEffect(() => { if (trendData.length) renderTrendChart(); }, [trendData]);

  function renderPpeChart() {
    const chart = echarts.init(ppeChartRef.current);
  
    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  
    const option = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: { color: "#111827", fontSize: 13 },
        formatter: "{b}: <b>{c}</b> ({d}%)",
        extraCssText: "box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px;",
      },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 12, color: "#6b7280" },
      },
      series: [
        {
          name: "PPE Violations",
          type: "pie",
          radius: ["52%", "72%"],
          center: ["50%", "45%"],
          itemStyle: {
            borderRadius: 6,
            borderColor: "#fff",
            borderWidth: 3,
          },
          label: {
            formatter: "{b}\n{d}%",
            fontSize: 12,
            lineHeight: 18,
            fontWeight: 500,
            color: "#374151",
          },
          labelLine: {
            length: 10,
            length2: 14,
            lineStyle: { color: "#d1d5db" },
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.12)" },
          },
          data: ppeData.map((item, i) => ({
            name: item.type,
            value: item.count,
            itemStyle: { color: COLORS[i % COLORS.length] },
          })),
        },
      ],
    };
    chart.setOption(option);
  }
  
  function renderZoneChart() {
    const chart = echarts.init(zoneChartRef.current);
  
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "none" },
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: { color: "#111827", fontSize: 13 },
        extraCssText: "box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px;",
        formatter: (params) => `${params[0].name}<br/><b>${params[0].value} violations</b>`,
      },
      grid: { top: 16, left: 40, right: 16, bottom: 36, containLabel: false },
      xAxis: {
        type: "category",
        data: zoneData.map((z) => z.zone_name || `Zone ${z.zone_id}`),
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisTick: { show: false },
        axisLabel: { color: "#6b7280", fontSize: 12 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#9ca3af", fontSize: 12 },
      },
      series: [
        {
          name: "Violations",
          type: "bar",
          data: zoneData.map((z) => ({
            value: z.violations,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#60a5fa" },
                { offset: 1, color: "#3b82f6" },
              ]),
              borderRadius: [6, 6, 0, 0],
            },
          })),
          barWidth: "45%",
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#93c5fd" },
                { offset: 1, color: "#2563eb" },
              ]),
            },
          },
        },
      ],
    };
    chart.setOption(option);
  }
  
  function renderTrendChart() {
    const chart = echarts.init(trendChartRef.current);
  
    const formattedDates = trendData.map((t) => {
      const d = new Date(t.date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });
  
    const values = trendData.map((t) => t.rate);
  
    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: { color: "#111827", fontSize: 13 },
        extraCssText: "box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px;",
        formatter: (params) =>
          `${params[0].axisValue}<br/>Compliance: <b>${params[0].value}%</b>`,
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(59,130,246,0.04)" },
        },
      },
      grid: { top: 16, left: 48, right: 24, bottom: 40, containLabel: false },
      xAxis: {
        type: "category",
        data: formattedDates,
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisTick: { show: false },
        axisLabel: {
          color: "#6b7280",
          fontSize: 12,
          interval: Math.floor(formattedDates.length / 6), // ~6 labels max
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#9ca3af", fontSize: 12, formatter: "{value}%" },
      },
      series: [
        {
          name: "Compliance %",
          type: "bar",
          data: values.map((v) => ({
            value: v,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#60a5fa" },
                { offset: 1, color: "#3b82f6" },
              ]),
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barMaxWidth: 32,
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#93c5fd" },
                { offset: 1, color: "#2563eb" },
              ]),
            },
          },
        },
      ],
    };
    chart.setOption(option);
  }  
  
  

  return (
    <div className="analytics-dashboard">
  
      {/* ── KPI Strip ── */}
      <div className="analytics-kpi-row">
  
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon analytics-kpi-icon--red">
            <CalendarTodayOutlined fontSize="small" />
          </div>
          <div className="analytics-kpi-content">
            <h4>Violations Today</h4>
            <p className="analytics-kpi-value">18</p>
          </div>
        </div>
  
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon analytics-kpi-icon--red">
            <NotificationsActiveOutlined fontSize="small" />
          </div>
          <div className="analytics-kpi-content">
            <h4>Active Alerts</h4>
            <p className="analytics-kpi-value">6</p>
          </div>
        </div>
  
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon analytics-kpi-icon--critical">
            <GppBadOutlined fontSize="small" />
          </div>
          <div className="analytics-kpi-content">
            <h4>High Severity</h4>
            <p className="analytics-kpi-value danger">3</p>
          </div>
        </div>
  
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-icon analytics-kpi-icon--red">
            <FmdBadOutlined fontSize="small" />
          </div>
          <div className="analytics-kpi-content">
            <h4>Zones Breached</h4>
            <p className="analytics-kpi-value">2</p>
          </div>
        </div>
  
      </div>
  
      {/* ── Compliance Trend */}
      <div className="analytics-card trend-card">
        <div className="analytics-card-header">
          <h3>Compliance Trend</h3>
          <span className="analytics-card-sub">Violation rate over time</span>
        </div>
        <div ref={trendChartRef} className="chart-container" />
      </div>
  
      {/* ── Distribution Charts ── */}
      <div className="analytics-row">
  
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>PPE Violations</h3>
            <span className="analytics-card-sub">By violation type</span>
          </div>
          <div ref={ppeChartRef} className="chart-container" />
        </div>
  
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Violations by Zone</h3>
            <span className="analytics-card-sub">Breakdown per area</span>
          </div>
          <div ref={zoneChartRef} className="chart-container" />
        </div>
  
      </div>
  
    </div>
  );
}