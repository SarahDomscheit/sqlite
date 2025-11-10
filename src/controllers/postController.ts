import { Request, Response } from "express";
import { getAllPosts } from "../models/blogEntriesModel";

export const postDetailController = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("postdetail.njk", { post });
};

export const postController = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  const firstPost = posts[0];
  res.render("post.njk", { post: firstPost });
};
