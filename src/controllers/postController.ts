import { Request, Response } from "express";
import { getPosts } from "../models/blogEntriesModel";

export const postDetailController = async (req: Request, res: Response) => {
  const posts = await getPosts();
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("postdetail.html", { post });
};

export const postController = async (req: Request, res: Response) => {
  const posts = await getPosts();
  const firstPost = posts[0];
  res.render("post.html", { post: firstPost });
};
