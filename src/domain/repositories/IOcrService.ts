export interface IOcrService {
  extractText(imageUri: string): Promise<string>;
}
