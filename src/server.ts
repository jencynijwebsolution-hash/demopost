import { initsocket } from "./socket";
import { sequelize } from "./config/database";
import http from "http";
import express from "express";
import app from "./app";

const PORT_API = process.env.PORT || 3000;
const PORT2_SOCKET = 4000;

const apiServer = http.createServer(app);

const socketApp = express();
const socketServer = http.createServer(socketApp);

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("🌟 backend has been connected successfully .");
});

(async () => {
    try {

        await Promise.all([sequelize.authenticate()]);
        console.log("✅ Database connected successfully");

        await sequelize.sync({ alter: true });
        console.log("✅ Models synchronized");

        initsocket(socketServer);
        console.log("socket initialized");

        apiServer.listen(PORT_API, () => {
            console.log(`API server running at http://localhost:${PORT_API}`);
        });

        socketServer.listen(PORT2_SOCKET, () => {
            console.log(`Socket Server running at http://localhost:${PORT2_SOCKET}`);
        });

    } catch (error) {
        console.error("❌ Unable to connect to database:", error);
        process.exit(1);
    }
})();

