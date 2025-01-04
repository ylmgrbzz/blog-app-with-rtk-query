"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  useGetPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../../store/services/api";

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id);

  const { data: post, isLoading, error } = useGetPostQuery(postId);
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit moduna geçerken mevcut değerleri form'a doldur
  const handleEditClick = () => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePost({ id: postId, title, content }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Post güncellenirken hata:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(postId).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Post silinirken hata:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Post bulunamadı!</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
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
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-8 whitespace-pre-wrap">
            {post.content}
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sil
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
