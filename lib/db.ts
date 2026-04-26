import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI no está configurada");
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("🔴 Error conectando Mongo:", error);
    throw new Error("No se pudo conectar a MongoDB");
  }
}
