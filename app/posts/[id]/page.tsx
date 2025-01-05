import PostContent from "./PostContent";

export default function PostPage({ params }: { params: { id: string } }) {
  return <PostContent postId={params.id} />;
}
