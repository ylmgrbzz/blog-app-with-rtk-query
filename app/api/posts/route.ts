import { NextResponse } from "next/server";
import connectDB from "../../utils/mongodb";
import Post from "@/app/models/Post";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("_page") || "1");
    const limit = parseInt(searchParams.get("_limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Arama sorgusu oluştur
    const searchQuery = search
      ? {
          isActive: true,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
          ],
        }
      : { isActive: true };

    const [posts, total] = await Promise.all([
      Post.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(searchQuery),
    ]);

    return NextResponse.json({
      data: posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Posts getirme hatası:", error);
    return NextResponse.json(
      { error: "Gönderiler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const post = await Post.create({
      ...body,
      isActive: true,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Post oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Gönderi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
