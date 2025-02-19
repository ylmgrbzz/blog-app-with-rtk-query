import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface CreatePostRequest {
  title: string;
  content: string;
  isActive?: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface GetPostsArgs {
  page: number;
  limit?: number;
  search?: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // Tüm postları getir (Sayfalı)
    getPosts: builder.query<PaginatedResponse<Post>, GetPostsArgs>({
      query: ({ page, limit = 10, search }) => ({
        url: "/posts",
        params: {
          _page: page,
          _limit: limit,
          search,
        },
      }),
      providesTags: ["Post"],
    }),

    // Tekil post getir
    getPost: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // Yeni post oluştur
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: { ...newPost, isActive: true },
      }),
      invalidatesTags: ["Post"],
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        try {
          const { data: createdPost } = await queryFulfilled;

          dispatch(
            api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
              draft.data.unshift(createdPost);
              draft.total += 1;
              draft.totalPages = Math.ceil(draft.total / 10);
            })
          );
        } catch {
          console.log("Error creating post");
        }
      },
    }),

    // Post güncelle
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, "_id">>({
      query: ({ _id, ...patch }) => ({
        url: `/posts/${_id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "Post", id: _id },
      ],
    }),

    // Post sil (soft delete)
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Post", id }, "Post"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
              draft.data = draft.data.filter((post) => post._id !== id);
              draft.total -= 1;
              draft.totalPages = Math.ceil(draft.total / 10);
            })
          );
        } catch {
          console.log("Error deleting post");
          // Hata durumunda bir şey yapma
        }
      },
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
