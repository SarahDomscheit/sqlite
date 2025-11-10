import { POST } from "../types/Post";

import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

const FILE_PATH = path.join(__dirname, "..", "data", "posts.json");

export async function getAllBlogEntries(): Promise<POST[]> {
  try {
    const blogEntries = await readFile(FILE_PATH, { encoding: "utf-8" });

    return JSON.parse(blogEntries);
  } catch (error) {
    console.error("Blog entries missing", error);
    throw error;
  }
}

export const writePosts = async (posts: POST[]): Promise<void> => {
  try {
    await writeFile(FILE_PATH, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Error saving posts:", error);
    throw error;
  }
};

export const getAllPosts = async (): Promise<POST[]> => {
  return await getAllBlogEntries();
};

export const getPost = async (id: string): Promise<POST> => {
  const posts = await getAllBlogEntries();
  const post = posts.find((post) => post.id === id);

  if (!post) {
    throw new Error(`Post with id ${id} not found`);
  }

  return post;
};

export const deletePost = async (id: string): Promise<void> => {
  const posts = await getAllBlogEntries();
  const filteredPosts = posts.filter((post) => post.id !== id);
  await writePosts(filteredPosts);
};

export const createPost = async (
  postData: Omit<POST, "id" | "createdAt">
): Promise<POST> => {
  const posts = await getAllBlogEntries();

  const newPost: POST = {
    ...postData,
    id: (posts.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  await writePosts(posts);

  return newPost;
};

export const updatePost = async (
  id: string,
  postData: Partial<Omit<POST, "id" | "createdAt">>
): Promise<POST> => {
  const posts = await getAllBlogEntries();
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    throw new Error(`Post with id ${id} not found`);
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...postData,
  };

  await writePosts(posts);
  return posts[postIndex];
};
