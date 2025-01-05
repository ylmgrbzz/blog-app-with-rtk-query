"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPostsQuery } from "./store/services/api";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import Pagination from "./components/Pagination";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const [search, setSearch] = useState(searchQuery);

  const { data, isLoading, error } = useGetPostsQuery({
    page: currentPage,
    search: searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PostForm />

        {/* Arama Formu */}
        <div className="my-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Gönderilerde ara..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ara
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Temizle
              </button>
            )}
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">
            Gönderiler yüklenirken bir hata oluştu.
          </div>
        ) : (
          <>
            <PostList posts={data?.data || []} />
            {data && (
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
