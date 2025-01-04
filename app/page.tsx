"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} from "./store/services/api";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({ title, content }).unwrap();
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Post oluşturulurken hata:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Bir hata oluştu!</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Gönderileri</h1>

      {/* Post Oluşturma Formu */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-lg">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Başlık
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            İçerik
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Gönderi Oluştur
        </button>
      </form>

      {/* Post Listesi */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-500">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <button
              onClick={() => deletePost(post.id)}
              className="text-red-500 hover:text-red-700"
            >
              Sil
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
