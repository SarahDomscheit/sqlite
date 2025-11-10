import { Request, Response } from "express";
import { getPosts, getAllBlogEntries } from "../models/blogEntriesModel";

export const homeController = (req: Request, res: Response) => {
  getAllBlogEntries();
  const posts = getPosts();
  res.render("index.html", { posts });
};
