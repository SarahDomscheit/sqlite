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

export const getAllPosts = async (): Promise<Array<POST & { id: string }>> => {
  const posts = await getAllBlogEntries();

  if (!posts) return [];

  return posts.map((post, index) => ({
    ...post,
    id: (index + 1).toString(),
  }));
};

export const getPost = async (id: string): Promise<POST> => {
  const posts = await getAllBlogEntries();
  let post = posts.find((post) => post.id === id);

  if (!post) {
    let index = parseInt(id) - 1;
    if (index >= 0 && index < posts.length) {
      post = posts[index];
    }
  }

  if (!post) {
    throw new Error(`Post with id ${id} not found`);
  }

  return post;
};

export const deletePost = async (id: string): Promise<void> => {
  const posts = await getAllBlogEntries();

  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    throw new Error(`Post with id ${id} not found`);
  }

  posts.splice(postIndex, 1);
  await writePosts(posts);
};

export const createPost = async (
  postData: Omit<POST, "id" | "createdAt">
): Promise<POST> => {
  const posts = await getAllBlogEntries();

  const newPost: POST = {
    ...postData,
    id: (posts.length + 1).toString(),
    createdAt: Math.floor(Date.now() / 1000),
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
  const postIndex = parseInt(id) - 1;

  if (postIndex < 0 || postIndex >= posts.length) {
    throw new Error(`Post with id ${id} not found`);
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...postData,
    createdAt: Math.floor(Date.now() / 1000),
  };

  await writePosts(posts);
  return {
    ...posts[postIndex],
    id: id,
  };
};
