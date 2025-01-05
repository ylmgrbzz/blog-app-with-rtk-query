"use client";

import Link from "next/link";
import { useDeletePostMutation } from "../store/services/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId).unwrap();
    } catch (error) {
      console.error("Post silinirken hata:", error);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {posts.map((post) => (
        <article
          key={post._id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
        >
          <div className="p-6">
            <Link href={`/posts/${post._id}`} className="block">
              <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition duration-200">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Sil
              </button>
              <Link
                href={`/posts/${post._id}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition duration-200"
              >
                Devamını Oku
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
