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
      'Команда из двух человек: сайты, Telegram и автоматизация. Ориентиры цен и сроков, бесплатный первичный разбор, этапы оплаты и передача исходников.',
    kicker: 'СТУДИЯ / ПОДХОД И УСЛОВИЯ',
    headline: 'Небольшая команда.\nПрямой разговор.\nПонятный результат.',
    intro:
      'Делаем сайты, Telegram-сервисы и связи между рабочими системами. Начинаем с задачи бизнеса, определяем полезный объём и показываем рабочую версию по этапам.',
    teamLabel: 'Два человека. Одна команда.',
    teamText:
      'Работаем вдвоём, полностью удалённо. Напрямую обсуждаем с вами задачу, проектируем и разрабатываем решение. На старте определяем, кто ведёт общение и за какой участок отвечает каждый участник. Дату старта согласуем с учётом текущих проектов.',
    specialties: [
      {
        title: 'Сайты и каталоги',
        text: 'Понятно представить предложение, показать ассортимент и дать посетителю путь к обращению.',
      },
      {
        title: 'Telegram и Mini Apps',
        text: 'Выбор товаров, заявки, заказы и рабочие экраны там, где клиенту удобно пользоваться сервисом.',
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
    paymentTitle: 'Сначала разберёмся. Потом договоримся об оплате.',
    paymentIntro:
      'За первичный аудит и план работ оплату не берём. После начала реализации платёжные точки определяем по согласованию: по ходу проекта, с привязкой к понятным этапам и показу результата.',
    paymentSteps: [
      {
        title: 'Без оплаты за вход',
        text: 'Первичный аудит, обсуждение задачи и план — бесплатно и без обязательства заказывать разработку. Это разбор по доступным материалам; масштабное исследование или отдельный прототип, если понадобятся, согласуем до их выполнения.',
      },
      {
        title: 'Условия — до платного этапа',
        text: 'Суммы, результаты и моменты оплаты записываем заранее. Обязательного процента предоплаты или единой схемы для всех проектов нет.',
      },
      {
        title: 'Новые задачи — по согласованию',
        text: 'Изменение состава, бюджета или графика сначала обсуждаем. Домены, хостинг, подписки и лицензии согласуем отдельно; оплачивать их удобнее с ваших аккаунтов.',
      },
    ],
    assuranceTitle: 'За что отвечаем',
    assurances: [
      {
        title: 'Согласованный объём',
        text: 'Проверяем результат по зафиксированным функциям и критериям приёмки. Если часть задачи требует другого решения, обсуждаем это до изменения объёма.',
      },
      {
        title: `${commercialPolicy.defectDays} дней на наши ошибки`,
        text: `В течение ${commercialPolicy.defectDays} календарных дней после приёмки этапа принимаем сообщения о воспроизводимых ошибках нашей реализации и исправляем их без доплаты в рамках согласованного объёма. Срок исправления согласуем после диагностики. Заявленные в этот период ошибки доводим до исправления, даже если срок окна уже закончился.`,
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
      'Домен, хостинг и аккаунты внешних сервисов оформляем на вашу сторону, где это возможно.',
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
      'A two-person team for websites, Telegram and automation. Budget and timeline estimates, free initial review, agreed payments and source handover.',
    kicker: 'STUDIO / APPROACH AND TERMS',
    headline: 'A small team.\nDirect communication.\nA clear result.',
    intro:
      'We build websites, Telegram services and connections between business systems. We start with your workflow, define a useful scope and show working versions in stages.',
    teamLabel: 'Two people. One team.',
    teamText:
      'We are a team of two working fully remotely. We discuss the task with you directly, plan and build the solution. At the start, we agree who handles communication and each team member’s responsibilities. The start date depends on our existing commitments.',
    specialties: [
      {
        title: 'Websites and catalogs',
        text: 'Present your offer, show your range and give visitors a clear route to an enquiry.',
      },
      {
        title: 'Telegram and Mini Apps',
        text: 'Product selection, enquiries, orders and operational screens in a convenient service interface.',
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
    paymentTitle: 'Understand the task first. Agree payment next.',
    paymentIntro:
      'The initial audit and work plan are free. Once implementation starts, payments are arranged by agreement during the project, linked to clear stages and demonstrated results.',
    paymentSteps: [
      {
        title: 'No charge to get started',
        text: 'The initial audit, task discussion and plan are free, with no obligation to commission development. This is a review of available materials; extensive research or a separate prototype, if needed, is agreed before we undertake it.',
      },
      {
        title: 'Agree before paid work',
        text: 'We record amounts, deliverables and payment points in advance. There is no mandatory deposit percentage or single payment schedule for every project.',
      },
      {
        title: 'Agree changes first',
        text: 'We discuss changes to scope, budget or schedule before proceeding. Domains, hosting, subscriptions and licences are agreed separately and preferably paid through your accounts.',
      },
    ],
    assuranceTitle: 'What we take responsibility for',
    assurances: [
      {
        title: 'The agreed scope',
        text: 'We check the result against recorded features and acceptance criteria. If a task requires a different approach, we discuss it before changing the scope.',
      },
      {
        title: `${commercialPolicy.defectDays}-day defect reporting window`,
        text: `For ${commercialPolicy.defectDays} calendar days after acceptance of a stage, you can report reproducible defects in our implementation for correction at no extra charge within the agreed scope. We agree the fix schedule after diagnosis. Defects reported during that window remain covered until corrected, even if the window has ended.`,
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
