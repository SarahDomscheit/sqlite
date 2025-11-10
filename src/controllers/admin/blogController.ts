import { Request, Response } from "express";
import {
  deletePost,
  getAllPosts,
  updatePost,
  createPost,
} from "../../models/blogEntriesModel";

// Show all posts

export const entriesListing = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  res.render("../views/admin/indexPage.njk", { posts });
};

export const updatePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const posts = getAllPosts();
  const updatedPost = updatePost(id, req.body);
  res.json(updatedPost).render("../views/admin/indexPage.njk", { posts });
};

// New Post
export const createPostController = async (req: Request, res: Response) => {
  const newPost = await createPost({
    ...req.body,
    image: "",
  });

  res.status(201).json(newPost);
};

export const deletePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deletePost(id);

  res.redirect("/admin");
};
