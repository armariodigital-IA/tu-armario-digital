import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 📍 Recibimos lat y lon desde el frontend
    const { lat, lon } = await req.json();

    console.log("LAT:", lat);
    console.log("LON:", lon);

    console.log("API KEY:", process.env.OPENWEATHER_KEY);
    // 🌤 Obtener clima real
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`
    );

    const weatherData = await weatherRes.json();
    console.log("WEATHER RAW:", weatherData);

    const temperatura = weatherData?.main?.temp;

    // 🏙 Obtener ciudad real con reverse geocoding
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OPENWEATHER_KEY}`
    );

    const geoData = await geoRes.json();
    console.log("GEO RAW:", geoData);

    const ciudad = geoData?.[0]?.name;

    console.log("Ciudad:", ciudad);
    console.log("Temperatura:", temperatura);

    if (!temperatura || !ciudad) {
      return Response.json(
        { error: "Error obteniendo clima o ciudad" },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sos el hermano mayor con buen gusto. Estilo masculino, minimalista, moderno. Habla corto, claro y con personalidad joven. Nada de explicaciones largas. Decí directamente qué ponerse y por qué funciona. Tono canchero pero elegante.",
        },
        {
          role: "user",
          content: `Estoy en ${ciudad}. Hace ${temperatura} grados. Decime el outfit ideal para esta temperatura y mencioná la ciudad al inicio.`,
        },
      ],
    });

    return Response.json({
      outfit: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("ERROR BACKEND:", error);
    return Response.json(
      { error: "Error generando outfit" },
      { status: 500 }
    );
  }
}
