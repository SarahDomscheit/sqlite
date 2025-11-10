import { Request, Response } from "express";
import { getAllPosts } from "../models/blogEntriesModel";

export const homeController = async (req: Request, res: Response) => {
  const posts = await getAllPosts();
  res.render("index.njk", { posts });
};
