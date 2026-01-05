import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        }
    }

    async getMovieRecommendations(prompt: string) {
        if (!this.model) {
            return {
                text: "I'm currently in 'Demo Mode' as my API key is missing, but I'd recommend 'The Dark Knight' or 'Inception' for a great time!"
            };
        }

        try {
            const result = await this.model.generateContent(`
        You are CinaVerse AI, a helpful movie assistant. 
        User asks: "${prompt}".
        Provide a short, enthusiastic recommendation or answer in plain text. Keep it under 50 words.
      `);
            const response = await result.response;
            return { text: response.text() };
        } catch (error) {
            console.error('AI Error:', error);
            // Fallback for quota limits or network issues
            return { text: "My brain is fuzzy (Network Error), but you can't go wrong with 'The Shawshank Redemption'!" };
        }
    }
}
