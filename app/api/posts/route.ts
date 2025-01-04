import { NextResponse } from "next/server";
import connectDB from "@/app/utils/mongodb";
import Post from "@/app/models/Post";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("_page") || "1");
    const limit = parseInt(searchParams.get("_limit") || "10");
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const response = NextResponse.json({
      data: posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    if (body.isActive === undefined) {
      body.isActive = true;
    }
    const post = await Post.create(body);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
