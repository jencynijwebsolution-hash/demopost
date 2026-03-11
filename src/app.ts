import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import UserRoutes from "./routes/user/UserRoutes";
import AdminRoutes from "./routes/admin/AdminRoutes";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", UserRoutes);
app.use("/admin", AdminRoutes);

export default app;