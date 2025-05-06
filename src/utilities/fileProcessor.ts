import Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';

export class FileProcessor {
  private file: Express.Multer.File;

  constructor(file: Express.Multer.File) {
    this.file = file;
  }

  // Identify file type (PDF or image)
  private identifyFileType(buffer: Buffer): string {
    const magicBytes = buffer.slice(0, 4).toString('hex');

    if (magicBytes.startsWith('ffd8')) {
      return 'image'; // JPEG
    } else if (magicBytes.startsWith('2550')) {
      return 'pdf'; // PDF
    }
    return 'unknown';
  }

  // OCR for images
  private async extractTextFromImage(buffer: Buffer): Promise<string> {
    try {
      const result = await Tesseract.recognize(buffer, 'eng', {
        logger: (m) => console.log(m),
      });
      return result.data.text;
    } catch (error) {
      throw new Error('Error extracting text from image: ' + error);
    }
  }

  // Text extraction from PDF
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const pdfData = await pdfParse(buffer);
      return pdfData.text;
    } catch (error) {
      throw new Error('Error extracting text from PDF: ' + error);
    }
  }

  // Main method to extract text based on file type
  public async extractText(): Promise<string> {
    const buffer = this.file.buffer;
    const fileType = this.identifyFileType(buffer);

    if (fileType === 'image') {
      return await this.extractTextFromImage(buffer);
    } else if (fileType === 'pdf') {
      return await this.extractTextFromPdf(buffer);
    } else {
      throw new Error('Unsupported file type');
    }
  }
}
