import { Vocabulary, User, Achievement, Category, StudySet } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'Professional vocabulary for workplace communication',
    icon: 'briefcase',
    color: 'bg-blue-500',
    vocabularyCount: 120
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Essential words for traveling and tourism',
    icon: 'plane',
    color: 'bg-green-500',
    vocabularyCount: 85
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Modern tech terms and digital vocabulary',
    icon: 'smartphone',
    color: 'bg-purple-500',
    vocabularyCount: 95
  },
  {
    id: 'daily-life',
    name: 'Daily Life',
    description: 'Common words for everyday situations',
    icon: 'home',
    color: 'bg-orange-500',
    vocabularyCount: 150
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Academic and learning-related vocabulary',
    icon: 'book-open',
    color: 'bg-red-500',
    vocabularyCount: 110
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Medical and wellness terminology',
    icon: 'heart',
    color: 'bg-pink-500',
    vocabularyCount: 90
  }
];

export const mockStudySets: StudySet[] = [
  {
    id: 'set-1',
    title: 'Business English Essentials',
    description: 'Essential vocabulary for professional communication in business environments',
    category: 'business',
    level: 'intermediate',
    tags: ['business', 'professional', 'workplace'],
    vocabularyCount: 25,
    createdBy: 'user1',
    isPublic: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: 'set-2',
    title: 'Travel Vocabulary',
    description: 'Must-know words for traveling abroad',
    category: 'travel',
    level: 'beginner',
    tags: ['travel', 'vacation', 'tourism'],
    vocabularyCount: 30,
    createdBy: 'user1',
    isPublic: true,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'set-3',
    title: 'Tech Terms 2024',
    description: 'Latest technology vocabulary and terminology',
    category: 'technology',
    level: 'advanced',
    tags: ['technology', 'AI', 'programming'],
    vocabularyCount: 20,
    createdBy: 'user2',
    isPublic: false,
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-18')
  }
];

export const mockVocabulary: Vocabulary[] = [
  {
    id: '1',
    word: 'resilience',
    pronunciation: '/rɪˈzɪl.i.əns/',
    meaning: 'khả năng phục hồi',
    definition: 'The ability to recover quickly from difficulties',
    example: 'Her resilience helped her overcome the challenges.',
    imageUrl: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=400',
    studySetId: 'set-1',
    createdAt: new Date()
  },
  {
    id: '2',
    word: 'innovation',
    pronunciation: '/ˌɪn.əˈveɪ.ʃən/',
    meaning: 'sự đổi mới',
    definition: 'The introduction of new ideas or methods',
    example: 'The company is known for its innovation in technology.',
    imageUrl: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=400',
    studySetId: 'set-1',
    createdAt: new Date()
  },
  {
    id: '3',
    word: 'wanderlust',
    pronunciation: '/ˈwɒn.də.lʌst/',
    meaning: 'khao khát du lịch',
    definition: 'A strong desire to travel and explore the world',
    example: 'His wanderlust led him to visit 30 countries.',
    imageUrl: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=400',
    studySetId: 'set-2',
    createdAt: new Date()
  },
  {
    id: '4',
    word: 'serendipity',
    pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
    meaning: 'sự tình cờ may mắn',
    definition: 'Pleasant surprise; finding something good without looking for it',
    example: 'Meeting my best friend was pure serendipity.',
    imageUrl: 'https://images.pexels.com/photos/1181307/pexels-photo-1181307.jpeg?auto=compress&cs=tinysrgb&w=400',
    studySetId: 'set-2',
    createdAt: new Date()
  }
];

export const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  level: 12,
  xp: 2450,
  streak: 7,
  totalWordsLearned: 234,
  achievements: [],
  createdAt: new Date()
};

export const mockAchievements: Achievement[] = [
  {
    id: 'first-word',
    title: 'First Word',
    description: 'Learn your first vocabulary word',
    icon: '🎯',
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date()
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    progress: 7,
    maxProgress: 7,
    unlockedAt: new Date()
  },
  {
    id: 'hundred-words',
    title: 'Century Club',
    description: 'Learn 100 vocabulary words',
    icon: '💯',
    progress: 100,
    maxProgress: 100,
    unlockedAt: new Date()
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 50 quizzes with 90% accuracy',
    icon: '🏆',
    progress: 35,
    maxProgress: 50
  },
  {
    id: 'social-learner',
    title: 'Social Learner',
    description: 'Share vocabulary with 10 friends',
    icon: '👥',
    progress: 3,
    maxProgress: 10
  }
];