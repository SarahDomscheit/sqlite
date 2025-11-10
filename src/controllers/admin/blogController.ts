import { Request, Response } from "express";
import { getPosts, savePosts } from "../../models/blogEntriesModel";
import sanitizeHtml from "sanitize-html";

// Show all posts

export const entriesListing = (req: Request, res: Response) => {
  const posts = getPosts();
  res.render("../views/admin/indexPage.html", { posts });
};

// New Post
export const createPost = (req: Request, res: Response) => {
  res.render("../views/admin/createPage.html");
};

// Save New Post

export const saveNewPost = async (req: Request, res: Response) => {
  const posts = getPosts();

  let imagePath = req.body.image;
  if (imagePath.startsWith("/images/")) {
    imagePath = imagePath.replace("/images/", "");
  }

  const sanitizedContent = sanitizeHtml(req.body.content);

  const newPost = {
    id: (posts.length + 1).toString(),
    title: req.body.title,
    author: req.body.author,
    teaser: req.body.teaser,
    content: sanitizedContent,
    image: imagePath,
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);

  await savePosts(posts);
  res.redirect("/admin");
};

export const editPost = async (req: Request, res: Response) => {
  const posts = getPosts();
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("../views/admin/editPage.html", { post });
};

export const updatePost = async (req: Request, res: Response) => {
  const posts = getPosts();
  const { id } = req.params;
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  const sanitizedContent = sanitizeHtml(req.body.content);

  posts[postIndex] = {
    ...posts[postIndex],
    title: req.body.title,
    author: req.body.author,
    teaser: req.body.teaser,
    content: req.body.content,
    image: req.body.image || "",
  };

  await savePosts(posts);
  res.redirect("/admin");
};

export const deletePost = async (req: Request, res: Response) => {
  const posts = getPosts();
  const { id } = req.params;
  const filtered = posts.filter((post) => post.id !== id);
  await savePosts(filtered);

  res.redirect("/admin");
};
