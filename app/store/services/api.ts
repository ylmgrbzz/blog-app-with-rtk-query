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
    baseUrl: "https://jsonplaceholder.typicode.com",
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
      transformResponse(response: Post[], meta) {
        const total = Number(meta?.response?.headers.get("x-total-count") || 0);
        const currentPage = Number(meta?.request?.params?._page || 1);
        const limit = Number(meta?.request?.params?._limit || 10);
        const totalPages = Math.ceil(total / limit);

        return {
          data: response,
          total,
          currentPage,
          totalPages,
        };
      },
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
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        // Geçici bir ID oluştur
        const tempId = Date.now();
        // Optimistic update - UI'a hemen ekle
        const patchResult = dispatch(
          api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
            draft.data.unshift({ ...newPost, id: tempId });
            draft.total += 1;
            draft.totalPages = Math.ceil(draft.total / 10);
          })
        );
        try {
          const { data: createdPost } = await queryFulfilled;
          // Başarılı olduğunda geçici post'u gerçek post ile değiştir
          dispatch(
            api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
              const tempPost = draft.data.find((post) => post.id === tempId);
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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update - UI'dan hemen kaldır
        const patchResult = dispatch(
          api.util.updateQueryData("getPosts", { page: 1 }, (draft) => {
            draft.data = draft.data.filter((post) => post.id !== id);
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
