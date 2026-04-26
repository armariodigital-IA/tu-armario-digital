import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthCookieOptions } from "@/lib/auth";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Añadimos jwt para crear el token

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 400 }
      );
    }

    // Crear el JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string, // La clave secreta que pusiste en .env.local
      { expiresIn: "7d" } // El token dura 7 días
    );

    // Configurar la cookie con el token
    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Establecer la cookie 'token' con las opciones necesarias
    response.cookies.set("token", token, getAuthCookieOptions());

    return response;

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}
