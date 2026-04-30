export type ParsedLineItem = {
  rawName: string;
  normalizedName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isDiscount: boolean;
};

export type ParsedReceipt = {
  storeName: string;
  items: ParsedLineItem[];
  totalAmount: number;
};

const IGNORED_KEYWORDS = [
  'summe',
  'total',
  'gesamt',
  'zwischensumme',
  'subtotal',
  'mwst',
  'mwst.',
  'ust',
  'steuer',
  'tax',
  'vat',
  'gegeben',
  'bar',
  'karte',
  'ec',
  'visa',
  'mastercard',
  'rückgeld',
  'rueckgeld',
  'wechselgeld',
  'change',
  'bon',
  'beleg',
  'rechnung',
  'quittung',
  'vielen dank',
  'danke',
  'thank you',
  'pfand',
  'deposit',
  'rabatt',
  'discount',
  'gutschein',
  'coupon',
];

const PRICE_PATTERN = /(-?\d{1,4}[.,]\d{2})\s*[€$]?\s*$/;
const QUANTITY_PREFIX_PATTERN = /^(\d+)\s*[xX×]\s*/;
const WEIGHT_PATTERN = /(\d+[.,]\d+)\s*(kg|g|l|ml)\s+/i;
const SIZE_SUFFIX_PATTERN = /\s+\d+[.,]?\d*\s*(ml|l|g|kg|cl|x|pcs|stk)\.?$/i;

function parsePrice(raw: string): number {
  return parseFloat(raw.replace(',', '.'));
}

function normalizeName(raw: string): string {
  return raw
    .replace(SIZE_SUFFIX_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function isIgnoredLine(line: string): boolean {
  const lower = line.toLowerCase().trim();
  return IGNORED_KEYWORDS.some((kw) => lower.startsWith(kw) || lower === kw);
}

function extractStoreName(lines: string[]): string {
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && !PRICE_PATTERN.test(trimmed)) {
      return trimmed;
    }
  }
  return 'Unbekannt';
}

function extractTotal(lines: string[]): number {
  for (const line of [...lines].reverse()) {
    const lower = line.toLowerCase();
    if (lower.includes('summe') || lower.includes('total') || lower.includes('gesamt')) {
      const match = line.match(PRICE_PATTERN);
      if (match) return parsePrice(match[1]);
    }
  }
  return 0;
}

function parseLine(line: string): ParsedLineItem | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 3) return null;
  if (isIgnoredLine(trimmed)) return null;

  const priceMatch = trimmed.match(PRICE_PATTERN);
  if (!priceMatch) return null;

  const priceStr = priceMatch[1];
  const price = parsePrice(priceStr);
  const isDiscount = price < 0;

  let namePart = trimmed.slice(0, trimmed.lastIndexOf(priceStr)).trim();
  if (!namePart) return null;

  let quantity = 1;

  const quantityMatch = namePart.match(QUANTITY_PREFIX_PATTERN);
  if (quantityMatch) {
    quantity = parseInt(quantityMatch[1], 10);
    namePart = namePart.replace(QUANTITY_PREFIX_PATTERN, '').trim();
  }

  const weightMatch = namePart.match(WEIGHT_PATTERN);
  if (weightMatch) {
    namePart = namePart.replace(WEIGHT_PATTERN, '').trim();
  }

  if (!namePart || namePart.length < 2) return null;

  const totalPrice = Math.abs(price);
  const unitPrice = quantity > 1 ? totalPrice / quantity : totalPrice;

  return {
    rawName: namePart,
    normalizedName: normalizeName(namePart),
    quantity,
    unitPrice: Math.round(unitPrice * 100) / 100,
    totalPrice,
    isDiscount,
  };
}

export class OcrParserService {
  parse(rawText: string): ParsedReceipt {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const storeName = extractStoreName(lines);
    const totalAmount = extractTotal(lines);

    const items: ParsedLineItem[] = [];
    for (const line of lines) {
      const item = parseLine(line);
      if (item) items.push(item);
    }

    return { storeName, items, totalAmount };
  }
}

export const ocrParserService = new OcrParserService();
