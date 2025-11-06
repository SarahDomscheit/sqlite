import "dotenv/config";
import express, { Request, Response } from "express";
import data from "./data/posts.json";
import { POST } from "./types/Post";
import { formatDate } from "./utils/formatDate";
import path from "path";

import nunjucks from "nunjucks";

const app = express();

const port = process.env.PORT || 3000;

nunjucks.configure("src/templates", {
  autoescape: true,
  express: app,
});
app.set("view engine", "html");

app.use(express.static("src/public"));

const getPosts = (): (Omit<POST, "createdAt"> & {
  createdAt: string;
  id: string;
})[] => {
  return data.map((post: POST, index: number) => {
    return {
      ...post,
      createdAt: formatDate(post.createdAt),
      id: (index + 1).toString(),
    };
  });
};

app.get("/", (req: Request, res: Response) => {
  const posts = getPosts();
  res.render("index.html", { posts });
});

app.get("/post/:id", (req: Request, res: Response) => {
  const posts = getPosts();
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("postdetail.html", { post });
});

app.get("/about", (req: Request, res: Response) => {
  res.render("about.html");
});

app.get("/contact", (req: Request, res: Response) => {
  res.render("contact.html");
});

app.get("/post", (req: Request, res: Response) => {
  const posts = getPosts();
  const firstPost = posts[0];
  res.render("post.html", { post: firstPost });
});

app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
