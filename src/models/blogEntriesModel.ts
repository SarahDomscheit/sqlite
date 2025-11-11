import { POST } from "../types/Post";

import { generateSlug } from "../utils/generateSlug";
import { getDB } from "../db/database";

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

export const getAllPosts = async (): Promise<Array<POST & { id: string }>> => {
  return await getAllBlogEntries();
};

export const getPost = async (id: string): Promise<POST> => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.get<POST>(
      `SELECT * FROM blog_entries WHERE id = ?`,
      [id],
      (error: Error | null, row: POST) => {
        if (error) {
          reject(error);
        } else if (!row) {
          reject(new Error(`Post with id ${id} not found`));
        } else {
          resolve(row);
        }
      }
    );
  });
};

export const deletePost = async (id: string): Promise<void> => {
  const db = getDB();

  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM blog_entries WHERE id = ?`,
      [id],
      function (error: Error | null) {
        if (error) {
          reject(error);
        } else if (this.changes === 0) {
          reject(new Error(`Post with id ${id} not found`));
        } else {
          resolve();
        }
      }
    );
  });
};

export const createPost = async (
  postData: Omit<POST, "id" | "createdAt">
): Promise<POST> => {
  const db = getDB();
  let slug = generateSlug(postData.title);

  // Prüfe auf eindeutigen Slug
  const posts = await getAllBlogEntries();
  let counter = 1;
  let uniqueSlug = slug;
  while (posts.some((post) => post.id === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const createdAt = Math.floor(Date.now() / 1000);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO blog_entries (id, title, teaser, author, createdAt, image, content) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uniqueSlug,
        postData.title,
        postData.teaser,
        postData.author,
        createdAt,
        postData.image,
        postData.content,
      ],
      function (error: Error | null) {
        if (error) {
          reject(error);
        } else {
          resolve({
            ...postData,
            id: uniqueSlug,
            createdAt: createdAt,
          });
        }
      }
    );
  });
};

export const updatePost = async (
  id: string,
  postData: Partial<Omit<POST, "id" | "createdAt">>
): Promise<POST> => {
  const db = getDB();

  // Hole den aktuellen Post
  const currentPost = await getPost(id);

  let newId = id;
  if (postData.title && postData.title !== currentPost.title) {
    let slug = generateSlug(postData.title);

    const posts = await getAllBlogEntries();
    let counter = 1;
    let uniqueSlug = slug;
    while (posts.some((post) => post.id === uniqueSlug && post.id !== id)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    newId = uniqueSlug;
  }

  const updatedPost: POST = {
    ...currentPost,
    ...postData,
    id: newId,
  };

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE blog_entries 
       SET id = ?, title = ?, teaser = ?, author = ?, image = ?, content = ?
       WHERE id = ?`,
      [
        newId,
        updatedPost.title,
        updatedPost.teaser,
        updatedPost.author,
        updatedPost.image,
        updatedPost.content,
        id,
      ],
      function (error: Error | null) {
        if (error) {
          reject(error);
        } else if (this.changes === 0) {
          reject(new Error(`Post with id ${id} not found`));
        } else {
          resolve(updatedPost);
        }
      }
    );
  });
};
