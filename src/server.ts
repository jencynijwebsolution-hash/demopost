import { initsocket } from "./socket";
import { sequelize } from "./config/database";
import http from "http";
import express from "express";
import app from "./app";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("🌟 backend has been connected successfully .");
});

(async () => {
    try {

        await Promise.all([sequelize.authenticate()]);
        console.log("✅ Database connected successfully");

        await sequelize.sync({ alter: true });
        console.log("✅ Models synchronized");

        initsocket(server);
        console.log("socket initialized");

        server.listen(PORT, () => {
            console.log(`server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Unable to connect to database:", error);
        process.exit(1);
    }
})();

