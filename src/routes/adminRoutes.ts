import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  entriesListing,
  saveNewPost,
  updatePost,
} from "../controllers/admin/blogController";

const router = express.Router();

router
  .get("/", entriesListing)

  .get("/create", createPost)

  .post("/create", saveNewPost)

  .get("/edit/:id", editPost)

  .put("/edit/:id", updatePost)

  .delete("/delete/:id", deletePost);

export default router;
