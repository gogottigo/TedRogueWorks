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
    title: 'TRW Studio — сайты, боты для Telegram и MAX, автоматизация',
    description: 'Сайты и каталоги, боты и мини-приложения для Telegram и MAX, интеграции и поддержка. Проектируем решение под задачи бизнеса и согласуем объём до разработки.',
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
      serviceIntro: 'Выберите задачу — поможем определить подходящий формат.',
      studioLabel: 'СТУДИЯ', studio: 'От задачи бизнеса — к работающему решению.',
      studioText: 'Проектируем и разрабатываем цифровые сервисы для повседневной работы бизнеса — от первой структуры до развития после запуска.',
      about: 'О студии', processLabel: 'ПРОЦЕСС', process: 'Понятный результат на каждом этапе.',
      processIntro: 'До разработки фиксируем объём, бюджет и сроки. Дальше — четыре этапа.',
      contactLabel: 'КОНТАКТЫ', contact: 'Расскажите о своей задаче.',
    },
    labels: { case: 'КЕЙС', readCase: 'Посмотреть проект', includes: 'Что может входить', result: 'Что получите', stepResult: 'Результат этапа' },
    services: [
      { id: 'web', title: 'Сайты и каталоги', task: 'Представить компанию, показать ассортимент и получать обращения.', includes: ['Структура и адаптивный дизайн', 'Услуги или каталог с навигацией', 'Заявки, запуск и передача исходников'], result: 'Сайт с вашим предложением, понятным выбором и формой обращения.', cta: 'Обсудить сайт', example: { label: 'Пример: ПрофиСталь 14', path: '/projects/profistal14/' } },
      { id: 'telegram', title: 'Боты для Telegram и MAX', task: 'Мини-приложения, заявки, запись и заказы в мессенджерах.', includes: ['Бот с меню и нужными сценариями', 'Мини-приложение с каталогом и заказами', 'Уведомления, роли и связь с CRM'], result: 'Обращение из мессенджера попадает сотруднику вместе с данными заказа. Платформу и условия подключения уточним при разборе.', cta: 'Обсудить бота', example: { label: 'Кейс в Telegram: Пекарня Чудес', path: '/projects/pekarnya-chudes/' } },
      { id: 'automation', title: 'Интеграции и автоматизация', task: 'Убрать ручной перенос данных между рабочими сервисами.', includes: ['Связь сайта, бота, таблиц и CRM', 'Передача данных и обновление статусов', 'Обработка ошибок и восстановление'], result: 'Заявки и статусы передаются между системами без повторного ввода. Возможность подключения проверяем до старта.', cta: 'Обсудить интеграцию' },
      { id: 'support', title: 'Поддержка и развитие', task: 'Исправить и развить существующий сайт или сервис.', includes: ['Разбор исходников и приоритетов', 'Исправление ошибок и интерфейса', 'Новые функции с проверкой изменений'], result: 'Проверенная версия с исправлениями и согласованными улучшениями.', cta: 'Обсудить доработку' },
    ],
    steps: [
      { title: 'Разбираемся в задаче', description: 'Обсуждаем аудиторию, текущую работу, ограничения и то, что нужно изменить.', output: 'План работ, бюджет и границы проекта.' },
      { title: 'Проектируем решение', description: 'Собираем структуру, пользовательские сценарии и направление оформления.', output: 'Структура и прототип или макеты будущего продукта.' },
      { title: 'Разрабатываем и проверяем', description: 'Реализуем согласованные функции и проверяем основные маршруты на разных размерах экрана.', output: 'Рабочая версия, проверенная по основным сценариям.' },
      { title: 'Запускаем и передаём', description: 'Готовим публикацию, передаём материалы и объясняем, как работать с результатом.', output: 'Запуск, исходники, доступы и инструкции в согласованном составе.' },
    ],
    form: { intro: 'Опишите задачу своими словами. Форма подготовит сообщение для Telegram — его можно проверить и изменить перед отправкой.', name: 'Имя', reply: 'Как с вами связаться?', replyHint: 'Например, @username или почта', service: 'Направление', serviceEmpty: 'Пока не определился', message: 'Коротко о проекте', messageHint: 'Что уже есть и что хотите сделать?', submit: 'Продолжить в Telegram', note: 'Сообщение откроется в Telegram; отправить его нужно будет вручную.', direct: 'Или напишите нам напрямую в Telegram', noScript: 'Для подготовки сообщения включите JavaScript или воспользуйтесь прямой ссылкой в Telegram ниже.' },
  },
  en: {
    title: 'TRW Studio — websites, Telegram and MAX bots, automation',
    description: 'Websites and catalogs, bots and mini apps for Telegram and MAX, integrations and ongoing development. We agree on the scope around your business needs.',
    hero: { label: 'INDEPENDENT DIGITAL STUDIO', geography: 'WORKING REMOTELY', kicker: 'WEBSITES · TELEGRAM · AUTOMATION', lines: ['Websites, Telegram', 'and automation', 'for your business.'], intro: 'Present your products and services, receive enquiries and orders, and connect the tools you work with. From the first structure to launch and ongoing development.', cta: 'Discuss your project', work: 'Explore our work' },
    headings: {
      workLabel: 'WORK', work: 'Studio projects', allWork: 'All projects', serviceLabel: 'SERVICES', services: 'What does your business need?',
      serviceIntro: 'Choose a task — we will help define the right format.',
      studioLabel: 'STUDIO', studio: 'From a business need to a working solution.', studioText: 'We design and build digital services for everyday business workflows, from the first structure to improvements after launch.', about: 'About the studio',
      processLabel: 'PROCESS', process: 'A clear outcome at every stage.', processIntro: 'We agree on scope, budget and timing before development. Then follow four stages.', contactLabel: 'CONTACT', contact: 'Tell us what you have in mind.',
    },
    labels: { case: 'CASE STUDY', readCase: 'Explore the project', includes: 'Possible scope', result: 'What you receive', stepResult: 'Stage outcome' },
    services: [
      { id: 'web', title: 'Websites and catalogs', task: 'Present your company, show your products and receive enquiries.', includes: ['Structure and responsive design', 'Services or a catalog with navigation', 'Enquiries, launch and source handover'], result: 'A website with your offer, clear choices and an enquiry form.', cta: 'Discuss a website', example: { label: 'Example: Profistal14', path: '/projects/profistal14/' } },
      { id: 'telegram', title: 'Telegram and MAX bots', task: 'Mini apps, enquiries, bookings and orders inside messengers.', includes: ['A bot with menus and user journeys', 'A mini app with catalog and orders', 'Notifications, roles and CRM connections'], result: 'Staff receive messenger enquiries with the order details. We review platform choice and connection requirements first.', cta: 'Discuss a bot', example: { label: 'Telegram case: Pekarnya Chudes', path: '/projects/pekarnya-chudes/' } },
      { id: 'automation', title: 'Integrations and automation', task: 'Replace manual data transfers between your working tools.', includes: ['Connect websites, bots, spreadsheets and CRM', 'Transfer data and update statuses', 'Error handling and recovery'], result: 'Enquiries and statuses move between systems without re-entering them. We check connection feasibility first.', cta: 'Discuss an integration' },
      { id: 'support', title: 'Support and development', task: 'Fix and extend an existing website or service.', includes: ['Review source code and priorities', 'Fix errors and improve interfaces', 'Add features and verify changes'], result: 'A checked release with fixes and agreed improvements.', cta: 'Discuss improvements' },
    ],
    steps: [
      { title: 'Understand the task', description: 'Discuss your audience, existing workflows, constraints and what needs to change.', output: 'A work plan, budget and project boundaries.' },
      { title: 'Plan the solution', description: 'Define the structure, user journeys and visual direction.', output: 'A structure and prototype or layouts for the future product.' },
      { title: 'Build and verify', description: 'Implement the agreed features and test the main journeys across screen sizes.', output: 'A working version checked against the main user journeys.' },
      { title: 'Launch and hand over', description: 'Prepare the launch, hand over materials and explain how to use the result.', output: 'Launch, source code, access and instructions within the agreed scope.' },
    ],
    form: { intro: 'Describe your task in your own words. The form prepares a Telegram message that you can review and edit before sending.', name: 'Name', reply: 'How can we reach you?', replyHint: 'For example, @username or email', service: 'Service', serviceEmpty: 'Not sure yet', message: 'About your project', messageHint: 'What do you have now, and what would you like to build?', submit: 'Continue in Telegram', note: 'The message opens in Telegram. You will need to send it manually.', direct: 'Or message us directly on Telegram', noScript: 'Enable JavaScript to prepare a message, or use the direct Telegram link below.' },
  },
};
