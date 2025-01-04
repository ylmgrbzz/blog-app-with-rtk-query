import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePostRequest {
  title: string;
  content: string;
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
      query: ({ page, limit = 10 }) => ({
        url: "/posts",
        params: {
          _page: page,
          _limit: limit,
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
        body: newPost,
      }),
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        // Geçici bir ID oluştur
        const tempId = Date.now().toString();
        // Optimistic update - UI'a hemen ekle
        const patchResult = dispatch(
          api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
            draft.data.unshift({
              _id: tempId,
              ...newPost,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            draft.total += 1;
            draft.totalPages = Math.ceil(draft.total / 10);
          })
        );
        try {
          const { data: createdPost } = await queryFulfilled;
          // Başarılı olduğunda geçici post'u gerçek post ile değiştir
          dispatch(
            api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
              const tempPost = draft.data.find((post) => post._id === tempId);
              if (tempPost) {
                Object.assign(tempPost, createdPost);
              }
            })
          );
        } catch {
          // Hata durumunda değişiklikleri geri al
          patchResult.undo();
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

    // Post sil
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update - UI'dan hemen kaldır
        const patchResult = dispatch(
          api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
            draft.data = draft.data.filter((post) => post._id !== id);
            draft.total -= 1;
            draft.totalPages = Math.ceil(draft.total / 10);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Hata durumunda değişiklikleri geri al
          patchResult.undo();
        }
      },
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
