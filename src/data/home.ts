import type { Locale } from '../i18n/ui';

export interface Service {
  id: 'web' | 'telegram' | 'automation' | 'support';
  title: string;
  task: string;
  includes: string[];
  result: string;
  cta: string;
  example?: { label: string; path: string };
}

interface HomeCopy {
  title: string;
  description: string;
  hero: { label: string; geography: string; kicker: string; lines: string[]; intro: string; cta: string; work: string };
  headings: { workLabel: string; work: string; allWork: string; serviceLabel: string; services: string; serviceIntro: string; studioLabel: string; studio: string; studioText: string; about: string; processLabel: string; process: string; processIntro: string; contactLabel: string; contact: string };
  labels: { case: string; readCase: string; includes: string; result: string; stepResult: string };
  services: Service[];
  steps: { title: string; description: string; output: string }[];
  form: { intro: string; name: string; reply: string; replyHint: string; service: string; serviceEmpty: string; message: string; messageHint: string; submit: string; note: string; direct: string; noScript: string };
}

export const homeCopy: Record<Locale, HomeCopy> = {
  ru: {
    title: 'TRW Studio — сайты, Telegram и автоматизация для бизнеса',
    description: 'Сайты и каталоги, Telegram-боты и Mini Apps, интеграции и поддержка. Проектируем решение под задачи бизнеса и согласуем объём до разработки.',
    hero: {
      label: 'НЕЗАВИСИМАЯ ТЕХНОЛОГИЧЕСКАЯ СТУДИЯ', geography: 'РАБОТАЕМ УДАЛЁННО ПО ВСЕЙ РОССИИ',
      kicker: 'САЙТЫ · TELEGRAM · АВТОМАТИЗАЦИЯ',
      lines: ['Сайты, Telegram', 'и автоматизация', 'для бизнеса.'],
      intro: 'Помогаем представить товары и услуги, принимать заявки и заказы, связать рабочие сервисы. От первой структуры до запуска и дальнейшего развития.',
      cta: 'Обсудить задачу', work: 'Смотреть проекты',
    },
    headings: {
      workLabel: 'РАБОТЫ', work: 'Проекты студии', allWork: 'Все проекты',
      serviceLabel: 'УСЛУГИ', services: 'Что нужно вашему бизнесу?',
      serviceIntro: 'Можно начать с одного сайта или бота. Нужные функции, связи с другими системами и дальнейшее развитие согласуем под вашу задачу.',
      studioLabel: 'СТУДИЯ', studio: 'От задачи бизнеса — к работающему решению.',
      studioText: 'TRW Studio объединяет проектирование, разработку и развитие цифровых сервисов. Разбираемся, как устроена работа клиента, определяем нужный объём и показываем результат по этапам.',
      about: 'О студии', processLabel: 'ПРОЦЕСС', process: 'Понятный результат на каждом этапе.',
      processIntro: 'До начала реализации определяем состав работ и порядок согласований. Объём, сроки и стоимость зависят от задачи и фиксируются для конкретного проекта.',
      contactLabel: 'КОНТАКТЫ', contact: 'Расскажите о своей задаче.',
    },
    labels: { case: 'КЕЙС', readCase: 'Посмотреть проект', includes: 'Что может входить', result: 'Что получите', stepResult: 'Результат этапа' },
    services: [
      { id: 'web', title: 'Сайты и каталоги', task: 'Когда нужно понятно представить компанию, показать ассортимент и дать клиенту удобный способ обратиться.', includes: ['Структура, дизайн и мобильная версия', 'Услуги, товары, категории и поиск по задаче', 'Формы заявок и способы связи', 'Подготовка к публикации и передача'], result: 'Сайт с согласованной структурой, содержанием и рабочими сценариями обращения.', cta: 'Обсудить сайт', example: { label: 'Пример: ПрофиСталь 14', path: '/projects/profistal14/' } },
      { id: 'telegram', title: 'Telegram и Mini Apps', task: 'Когда заявки, заказы или обслуживание клиентов удобнее организовать внутри Telegram.', includes: ['Боты, меню и пользовательские сценарии', 'Каталоги, корзина и оформление заказа', 'Уведомления и рабочие роли', 'Mini App для нужных экранов и действий'], result: 'Бот или Mini App с понятным маршрутом для клиента и согласованными действиями сотрудников.', cta: 'Обсудить Telegram', example: { label: 'Пример: Пекарня Чудес', path: '/projects/pekarnya-chudes/' } },
      { id: 'automation', title: 'Интеграции и автоматизация', task: 'Когда данные приходится переносить вручную, а заявки и уведомления теряются между сервисами.', includes: ['Связь сайта или бота с таблицами и CRM', 'Передача заявок и обновление статусов', 'Уведомления о нужных событиях', 'Проверка ошибок и сценариев восстановления'], result: 'Согласованный обмен данными между выбранными системами. Возможности проверяем по их доступным интерфейсам.', cta: 'Обсудить интеграцию' },
      { id: 'support', title: 'Поддержка и развитие', task: 'Когда сайт или сервис уже есть, но нужны исправления, обновления или новые функции.', includes: ['Разбор текущего состояния и приоритетов', 'Исправление ошибок и неудобных сценариев', 'Обновление содержания и интерфейса', 'Развитие функций с проверкой изменений'], result: 'Проверенные изменения и понятный список следующих шагов для существующего продукта.', cta: 'Обсудить доработку' },
    ],
    steps: [
      { title: 'Разбираемся в задаче', description: 'Обсуждаем аудиторию, текущую работу, ограничения и то, что нужно изменить.', output: 'Согласованный состав работ, границы проекта и порядок этапов.' },
      { title: 'Проектируем решение', description: 'Собираем структуру, пользовательские сценарии и направление оформления.', output: 'Структура и прототип или макеты, на которые можно опираться при разработке.' },
      { title: 'Разрабатываем и проверяем', description: 'Реализуем согласованные функции и проверяем основные маршруты на разных размерах экрана.', output: 'Рабочая версия для просмотра, проверки и согласования.' },
      { title: 'Запускаем и передаём', description: 'Готовим публикацию, передаём материалы и объясняем, как работать с результатом.', output: 'Опубликованное решение, необходимые доступы, исходники и инструкции по согласованному объёму.' },
    ],
    form: { intro: 'Опишите задачу своими словами. Форма подготовит сообщение для Telegram — его можно проверить и изменить перед отправкой.', name: 'Имя', reply: 'Как с вами связаться?', replyHint: 'Например, @username или почта', service: 'Направление', serviceEmpty: 'Пока не определился', message: 'Коротко о проекте', messageHint: 'Что уже есть и что хотите сделать?', submit: 'Продолжить в Telegram', note: 'Сообщение откроется в Telegram; отправить его нужно будет вручную.', direct: 'Или напишите нам напрямую в Telegram', noScript: 'Для подготовки сообщения включите JavaScript или воспользуйтесь прямой ссылкой в Telegram ниже.' },
  },
  en: {
    title: 'TRW Studio — websites, Telegram and business automation',
    description: 'Websites and catalogs, Telegram bots and Mini Apps, integrations and ongoing development. We agree on the scope around your business needs.',
    hero: { label: 'INDEPENDENT DIGITAL STUDIO', geography: 'WORKING REMOTELY', kicker: 'WEBSITES · TELEGRAM · AUTOMATION', lines: ['Websites, Telegram', 'and automation', 'for your business.'], intro: 'Present your products and services, receive enquiries and orders, and connect the tools you work with. From the first structure to launch and ongoing development.', cta: 'Discuss your project', work: 'Explore our work' },
    headings: {
      workLabel: 'WORK', work: 'Studio projects', allWork: 'All projects', serviceLabel: 'SERVICES', services: 'What does your business need?',
      serviceIntro: 'Start with a website or a bot. We agree on the features, connections to other systems and future development around your needs.',
      studioLabel: 'STUDIO', studio: 'From a business need to a working solution.', studioText: 'TRW Studio brings together planning, development and ongoing improvement of digital services. We understand how your business works, define the scope and review the result in stages.', about: 'About the studio',
      processLabel: 'PROCESS', process: 'A clear outcome at every stage.', processIntro: 'Before implementation, we define the scope and review process. Timing and cost depend on the task and are agreed for each project.', contactLabel: 'CONTACT', contact: 'Tell us what you have in mind.',
    },
    labels: { case: 'CASE STUDY', readCase: 'Explore the project', includes: 'Possible scope', result: 'What you receive', stepResult: 'Stage outcome' },
    services: [
      { id: 'web', title: 'Websites and catalogs', task: 'For businesses that need to present their company and products clearly and make it easy to get in touch.', includes: ['Structure, design and mobile layouts', 'Services, products, categories and relevant search', 'Enquiry forms and contact options', 'Launch preparation and handover'], result: 'A website with an agreed structure, content and working enquiry flows.', cta: 'Discuss a website', example: { label: 'Example: Profistal14', path: '/projects/profistal14/' } },
      { id: 'telegram', title: 'Telegram and Mini Apps', task: 'For enquiries, orders or customer service that work best inside Telegram.', includes: ['Bots, menus and user flows', 'Catalogs, carts and order placement', 'Notifications and staff roles', 'Mini Apps for the screens and actions you need'], result: 'A bot or Mini App with a clear customer journey and agreed staff workflows.', cta: 'Discuss Telegram', example: { label: 'Example: Pekarnya Chudes', path: '/projects/pekarnya-chudes/' } },
      { id: 'automation', title: 'Integrations and automation', task: 'For teams that copy data by hand or lose enquiries and notifications between tools.', includes: ['Connect a website or bot to spreadsheets and CRM', 'Transfer enquiries and update statuses', 'Notifications for relevant events', 'Error handling and recovery scenarios'], result: 'Agreed data exchange between selected systems, subject to their available integration interfaces.', cta: 'Discuss an integration' },
      { id: 'support', title: 'Support and development', task: 'For an existing website or service that needs fixes, updates or new features.', includes: ['Review the current state and priorities', 'Fix errors and difficult user flows', 'Update content and interfaces', 'Extend features and verify changes'], result: 'Verified changes and a clear set of next steps for your existing product.', cta: 'Discuss improvements' },
    ],
    steps: [
      { title: 'Understand the task', description: 'Discuss your audience, existing workflows, constraints and what needs to change.', output: 'An agreed scope, project boundaries and sequence of stages.' },
      { title: 'Plan the solution', description: 'Define the structure, user journeys and visual direction.', output: 'An agreed structure and prototype or layouts to guide development.' },
      { title: 'Build and verify', description: 'Implement the agreed features and test the main journeys across screen sizes.', output: 'A working version for review, testing and approval.' },
      { title: 'Launch and hand over', description: 'Prepare the launch, hand over materials and explain how to use the result.', output: 'The published solution, required access, source code and instructions within the agreed scope.' },
    ],
    form: { intro: 'Describe your task in your own words. The form prepares a Telegram message that you can review and edit before sending.', name: 'Name', reply: 'How can we reach you?', replyHint: 'For example, @username or email', service: 'Service', serviceEmpty: 'Not sure yet', message: 'About your project', messageHint: 'What do you have now, and what would you like to build?', submit: 'Continue in Telegram', note: 'The message opens in Telegram. You will need to send it manually.', direct: 'Or message us directly on Telegram', noScript: 'Enable JavaScript to prepare a message, or use the direct Telegram link below.' },
  },
};
