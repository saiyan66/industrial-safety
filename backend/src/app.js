import express from "express";
import cors from "cors";
import analyticsroutes from "./modules/analytics/analytics.routes.js";
import eventsRoutes from "./modules/events/events.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();


app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/analytics", analyticsroutes);
app.use("/events", eventsRoutes);
app.use("/auth", authRoutes);

export default app;