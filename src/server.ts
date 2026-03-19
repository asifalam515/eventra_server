import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { AuthRouter } from "./app/module/Auth/auth.router";
import { eventRouter } from "./app/module/Event/event.router";
const app: Application = express();
const port = 5000; // The port your express server will be running on.

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// routers
app.use("/api/v1/auth", AuthRouter.router);
// events
app.use("/api/v1/event", eventRouter.router);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Eventra Server Started");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
