import { PartOfSpeech } from '../types';
import api from './api';

interface TranslationTemplate {
  prefix: string;
  examples: string[];
}

export const TRANSLATION_TEMPLATES: Record<PartOfSpeech, TranslationTemplate> = {
  [PartOfSpeech.NOUN]: {
    prefix: 'danh từ',
    examples: [
      'The WORD is on the table',
      'I have a WORD',
      'This WORD belongs to me',
    ],
  },
  [PartOfSpeech.VERB]: {
    prefix: 'động từ',
    examples: [
      'I WORD every day',
      'She WORD to school',
      'They WORD together',
    ],
  },
  [PartOfSpeech.ADJECTIVE]: {
    prefix: 'tính từ',
    examples: [
      'The WORD car',
      'She is WORD',
      'It looks WORD',
    ],
  },
  [PartOfSpeech.ADVERB]: {
    prefix: 'trạng từ',
    examples: [
      'He walks WORD',
      'She speaks WORD',
      'They work WORD',
    ],
  },
  [PartOfSpeech.PRONOUN]: {
    prefix: 'đại từ',
    examples: [
      'WORD is mine',
      'Give it to WORD',
      'WORD likes coffee',
    ],
  },
  [PartOfSpeech.PREPOSITION]: {
    prefix: 'giới từ',
    examples: [
      'The book is WORD the table',
      'He walks WORD the park',
      'Put it WORD the box',
    ],
  },
  [PartOfSpeech.CONJUNCTION]: {
    prefix: 'liên từ',
    examples: [
      'I like tea WORD coffee',
      'He runs WORD she walks',
      "It is cold WORD sunny",
    ],
  },
  [PartOfSpeech.INTERJECTION]: {
    prefix: 'thán từ',
    examples: [
      'WORD! That hurts!',
      'WORD! What a surprise!',
      'WORD! Be careful!',
    ],
  },
  [PartOfSpeech.DETERMINER]: {
    prefix: 'từ hạn định',
    examples: [
      'WORD book is interesting',
      'I want WORD coffee',
      'WORD cars are expensive',
    ],
  },
  [PartOfSpeech.OTHER]: {
    prefix: '',
    examples: [],
  },
};

export const translateWithTemplate = async (
  word: string,
  partOfSpeech: PartOfSpeech
): Promise<string> => {
  try {
    const template = TRANSLATION_TEMPLATES[partOfSpeech];
    if (!template.prefix || !template.examples.length) {
      // Nếu không có template, dịch trực tiếp
      const response = await api.post('/translate', {
        text: word,
        from: 'en',
        to: 'vi'
      });
      return response.data.data.text;
    }

    // Tạo các câu ví dụ với từ cần dịch
    const translations = await Promise.all(
      template.examples.map(async example => {
        const response = await api.post('/translate', {
          text: example.replace('WORD', word),
          from: 'en',
          to: 'vi'
        });
        return response.data.data.text;
      })
    );

    // Dịch từ gốc để so sánh
    const originalTranslation = await api.post('/translate', {
      text: word,
      from: 'en',
      to: 'vi'
    });

    console.log("Translation results:", translations);
    console.log("Original translation:", originalTranslation.data.data.text);

    // Hàm trích xuất từ khóa từ câu dịch
    const extractKeyword = (sentence: string, originalWord: string): string[] => {
      // Tách câu thành các từ
      const words = sentence.toLowerCase().split(/\s+/);
      
      // Tìm các từ có độ dài tương tự với từ gốc đã dịch
      const originalLength = originalTranslation.data.data.text.length;
      const lengthThreshold = 3; // Cho phép sai lệch độ dài
      
      return words.filter(word => 
        Math.abs(word.length - originalLength) <= lengthThreshold &&
        !['tôi', 'bạn', 'anh', 'chị', 'họ', 'nó', 'và', 'hoặc', 'này', 'kia', 'một', 'các', 'những', 'là'].includes(word)
      );
    };

    // Trích xuất từ khóa từ mỗi câu dịch
    const extractedWords = translations.flatMap(trans => extractKeyword(trans, word));
    
    // Thêm từ dịch gốc vào danh sách
    extractedWords.push(originalTranslation.data.data.text);

    console.log("Extracted words:", extractedWords);

    // Tìm từ xuất hiện nhiều nhất
    const wordCount = extractedWords.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Lấy từ xuất hiện nhiều nhất
    const mostCommonWord = Object.entries(wordCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];

    return mostCommonWord;
  } catch (error) {
    console.error('Translation error:', error);
    return word;
  }
}; 