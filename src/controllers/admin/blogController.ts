import { Request, Response } from "express";
import {
  deletePost,
  getAllPosts,
  updatePost,
  createPost,
  getPost,
} from "../../models/blogEntriesModel";

// Show all posts

export const entriesListing = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPosts();
    res.render("../views/admin/indexPage.njk", { posts });
  } catch (error) {
    console.error("Error listing posts:", error);
    res.status(500).send("Error Loading Posts");
  }
};

// Show create page
export const showCreatePage = async (req: Request, res: Response) => {
  res.render("../views/admin/createPage.njk");
};

// New Post
export const createPostController = async (req: Request, res: Response) => {
  try {
    await createPost({
      ...req.body,
      image: req.body.image || "/images/",
    });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
};

// Show edit page
export const showEditPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await getPost(id);
    res.render("../views/admin/editPage.njk", { post });
  } catch (error) {
    console.error("Error loading post:", error);
    res.status(404).send("Post not found");
  }
};

// Update Post
export const updatePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await updatePost(id, req.body);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePost(id);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
};
