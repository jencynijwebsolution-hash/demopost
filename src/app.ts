import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import userRoutes from "./routes/user/userRoutes";
import adminRoutes from "./routes/admin/adminRoutes";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

export default app;