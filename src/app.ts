import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import UserRoutes from "./routes/user/UserRoutes";
import AdminRoutes from "./routes/admin/AdminRoutes";
import DepositeRotues from "./routes/common/DepositeRoutes";
import WithdrawalRoutes from "./routes/common/WithdrawalRoutes";
import WalletRoutes from "./routes/common/WalletRoutes";
import TransactionRoutes from "./routes/common/TransactionRoutes";
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", UserRoutes);
app.use("/admin", AdminRoutes);
app.use("/deposit",DepositeRotues);
app.use("/withdraw",WithdrawalRoutes);
app.use("/wallet",WalletRoutes);
app.use("/transaction",TransactionRoutes)

export default app;