import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface CreatePostRequest {
  title: string;
  content: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // Tüm postları getir
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Post"],
    }),

    // Tekil post getir
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // Yeni post oluştur
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Post"],
    }),

    // Post güncelle
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Post", id }],
    }),

    // Post sil
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = api;
