import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    console.log("🟢 Mongo ya estaba conectado");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("🟢 Mongo conectado correctamente");
  } catch (error) {
    console.error("🔴 Error conectando Mongo:", error);
  }
}