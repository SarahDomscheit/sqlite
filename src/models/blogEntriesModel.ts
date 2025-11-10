import data from "../data/posts.json";
import { POST } from "../types/Post";
import { formatDate } from "../utils/formatDate";
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

const FILE_PATH = path.join(__dirname, "..", "data", "posts.json");

export async function getAllBlogEntries(): Promise<POST[] | undefined> {
  try {
    const blogEntries = await readFile(FILE_PATH, { encoding: "utf-8" });

    if (blogEntries.length === 0) {
      return [];
    } else {
      return JSON.parse(blogEntries);
    }
  } catch (error) {
    console.error("Blog entries missing", error);
    return undefined;
  }
}

export const getPosts = async (): Promise<Array<POST & { id: string }>> => {
  const posts = await getAllBlogEntries();

  if (!posts) return [];

  return posts.map((post: POST, index: number) => {
    return {
      ...post,
      createdAt: post.createdAt,
      id: (index + 1).toString(),
    };
  });
};

export const savePosts = async (
  posts: Array<Omit<POST, "createdAt"> & { id: string }>
) => {
  try {
    const postsToSave = posts.map((post) => ({
      title: post.title,
      author: post.author,
      content: post.content,
      teaser: post.teaser,
      image: post.image,
      createdAt: Date.now() / 1000,
    }));

    await writeFile(FILE_PATH, JSON.stringify(postsToSave, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving posts:", error);
    return false;
  }
};
