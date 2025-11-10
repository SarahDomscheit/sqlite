import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import postRouter from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

app.use(express.static("src/public"));

app.use(postRouter).use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
