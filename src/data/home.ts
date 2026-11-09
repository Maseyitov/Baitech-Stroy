import type { Slide } from "@/components/common/ImageSlider";
import type { CompareProject } from "@/components/common/CompareSlider";
import type { AccordionItem } from "@/components/common/Accordion";

// Когда будут фото: добавь в slide поле image: '/images/имя.jpg' (файлы кладутся в public/images)

export const INTRO_SLIDES: Slide[] = [
  { caption: "Холл жилого комплекса «Название 1»", tone: "blue" },
  { caption: "Двор жилого комплекса «Название 2»", tone: "green" },
  { caption: "Интерьер квартиры в доме «Название 3»", tone: "dusk" },
  { caption: "Фасад бизнес-центра «Название 4»", tone: "navy" },
];

// Замени этим блок COMPARE_PROJECTS в src/data/home.ts (импорт CompareProject там уже есть)

/**
 * ВРЕМЕННЫЕ фото с picsum.photos: одна и та же картинка,
 * рендер — чёрно-белый, фото — цветное. Так сразу видно, как работает линия.
 * Когда появятся свои фото, пиши так:
 *   { label: 'Фасад', render: '/images/p1-fasad-render.jpg', photo: '/images/p1-fasad-photo.jpg' }
 * (файлы кладутся в public/images). Без render/photo покажется заглушка.
 */
const demo = (key: string, labels: string[]) =>
  labels.map((label, i) => {
    const url = `https://picsum.photos/seed/${key}-${i}/1600/900`;
    return { label, render: `${url}?grayscale`, photo: url };
  });

export const COMPARE_PROJECTS: CompareProject[] = [
  {
    name: "Название 1",
    shots: demo("p1", [
      "Фасад",
      "Двор",
      "Двор",
      "Лобби",
      "Бассейн",
      "Спа",
      "Игровая",
    ]),
  },
  {
    name: "Название 2",
    shots: demo("p2", ["Фасад", "Двор", "Лобби", "Паркинг"]),
  },
  {
    name: "Название 3",
    shots: demo("p3", ["Фасад", "Лобби", "Двор", "Терраса", "Спа"]),
  },
  { name: "Название 4", shots: demo("p4", ["Фасад", "Двор", "Лобби"]) },
  {
    name: "Название 5",
    shots: demo("p5", ["Фасад", "Двор", "Лобби", "Игровая"]),
  },
  { name: "Название 6", shots: demo("p6", ["Фасад", "Двор"]) },
];

export const CARE_ITEMS: AccordionItem[] = [
  {
    title: "Комфорт выбора",
    paragraphs: [
      "На страницах проектов собрана вся информация, а для свободных помещений всегда указана стоимость. Мы не скрываем объекты и не просим звонить, чтобы узнать цену.",
      "У каждой квартиры и коммерческого помещения есть отдельная страница с планировками, видами из окон и подробными характеристиками.",
    ],
  },
  {
    title: "Комфорт общения",
    paragraphs: [
      "В отделе продаж работают внимательные сотрудники, которые хорошо знают рынок и продукт и помогают выбрать оптимальный вариант.",
      "Мы пунктуальны и держим слово. Обсудить вопрос можно в удобном для вас канале, в том числе в мессенджерах.",
    ],
  },
  {
    title: "Быть в курсе",
    paragraphs: [
      "После сделки мы сообщаем о ходе строительства, напоминаем о плановых платежах и спрашиваем ваше мнение. Персональный менеджер остаётся на связи.",
    ],
  },
];

export const TRUST_SLIDES: Slide[] = [
  { caption: "Детская площадка квартала «Название 1»", tone: "green" },
  { caption: "Двор дома «Название 2»", tone: "blue" },
  { caption: "Двор дома «Название 3»", tone: "dusk" },
  { caption: "Входная группа дома «Название 4»", tone: "navy" },
  { caption: "Входная группа дома «Название 5»", tone: "blue" },
];
