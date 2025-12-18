import { StyleOption, SubjectType } from "../types";

export const generateChristmasImage = async (
  base64Image: string,
  style: StyleOption,
  subjectType: SubjectType,
  customPromptText?: string
): Promise<string> => {
  try {
    // IMPORTANTE: Ahora llamamos a la función de Netlify en lugar de hacerlo directamente
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        style,
        subjectType,
        prompt: customPromptText
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const data = await response.json();
    return data.result; // Se espera que la función devuelva la imagen en base64 o URL
  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    throw error;
  }
};
