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
  const newPost = await createPost({
    ...req.body,
    image: req.body.image || "",
  });

  res.status(201).json(newPost);
  res.redirect("/admin");
};

// Show edit page
export const showEditPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await getPost(id);
  res.render("../views/admin/editPage.njk", { post });
};

// Update Post
export const updatePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedPost = updatePost(id, req.body);
  res.json(updatedPost);
};

export const deletePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deletePost(id);

  res.redirect("/admin");
};
