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
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        // Geçici bir ID oluştur
        const tempId = Date.now();
        // Optimistic update - UI'a hemen ekle
        const patchResult = dispatch(
          api.util.updateQueryData("getPosts", undefined, (draft) => {
            draft.unshift({ ...newPost, id: tempId });
          })
        );
        try {
          const { data: createdPost } = await queryFulfilled;
          // Başarılı olduğunda geçici post'u gerçek post ile değiştir
          dispatch(
            api.util.updateQueryData("getPosts", undefined, (draft) => {
              const tempPost = draft.find((post) => post.id === tempId);
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
          api.util.updateQueryData("getPosts", undefined, (draft) => {
            return draft.filter((post) => post.id !== id);
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
