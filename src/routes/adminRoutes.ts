import express from "express";
import {
  createPostController,
  deletePostController,
  entriesListing,
  showCreatePage,
  showEditPage,
  updatePostController,
} from "../controllers/admin/blogController";

const router = express.Router();

router
  .get("/", entriesListing)

  .get("/create", showCreatePage)
  .post("/create", createPostController)

  .get("/edit/:id", showEditPage)
  .patch("/edit/:id", updatePostController)

  .delete("/delete/:id", deletePostController);

export default router;
