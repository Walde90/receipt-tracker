import * as FileSystem from 'expo-file-system/legacy';
import { ParsedReceipt } from './OcrParserService';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `Du bist ein Spezialist für das Auslesen von Kassenzetteln.
Antworte ausschließlich mit einem JSON-Objekt, ohne Markdown-Codeblöcke.
Format:
{
  "storeName": "Name des Geschäfts",
  "totalAmount": 0.00,
  "items": [
    {
      "rawName": "Originaltext vom Bon",
      "normalizedName": "Lesbarer Name",
      "quantity": 1,
      "unitPrice": 0.00,
      "totalPrice": 0.00,
      "isDiscount": false
    }
  ]
}
Regeln:
- Ignoriere Zeilen wie MwSt, Summe, Gegeben, Rückgeld, Bon-Nr
- Rabatte/Pfand als eigene Positionen mit isDiscount: true und negativem Preis
- quantity aus "3x" oder "3 Stk" ableiten
- normalizedName: lesbar, ohne Größenangaben wie "500ml" oder "1kg"`;

export class ClaudeReceiptService {
  async parseReceiptImage(imageUri: string): Promise<ParsedReceipt> {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64,
                },
              },
              {
                type: 'text',
                text: 'Lies diesen Kassenzettel aus und gib die Daten als JSON zurück.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API Fehler: ${response.status}`);
    }

    const data = await response.json();
    const text: string = data.content[0].text;

    try {
      return JSON.parse(text) as ParsedReceipt;
    } catch {
      throw new Error('Claude hat kein gültiges JSON zurückgegeben.');
    }
  }
}

export const claudeReceiptService = new ClaudeReceiptService();
