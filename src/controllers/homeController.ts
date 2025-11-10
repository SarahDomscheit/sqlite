import { Request, Response } from "express";
import { getPosts, getAllBlogEntries } from "../models/blogEntriesModel";

export const homeController = async (req: Request, res: Response) => {
  const posts = await getPosts();
  res.render("index.html", { posts });
};
