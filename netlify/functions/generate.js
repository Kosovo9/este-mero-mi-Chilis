const { GoogleGenerativeAI } = require("@google/genai");

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // En producción, aquí verificaríamos si el usuario realmente pagó (ej. validando un token o session_id)

    try {
        const { prompt, image } = JSON.parse(event.body);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Lógica similar a geminiService.ts pero protegida en el servidor
        const result = await model.generateContent([prompt, image]);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: text }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
