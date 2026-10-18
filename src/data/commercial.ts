import type { Locale } from '../i18n/ui';
export type CommercialService = 'web' | 'telegram' | 'automation' | 'support';
interface PriceItem {
  id: string;
  service: CommercialService;
  min: number;
  max: number;
  weeks: [number, number];
  title: Record<Locale, string>;
  scope: Record<Locale, string>;
  boundary: Record<Locale, string>;
}
/** Studio estimates, not claimed market averages. Update the shared data for both locales. */
export const pricing: PriceItem[] = [
  {
    id: 'landing',
    service: 'web',
    min: 50000,
    max: 80000,
    weeks: [2, 4],
    title: { ru: 'Лендинг', en: 'Landing page' },
    scope: {
      ru: 'Одна страница до 8 смысловых блоков: структура, адаптивный дизайн, форма заявки и подготовка к запуску.',
      en: 'One page with up to 8 content sections: structure, responsive design, enquiry form and launch preparation.',
    },
    boundary: {
      ru: 'Без личного кабинета, сложного калькулятора и разработки фирменного стиля.',
      en: 'Excludes accounts, complex calculators and brand identity development.',
    },
  },
  {
    id: 'company',
    service: 'web',
    min: 80000,
    max: 150000,
    weeks: [4, 6],
    title: { ru: 'Сайт компании', en: 'Company website' },
    scope: {
      ru: 'До 7 содержательных страниц в одном языке: услуги, работы, о компании и контакты; согласованные формы.',
      en: 'Up to 7 content pages in one language: services, work, about and contact, with agreed enquiry forms.',
    },
    boundary: {
      ru: 'Без товарной базы, личных кабинетов и сложных интеграций. CMS оцениваем отдельно.',
      en: 'Excludes product databases, accounts and complex integrations. CMS work is estimated separately.',
    },
  },
  {
    id: 'catalog',
    service: 'web',
    min: 100000,
    max: 200000,
    weeks: [5, 8],
    title: { ru: 'Сайт-каталог', en: 'Catalog website' },
    scope: {
      ru: 'До 20 категорий, шаблон карточки, навигация и заявки. До 30 готовых товарных карточек для стартового наполнения.',
      en: 'Up to 20 categories, a product template, navigation and enquiries. Initial setup of up to 30 supplied product entries.',
    },
    boundary: {
      ru: 'Корзина, оплата, склад и массовый импорт — отдельный объём. Это не цена полного интернет-магазина.',
      en: 'Cart, payments, warehouse sync and bulk imports are separate work. This is not a full online store price.',
    },
  },
  {
    id: 'bot',
    service: 'telegram',
    min: 45000,
    max: 90000,
    weeks: [3, 5],
    title: { ru: 'Бот для Telegram или MAX', en: 'Telegram or MAX bot' },
    scope: {
      ru: 'Одна платформа — Telegram или MAX. Заявки или запись, уведомления и одна простая связь с таблицей либо CRM.',
      en: 'One platform — Telegram or MAX. Enquiries or bookings, notifications and one simple spreadsheet or CRM connection.',
    },
    boundary: {
      ru: 'Без мини-приложения, сложной оплаты и кабинета персонала. Условия подключения платформы проверяем до старта; её модерация в срок разработки не входит.',
      en: 'Excludes a mini app, complex payments and a staff workspace. Platform connection requirements are reviewed first; its moderation time is outside the development estimate.',
    },
  },
  {
    id: 'miniapp',
    service: 'telegram',
    min: 160000,
    max: 320000,
    weeks: [8, 12],
    title: { ru: 'Первая версия Mini App', en: 'First Mini App release' },
    scope: {
      ru: 'Один основной путь покупателя в Telegram или MAX: интерфейс, серверная часть, бот уведомлений и простой кабинет оператора. Одна платформа.',
      en: 'One core customer journey in Telegram or MAX: interface, backend, notification bot and a simple operator workspace. One platform.',
    },
    boundary: {
      ru: 'Оплату, интеграции и условия подключения фиксируем до старта. Вторая платформа, склад, несколько ролей и аналитика — отдельная оценка.',
      en: 'Payments, integrations and connection requirements are agreed first. A second platform, warehouse workflows, multiple roles and analytics need a separate estimate.',
    },
  },
  {
    id: 'integration',
    service: 'automation',
    min: 30000,
    max: 70000,
    weeks: [2, 4],
    title: { ru: 'Одна интеграция', en: 'One integration' },
    scope: {
      ru: 'Один согласованный сценарий между двумя системами с доступным API: передача данных, обработка ошибок и проверка.',
      en: 'One agreed workflow between two systems with available APIs: data transfer, error handling and verification.',
    },
    boundary: {
      ru: 'Без разработки недостающего API, миграции всей базы и работ на стороне 1С или другого подрядчика.',
      en: 'Excludes building a missing API, full database migration and work inside 1C or another supplier’s system.',
    },
  },
  {
    id: 'improvements',
    service: 'support',
    min: 15000,
    max: 40000,
    weeks: [1, 2],
    title: { ru: 'Пакет доработок', en: 'Improvement package' },
    scope: {
      ru: 'Небольшой согласованный список исправлений, изменений интерфейса или контента существующего сайта либо бота.',
      en: 'A small agreed list of fixes, interface changes or content updates to an existing website or bot.',
    },
    boundary: {
      ru: 'После просмотра исходников. Постоянное сопровождение и новые крупные функции рассчитываем отдельно.',
      en: 'Subject to source review. Ongoing support and major new features are estimated separately.',
    },
  },
];
export const commercialPolicy = { defectDays: 30, teamSize: 2 } as const;
export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-GB', {
    maximumFractionDigits: 0,
  }).format(value);
}
export function priceRange(item: PriceItem, locale: Locale): string {
  return `${formatPrice(item.min, locale)}–${formatPrice(item.max, locale)} ${locale === 'ru' ? '₽' : 'RUB'}`;
}
export function timeRange(item: PriceItem, locale: Locale): string {
  return `${item.weeks[0]}–${item.weeks[1]} ${locale === 'ru' ? 'нед.' : 'weeks'}`;
}
