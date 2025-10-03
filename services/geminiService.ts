
import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
import { ModelId } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'imagen-4.0-generate-001';

interface ImagePart {
    data: string; // base64 encoded string
    mimeType: string;
}

export const generateTextStream = async (
    prompt: string,
    onStream: (chunk: string) => void,
    model: ModelId,
    systemInstruction?: string,
    image?: ImagePart
): Promise<void> => {
    try {
        const contents: GenerateContentParameters['contents'] = image 
            ? {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: image.data,
                            mimeType: image.mimeType,
                        },
                    },
                ],
              }
            : prompt;
        
        const actualModelForApi = 'gemini-2.5-flash';

        let finalSystemInstruction = systemInstruction;
        if (model === 'gemini-2.5-pro' && systemInstruction) {
            finalSystemInstruction = `${systemInstruction} IMPORTANT: You are operating in 'Pro' mode. Provide expert-level, detailed, and comprehensive responses. Be thorough and insightful.`;
        }


        const request: GenerateContentParameters = {
            model: actualModelForApi,
            contents,
        };

        if (finalSystemInstruction) {
            request.config = {
                systemInstruction: finalSystemInstruction,
            };
        }

        const response = await ai.models.generateContentStream(request);

        for await (const chunk of response) {
            if (chunk.text) {
                 onStream(chunk.text);
            }
        }
    } catch (error) {
        console.error("Error generating text:", error);
        throw new Error("Failed to generate text response.");
    }
};


export const generateImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: IMAGE_MODEL,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image.");
    }
};
