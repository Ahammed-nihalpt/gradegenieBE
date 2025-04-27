import Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';

export class FileProcessor {
  private files: Express.Multer.File[];

  constructor(files: Express.Multer.File[]) {
    this.files = files;
  }

  // Method to identify the file type based on the file buffer
  private identifyFileType(buffer: Buffer): string {
    const magicBytes = buffer.slice(0, 4).toString('hex');

    if (magicBytes.startsWith('ffd8')) {
      return 'image'; // JPEG image
    } else if (magicBytes.startsWith('2550')) {
      return 'pdf'; // PDF
    }
    return 'unknown';
  }

  // Method to extract text from image using OCR
  private async extractTextFromImage(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      Tesseract.recognize(buffer, 'eng', { logger: (m) => console.log(m) })
        .then(({ data: { text } }) => {
          resolve(text);
        })
        .catch((error) => reject(error));
    });
  }

  // Method to extract text from PDF file
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const pdfData = await pdfParse(buffer);
      return pdfData.text;
    } catch (error) {
      throw new Error('Error extracting text from PDF: ' + error);
    }
  }

  // Method to extract and combine text from all files
  public async extractAndCombineText(): Promise<string> {
    const textPromises: Promise<string>[] = this.files.map(async (file) => {
      const fileType = this.identifyFileType(file.buffer);

      if (fileType === 'image') {
        return this.extractTextFromImage(file.buffer);
      } else if (fileType === 'pdf') {
        return this.extractTextFromPdf(file.buffer);
      } else {
        return ''; // Unknown file type
      }
    });

    try {
      const texts = await Promise.all(textPromises);
      return texts.join(' ');
    } catch (error) {
      throw new Error('Error extracting or combining text: ' + error);
    }
  }
}
