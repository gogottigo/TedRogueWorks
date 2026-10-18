import type { Locale } from '../i18n/ui';
import { commercialPolicy } from './commercial';
interface StudioCopy {
  title: string;
  description: string;
  kicker: string;
  headline: string;
  intro: string;
  teamLabel: string;
  teamText: string;
  specialties: { title: string; text: string }[];
  approachTitle: string;
  principles: { title: string; text: string }[];
  processTitle: string;
  steps: { title: string; text: string; output: string }[];
  paymentTitle: string;
  paymentIntro: string;
  paymentSteps: { title: string; text: string }[];
  assuranceTitle: string;
  assurances: { title: string; text: string }[];
  handoverTitle: string;
  handover: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
}
export const studioCopy: Record<Locale, StudioCopy> = {
  ru: {
    title: 'Студия, стоимость и условия работы — TRW Studio',
    description:
      'Команда из двух человек: сайты, боты для Telegram и MAX, автоматизация. Ориентиры цен и сроков, бесплатный первичный разбор, этапы оплаты и передача исходников.',
    kicker: 'СТУДИЯ / ПОДХОД И УСЛОВИЯ',
    headline: 'Небольшая команда.\nПрямой разговор.\nПонятный результат.',
    intro:
      'Делаем сайты, боты и мини-приложения для Telegram и MAX, связываем рабочие системы. Начинаем с задачи бизнеса, определяем полезный объём и показываем рабочую версию по этапам.',
    teamLabel: 'Два человека. Одна команда.',
    teamText:
      'Работаем вдвоём, полностью удалённо. Напрямую обсуждаем с вами задачу, проектируем и разрабатываем решение. На старте определяем, кто ведёт общение и за какой участок отвечает каждый участник. Дату старта согласуем с учётом текущих проектов.',
    specialties: [
      {
        title: 'Сайты и каталоги',
        text: 'Понятно представить предложение, показать ассортимент и дать посетителю путь к обращению.',
      },
      {
        title: 'Боты для Telegram и MAX',
        text: 'Заявки, заказы и рабочие экраны в Telegram или MAX. Выбираем платформу под задачу.',
      },
      {
        title: 'Интеграции и развитие',
        text: 'Связать данные между сервисами, убрать ручные шаги и доработать существующий продукт.',
      },
    ],
    approachTitle: 'Как принимаем решения',
    principles: [
      {
        title: 'Сначала задача',
        text: 'Уточняем, кто будет пользоваться продуктом и какой рабочий процесс нужно улучшить. Технологии выбираем под этот процесс.',
      },
      {
        title: 'Объём виден заранее',
        text: 'Фиксируем состав этапа, стоимость, срок и признаки готовности. Дополнительные функции сначала оцениваем и согласуем.',
      },
      {
        title: 'Результат можно проверить',
        text: 'Показываем рабочие версии и проверяем согласованные сценарии. Частоту показов определяем в плане проекта.',
      },
    ],
    processTitle: 'От первого сообщения до передачи',
    steps: [
      {
        title: 'Разбор и план',
        text: 'Вы рассказываете о задаче. Мы смотрим доступные материалы, проводим первичный аудит и предлагаем последовательность работ.',
        output: 'Первичный разбор, план, ориентир бюджета и список вопросов — бесплатно.',
      },
      {
        title: 'Согласование',
        text: 'Уточняем функции, материалы, ограничения и доступы. Договариваемся о результате первого этапа и порядке оплаты.',
        output: 'Зафиксированные объём, стоимость, срок и критерии приёмки этапа.',
      },
      {
        title: 'Реализация и проверка',
        text: 'Разрабатываем, показываем результат и собираем обратную связь. Правки в рамках согласованного объёма входят в этап.',
        output: 'Рабочая версия и проверка основных сценариев на согласованных устройствах.',
      },
      {
        title: 'Запуск и передача',
        text: 'После приёмки готовим размещение и передаём материалы завершённого этапа. Объясняем, как пользоваться результатом.',
        output: 'Исходники, необходимые доступы и инструкция в согласованном составе.',
      },
    ],
    paymentTitle: 'Как договоримся об оплате',
    paymentIntro:
      'Порядок и суммы платежей согласуем до начала платного этапа. Платежи по ходу проекта связываем с этапами и показом результата.',
    paymentSteps: [
      {
        title: 'Бесплатный первичный разбор',
        text: 'Аудит по доступным материалам, обсуждение задачи и план — бесплатно, без обязательства заказывать разработку. Отдельное исследование или прототип, если нужны, согласуем заранее.',
      },
      {
        title: 'Условия — до платного этапа',
        text: 'Моменты и суммы платежей по ходу реализации фиксируем заранее. Обязательного процента предоплаты нет.',
      },
      {
        title: 'Новые задачи — по согласованию',
        text: 'Изменения объёма, бюджета и графика сначала согласуем. Домены, хостинг, подписки и лицензии учитываем отдельно.',
      },
    ],
    assuranceTitle: 'За что отвечаем',
    assurances: [
      {
        title: 'Согласованный объём',
        text: 'Проверяем результат по зафиксированным функциям и критериям приёмки. Если часть задачи требует другого решения, обсуждаем это до изменения объёма.',
      },
      {
        title: 'Исправления после сдачи',
        text: `Об ошибках нашей реализации можно сообщить в течение ${commercialPolicy.defectDays} календарных дней после приёмки этапа. Воспроизводимые ошибки в согласованном объёме исправляем бесплатно; срок — после диагностики. Заявленные вовремя ошибки исправим и после окончания этого периода.`,
      },
      {
        title: 'Понятные границы',
        text: 'Новые пожелания и изменения внешних сервисов оцениваем отдельно. Продажи, поисковые позиции и бесперебойность сторонних платформ не обещаем: отвечаем за свою реализацию и согласованные проверки.',
      },
    ],
    handoverTitle: 'Материалы остаются у вас',
    handover: [
      'Исходный код и файлы завершённого этапа в согласованном составе.',
      'Доступы к проекту и инструкция по запуску, обновлению или работе с сервисом.',
      'Домен, хостинг и аккаунты внешних сервисов — на вашей стороне, где это возможно.',
      'Показываем, что сделано, какие есть зависимости и что нужно поддерживать после запуска.',
      'Сторонние библиотеки, материалы и лицензии отмечаем отдельно; дальнейшую поддержку согласуем как отдельную работу.',
    ],
    faqTitle: 'Вопросы до старта',
    faqs: [
      {
        q: 'Сколько будет стоить именно мой проект?',
        a: 'Диапазоны выше помогают спланировать бюджет. После первичного разбора уточним состав этапа и зафиксируем его цену. Если задача выходит за описанные границы, предложим отдельную оценку или меньшую первую версию.',
      },
      {
        q: 'Как считать сроки?',
        a: 'В таблице — календарные недели реализации после согласования объёма, материалов, доступов и даты старта. Ожидание ваших согласований и сторонних подключений может сдвинуть график. Такой сдвиг обсуждаем, а не меняем срок молча.',
      },
      {
        q: 'Нужна ли предоплата?',
        a: 'Первичный аудит и план бесплатны. Для реализации согласуем моменты и суммы платежей по ходу проекта до начала платного этапа. Фиксированного процента предоплаты нет.',
      },
      {
        q: 'Что подготовить?',
        a: 'Коротко опишите задачу, пользователей и текущую проблему. Полезны примеры, логотип, тексты, фотографии и имеющиеся материалы. Что отсутствует и кто это готовит, определим при разборе. Пароли в открытой форме не присылайте.',
      },
      {
        q: 'Сколько правок входит?',
        a: 'Исправления ошибок и правки в пределах согласованного объёма входят в этап. Количество циклов согласования дизайна определяем заранее. Новые разделы и изменение утверждённого сценария сначала оцениваем отдельно.',
      },
      {
        q: 'Можно доработать сайт или бот другого разработчика?',
        a: 'Да, начнём с первичного просмотра доступных исходников и задачи. Затем предложим перечень доработок, бюджет и срок. Если текущая основа ограничивает результат, объясним это до начала реализации.',
      },
      {
        q: 'Делаете ботов для MAX?',
        a: 'Да, разрабатываем ботов и мини-приложения для Telegram и MAX. При разборе выбираем платформу и проверяем условия подключения. Оценка относится к одной платформе; адаптацию для второй согласуем отдельно. Пекарня Чудес в портфолио — кейс Telegram.',
      },
      {
        q: 'Кто будет общаться со мной?',
        a: 'Один из двух участников команды ведёт общение; ответственного определяем на старте. Работаем удалённо, основной контакт — Telegram. Важные решения по объёму, цене и срокам фиксируем письменно.',
      },
      {
        q: 'А после запуска?',
        a: 'Наши воспроизводимые ошибки принимаем к бесплатному исправлению в течение 30 календарных дней после приёмки этапа. Развитие, новые функции и регулярное сопровождение обсуждаем отдельно. Круглосуточное дежурство по умолчанию в проект не входит.',
      },
    ],
    ctaTitle: 'Начнём с вашей задачи.',
    ctaText:
      'Можно без готового ТЗ. Опишите, что уже есть и что должно измениться — первичный разбор и план бесплатны.',
  },
  en: {
    title: 'Studio, pricing and working terms — TRW Studio',
    description:
      'A two-person team for websites, Telegram and MAX bots, and automation. Budget and timeline estimates, free initial review, agreed payments and source handover.',
    kicker: 'STUDIO / APPROACH AND TERMS',
    headline: 'A small team.\nDirect communication.\nA clear result.',
    intro:
      'We build websites, bots and mini apps for Telegram and MAX, and connect business systems. We start with your workflow, define a useful scope and show working versions in stages.',
    teamLabel: 'Two people. One team.',
    teamText:
      'We are a team of two working fully remotely. We discuss the task with you directly, plan and build the solution. At the start, we agree who handles communication and each team member’s responsibilities. The start date depends on our existing commitments.',
    specialties: [
      {
        title: 'Websites and catalogs',
        text: 'Present your offer, show your range and give visitors a clear route to an enquiry.',
      },
      {
        title: 'Telegram and MAX bots',
        text: 'Enquiries, orders and operational screens in Telegram or MAX. We choose the platform around your task.',
      },
      {
        title: 'Integrations and development',
        text: 'Connect data between services, reduce manual steps and improve an existing product.',
      },
    ],
    approachTitle: 'How we make decisions',
    principles: [
      {
        title: 'Start with the task',
        text: 'We clarify who will use the product and which workflow needs to improve. We choose technology to support that workflow.',
      },
      {
        title: 'Agree the scope',
        text: 'We record each stage’s scope, price, schedule and acceptance criteria. Additional features are estimated and agreed first.',
      },
      {
        title: 'Make the result reviewable',
        text: 'We show working versions and test agreed journeys. We set the review schedule in the project plan.',
      },
    ],
    processTitle: 'From first message to handover',
    steps: [
      {
        title: 'Review and plan',
        text: 'You describe the task. We review available materials, carry out an initial audit and propose a sequence of work.',
        output: 'Initial review, plan, budget indication and open questions — free of charge.',
      },
      {
        title: 'Agree the stage',
        text: 'We clarify features, materials, constraints and access. We agree the first stage’s outcome and payment arrangements.',
        output: 'Recorded scope, price, schedule and acceptance criteria.',
      },
      {
        title: 'Build and verify',
        text: 'We build, demonstrate and collect feedback. Revisions within the agreed scope are included in the stage.',
        output: 'A working version with core journeys checked on agreed devices.',
      },
      {
        title: 'Launch and hand over',
        text: 'After acceptance, we prepare deployment and hand over the completed stage’s materials. We explain how to use the result.',
        output: 'Source files, required access and instructions as agreed.',
      },
    ],
    paymentTitle: 'How we agree payment',
    paymentIntro:
      'We agree payment amounts and arrangements before paid work begins. Payments during the project are linked to stages and demonstrated results.',
    paymentSteps: [
      {
        title: 'Free initial review',
        text: 'An audit of available materials, task discussion and plan are free, with no obligation to commission development. Separate research or a prototype, if needed, is agreed first.',
      },
      {
        title: 'Agree before paid work',
        text: 'We record payment points and amounts during implementation in advance. There is no mandatory deposit percentage.',
      },
      {
        title: 'Agree changes first',
        text: 'Scope, budget and schedule changes are agreed first. Domains, hosting, subscriptions and licences are budgeted separately.',
      },
    ],
    assuranceTitle: 'What we take responsibility for',
    assurances: [
      {
        title: 'The agreed scope',
        text: 'We check the result against recorded features and acceptance criteria. If a task requires a different approach, we discuss it before changing the scope.',
      },
      {
        title: 'Corrections after handover',
        text: `Report defects in our implementation within ${commercialPolicy.defectDays} calendar days after stage acceptance. We correct reproducible defects within the agreed scope free of charge, with timing agreed after diagnosis. Defects reported in time remain covered after that period ends.`,
      },
      {
        title: 'Clear boundaries',
        text: 'New requests and changes to third-party services are estimated separately. We do not promise sales, search rankings or third-party uptime: our responsibility is our implementation and the agreed checks.',
      },
    ],
    handoverTitle: 'You keep the materials',
    handover: [
      'Source code and files for the completed stage, as agreed.',
      'Project access and instructions for launch, updates or using the service.',
      'Domain, hosting and third-party accounts set up on your side wherever possible.',
      'An explanation of delivered work, dependencies and maintenance needs.',
      'Third-party libraries, materials and licences identified separately; ongoing support agreed as separate work.',
    ],
    faqTitle: 'Before we start',
    faqs: [
      {
        q: 'What will my project cost?',
        a: 'The ranges above help you plan a budget. After the initial review, we agree a stage’s scope and fixed price. If your task exceeds the stated scope, we offer a separate estimate or a smaller first release.',
      },
      {
        q: 'How are timelines counted?',
        a: 'The table gives calendar weeks of implementation after scope, materials, access and the start date are agreed. Waiting for feedback and third-party connections may shift the schedule. We discuss any shift rather than changing the date silently.',
      },
      {
        q: 'Do you need a deposit?',
        a: 'The initial audit and plan are free. For implementation, payment amounts and points during the project are agreed before the paid stage begins. There is no fixed deposit percentage.',
      },
      {
        q: 'What should I prepare?',
        a: 'Describe the task, users and current problem. Examples, a logo, copy, photographs and existing materials help. We identify missing items and who prepares them during the review. Please do not send passwords through the public form.',
      },
      {
        q: 'How many revisions are included?',
        a: 'Defect corrections and revisions within the agreed scope are included in the stage. We agree the number of design review rounds in advance. New sections or changes to an approved journey are estimated separately first.',
      },
      {
        q: 'Can you improve another developer’s website or bot?',
        a: 'Yes. We start by reviewing the available source and your task. We then propose a list of improvements, budget and timeline. If the existing foundation limits the result, we explain that before implementation.',
      },
      {
        q: 'Do you build bots for MAX?',
        a: 'Yes. We develop bots and mini apps for Telegram and MAX. We choose the platform and check connection requirements during the review. Estimates cover one platform; adapting for a second is agreed separately. Pekarnya Chudes in our portfolio is a Telegram case.',
      },
      {
        q: 'Who will I communicate with?',
        a: 'One of the two team members handles communication; we agree the contact person at the start. We work remotely, primarily through Telegram. Important scope, price and schedule decisions are recorded in writing.',
      },
      {
        q: 'What happens after launch?',
        a: 'Reproducible defects in our work can be reported for free correction within 30 calendar days after stage acceptance. Development, new features and regular support are agreed separately. The default project does not include round-the-clock monitoring.',
      },
    ],
    ctaTitle: 'Let’s start with your task.',
    ctaText:
      'No finished specification needed. Tell us what you have and what needs to change — the initial review and plan are free.',
  },
};
