import { POST } from "../types/Post";

import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { generateSlug } from "../utils/generateSlug";
import { getDB } from "../db/database";

const FILE_PATH = path.join(__dirname, "..", "data", "posts.json");

/*export async function getAllBlogEntries(): Promise<POST[]> {
  try {
    const blogEntries = await readFile(FILE_PATH, { encoding: "utf-8" });

    return JSON.parse(blogEntries);
  } catch (error) {
    console.error("Blog entries missing", error);
    throw error;
  }
}*/

export async function getAllBlogEntries(): Promise<POST[]> {
  const db = getDB();

  return new Promise((resolve, reject) => {
    db.all<POST>(
      `SELECT * FROM blog_entries`,
      [],
      (error: Error | null, rows: POST[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      }
    );
  });
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

  return posts || [];
};

export const getPost = async (id: string): Promise<POST> => {
  const posts = await getAllBlogEntries();
  let post = posts.find((post) => post.id === id);

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

  let slug = generateSlug(postData.title);

  let counter = 1;
  let uniqueSlug = slug;
  while (posts.some((post) => post.id === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const newPost: POST = {
    ...postData,
    id: uniqueSlug,
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
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    throw new Error(`Post with id ${id} not found`);
  }

  let newId = id;
  if (postData.title && postData.title !== posts[postIndex].title) {
    let slug = generateSlug(postData.title);

    let counter = 1;
    let uniqueSlug = slug;
    while (
      posts.some((post, idx) => post.id === uniqueSlug && idx !== postIndex)
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    newId = uniqueSlug;
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...postData,
    id: newId,
  };

  await writePosts(posts);
  return posts[postIndex];
};
