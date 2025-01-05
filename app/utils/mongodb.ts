import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MongoDB URI bulunamadı. Lütfen .env.local dosyasında MONGODB_URI'yi tanımlayın."
  );
}

const MONGODB_URI: string = process.env.MONGODB_URI;

export default async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB bağlantısı başarılı!");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    throw error;
  }
}
