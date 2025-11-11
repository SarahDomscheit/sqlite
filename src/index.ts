import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import postRouter from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";
import { formatDate } from "./utils/formatDate";
import { closeDB, connectDB } from "./db/database";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const env = nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
});

env.addFilter("formatDate", formatDate);
app.set("view engine", "njk");

app.use(express.static("src/public"));

connectDB()
  .then(() => {
    app.use(postRouter).use("/admin", adminRoutes);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Failed to start Database server");
  });

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDB();
  process.exit(0);
});
