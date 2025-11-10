import express from "express";
import {
  createPostController,
  deletePostController,
  entriesListing,
  updatePostController,
} from "../controllers/admin/blogController";

const router = express.Router();

router
  .get("/", entriesListing)

  .get("/post", createPostController)

  .patch("/post/:id", updatePostController)
  .delete("/post/:id", deletePostController);

export default router;
