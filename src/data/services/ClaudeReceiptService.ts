import * as FileSystem from 'expo-file-system/legacy';
import { ParsedReceipt } from './OcrParserService';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = [
  'You are a receipt parsing specialist.',
  'Respond ONLY with a valid JSON object. No markdown, no explanation, no code fences.',
  'Required format:',
  '{"storeName":"string","totalAmount":0.00,"items":[{"rawName":"string","normalizedName":"string","quantity":1,"unitPrice":0.00,"totalPrice":0.00,"isDiscount":false}]}',
  'Rules:',
  '- rawName and normalizedName must be the EXACT text from the receipt. Do NOT translate, normalize or change the name in any way.',
  '- Ignore lines like tax, total, cash given, change, receipt number',
  '- Discounts/deposits as separate items with isDiscount:true',
  '- Extract quantity from "3x" or "3 Stk"',
].join('\n');

function extractJson(text: string): ParsedReceipt {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON found in response: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text.slice(start, end + 1)) as ParsedReceipt;
}

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
                text: 'Parse this receipt and return JSON only.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const raw: string = data.content[0].text;

    try {
      return extractJson(raw);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to parse Claude response');
    }
  }
}

export const claudeReceiptService = new ClaudeReceiptService();
