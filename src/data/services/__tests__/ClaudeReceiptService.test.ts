import { ClaudeReceiptService } from '../ClaudeReceiptService';

jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn().mockResolvedValue('base64encodedimage'),
  EncodingType: { Base64: 'base64' },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const validReceipt = {
  storeName: 'REWE',
  totalAmount: 12.5,
  items: [
    {
      rawName: 'Milch 3,5% 1L',
      normalizedName: 'Milch',
      quantity: 2,
      unitPrice: 1.29,
      totalPrice: 2.58,
      isDiscount: false,
    },
    {
      rawName: 'Rabatt Treueaktion',
      normalizedName: 'Rabatt Treueaktion',
      quantity: 1,
      unitPrice: 0.5,
      totalPrice: 0.5,
      isDiscount: true,
    },
  ],
};

function makeApiResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: [{ text: JSON.stringify(body) }] }),
  });
}

describe('ClaudeReceiptService', () => {
  let service: ClaudeReceiptService;

  beforeEach(() => {
    service = new ClaudeReceiptService();
    mockFetch.mockReset();
  });

  it('parses a valid receipt response from Claude', async () => {
    mockFetch.mockReturnValueOnce(makeApiResponse(validReceipt));

    const result = await service.parseReceiptImage('file://test.jpg');

    expect(result.storeName).toBe('REWE');
    expect(result.totalAmount).toBe(12.5);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].normalizedName).toBe('Milch');
    expect(result.items[1].isDiscount).toBe(true);
  });

  it('throws on non-ok API response', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: false, status: 401, json: jest.fn() }));

    await expect(service.parseReceiptImage('file://test.jpg')).rejects.toThrow(
      'Claude API error: 401'
    );
  });

  it('throws when Claude returns invalid JSON', async () => {
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ content: [{ text: 'das ist kein JSON' }] }),
      })
    );

    await expect(service.parseReceiptImage('file://test.jpg')).rejects.toThrow('No JSON found');
  });

  it('sends the image as base64 in the request body', async () => {
    mockFetch.mockReturnValueOnce(makeApiResponse(validReceipt));

    await service.parseReceiptImage('file://test.jpg');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const imageContent = body.messages[0].content[0];
    expect(imageContent.type).toBe('image');
    expect(imageContent.source.type).toBe('base64');
    expect(imageContent.source.data).toBe('base64encodedimage');
  });

  it('uses claude-haiku model', async () => {
    mockFetch.mockReturnValueOnce(makeApiResponse(validReceipt));

    await service.parseReceiptImage('file://test.jpg');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toContain('haiku');
  });
});
