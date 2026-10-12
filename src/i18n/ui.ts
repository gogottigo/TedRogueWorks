export const ui = {
  ru: {
    home: 'Главная',
    about: 'Обо мне',
    projects: 'Проекты',
    blog: 'Блог',
    contact: 'Контакты',
    language: 'English',
    backToBlog: 'Вернуться в блог',
  },
  en: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    blog: 'Blog',
    contact: 'Contact',
    language: 'Русский',
    backToBlog: 'Back to blog',
  },
} as const;

export type Locale = keyof typeof ui;
