import { ClassroomObject, FoodTemplate, SensoryWord } from './types';

export const TOMATO_POEM_WORDS: SensoryWord[] = [
  {
    text: '빨갛게 익은',
    sense: '시각 (눈)',
    description: '눈으로 보는 토마토의 정열적인 색깔!',
    glowColor: 'bg-rose-500 border-rose-600 shadow-rose-500/50 text-white'
  },
  {
    text: '새콤달콤한',
    sense: '미각 (입)',
    description: '입안 침샘을 자극하는 새콤하고 달콤한 맛!',
    glowColor: 'bg-amber-500 border-amber-600 shadow-amber-500/50 text-black'
  },
  {
    text: '탱글탱글한',
    sense: '촉각 (손)',
    description: '손가락으로 겉을 만졌을 때 느껴지는 탄탄하고 매끄러운 느낌!',
    glowColor: 'bg-teal-500 border-teal-600 shadow-teal-500/50 text-white'
  }
];

export const MYSTERY_BOX_ITEMS = [
  {
    id: 'peach',
    name: '복숭아',
    emoji: '🍑',
    hints: [
      '눈을 감고 만지면 보송보송하고 부드러운 솜털이 만져져요. (촉각)',
      '코를 대면 달콤하고 향긋한 과일 향이 솔솔 흘러나와요. (후각)',
      '한 입 깨물면 달콤한 과즙이 입안 가득 주르륵 흘러요! (미각)'
    ],
    acceptedAnswers: ['복숭아', '숭아', '피치', 'peach']
  },
  {
    id: 'potato_chips',
    name: '감자칩',
    emoji: '🥔',
    hints: [
      '손가락으로 집으면 겉에 오돌토돌한 소금 가루가 느껴져요. (촉각)',
      '이로 와작 깨무는 순간 귀에서 바삭바삭! 소리가 나요. (청각)',
      '혀에 닿으면 고소하면서도 짭조름한 소금 맛이 확 느껴져요! (미각)'
    ],
    acceptedAnswers: ['감자칩', '포테이토칩', '포카칩', '감자', '과자', '칩']
  },
  {
    id: 'slime',
    name: '슬라임',
    emoji: '🧪',
    hints: [
      '손으로 꾹꾹 누르면 말랑말랑하고 끈적끈적하게 늘어나요. (촉각)',
      '귀를 대고 조물조물하면 빠작빠작 기포 터지는 소리가 나요. (청각)',
      '상큼하고 달콤한 인공 포도 향기가 은은하게 풍겨요. (후각)'
    ],
    acceptedAnswers: ['슬라임', '액괴', '액체괴물', '액체 괴물', 'slime']
  }
];

export const CLASSROOM_OBJECTS: ClassroomObject[] = [
  {
    id: 'wine_hat',
    name: '멋쟁이 와인색 모자',
    icon: '🧢',
    senses: {
      sight: '따뜻한 와인빛(자주빛)을 띠는 예쁜 모자에요. 올마다 꼼꼼하고 예쁘게 짜여 있어요.',
      sound: '만질 때마다 포근한 천이 슥슥 사각사각 스치는 부드럽고 조용한 소리가 나요.',
      smell: '보송보송 방금 빨래한 듯한 섬유유연제의 포근한 꽃향기가 은은하게 퍼져 나와요.',
      touch: '도톰하고 부드러운 털실로 정성껏 짜여 있어 손끝에 느껴지는 감촉이 아주 폭신하고 따뜻해요.'
    },
    power: {
      sight: 85,
      sound: 40,
      smell: 65,
      touch: 90,
      taste: 0
    }
  },
  {
    id: 'pencil_case',
    name: '내 짝꿍 필통',
    icon: '👝',
    senses: {
      sight: '노란색 바탕에 귀여운 곰돌이 캐릭터가 큼직하게 그려져 있어요.',
      sound: '지퍼를 드르륵드르륵 열고 닫을 때 리드미컬한 소리가 나요.',
      touch: '헝겊으로 만들어져서 만지면 보들보들하고 겉면이 부드러워요.'
    },
    power: {
      sight: 75,
      sound: 80,
      smell: 20,
      touch: 65,
      taste: 5
    }
  },
  {
    id: 'soap_flower',
    name: '분홍색 비누 국화꽃',
    icon: '🌸',
    senses: {
      sight: '연분홍빛 국화 꽃잎이 겹겹이 섬세하게 살아있는 탐스럽고 고운 꽃송이에요.',
      sound: '만져보면 비누 꽃잎들이 부대끼며 사각사각, 바스락바스락 기분 좋은 속삭임이 들려요.',
      smell: '향긋한 비누로 정성스럽게 빚은 꽃송이라서, 코를 대지 않아도 화사하고 향기로운 비누 향이 은은하게 퍼져 나와요.',
      touch: '꽃잎을 조심스레 어루만지면 보들보들하고 촉촉하면서 매끄러운 감촉이 손가락에 느껴져요.'
    },
    power: {
      sight: 95,
      sound: 20,
      smell: 98,
      touch: 85,
      taste: 5
    }
  }
];

export const FOOD_TEMPLATES: FoodTemplate[] = [
  {
    id: 'maratang',
    name: '얼큰 알싸 마라탕',
    emoji: '🍜',
    basePower: { sight: 40, sound: 20, smell: 40, taste: 50, touch: 30 },
    toppings: [
      {
        id: 'm1',
        name: '시각 토핑: 홍고추 고추기름',
        description: '새빨간 국물이 비주얼을 자극해요!',
        sense: 'sight',
        powerBonus: 30,
        emoji: '🌶️'
      },
      {
        id: 'm2',
        name: '청각 토핑: 팽이버섯과 푸주',
        description: '씹을 때마다 뽀드득 꼬들꼬들 소리가 나요!',
        sense: 'sound',
        powerBonus: 35,
        emoji: '🍄'
      },
      {
        id: 'm3',
        name: '후각 토핑: 알싸한 산초 향',
        description: '코가 찡할 만큼 이국적이고 칼칼한 냄새가 나요!',
        sense: 'smell',
        powerBonus: 30,
        emoji: '👃'
      },
      {
        id: 'm4',
        name: '미각 토핑: 불타는 3단계 마라 소스',
        description: '혀끝이 아리면서도 맵고 얼큰해요!',
        sense: 'taste',
        powerBonus: 40,
        emoji: '🔥'
      }
    ]
  },
  {
    id: 'tanghulu',
    name: '달콤 바삭 탕후루',
    emoji: '🍓',
    basePower: { sight: 50, sound: 30, smell: 20, taste: 40, touch: 20 },
    toppings: [
      {
        id: 't1',
        name: '시각 토핑: 반짝반짝 설탕 코팅',
        description: '보석처럼 영롱하게 빛나는 영롱한 비주얼!',
        sense: 'sight',
        powerBonus: 30,
        emoji: '💎'
      },
      {
        id: 't2',
        name: '청각 토핑: 와작와작 ASMR',
        description: '유리를 깨물듯 와작바삭 경쾌한 소리가 울려요!',
        sense: 'sound',
        powerBonus: 45,
        emoji: '⚡'
      },
      {
        id: 't3',
        name: '후각 토핑: 달콤한 딸기 향',
        description: '새콤달콤하고 은은한 설탕 시럽 향이 퍼져요!',
        sense: 'smell',
        powerBonus: 25,
        emoji: '🌸'
      },
      {
        id: 't4',
        name: '미각 토핑: 즙 팡팡 생과일',
        description: '새콤한 생과일과 달콤한 설탕이 어우러져요!',
        sense: 'taste',
        powerBonus: 35,
        emoji: '🍯'
      }
    ]
  },
  {
    id: 'chicken',
    name: '황금빛 와작 치킨',
    emoji: '🍗',
    basePower: { sight: 45, sound: 40, smell: 45, taste: 45, touch: 15 },
    toppings: [
      {
        id: 'c1',
        name: '시각 토핑: 황금빛 튀김옷',
        description: '보기만 해도 고소해 보이는 황금빛 프라이드!',
        sense: 'sight',
        powerBonus: 25,
        emoji: '🌟'
      },
      {
        id: 'c2',
        name: '청각 토핑: 바삭바삭 귓가 울림',
        description: '씹는 입속에서 쿠르릉 바스락 소리가 나요!',
        sense: 'sound',
        powerBonus: 40,
        emoji: '🔊'
      },
      {
        id: 'c3',
        name: '후각 토핑: 고소한 기름 내음',
        description: '온 동네 사람들의 발길을 잡는 압도적인 고소함!',
        sense: 'smell',
        powerBonus: 30,
        emoji: '💨'
      },
      {
        id: 'c4',
        name: '미각 토핑: 겉바속촉 짭조름 육즙',
        description: '한 입 물면 육즙이 쫙 나오고 단짠단짠한 감칠맛!',
        sense: 'taste',
        powerBonus: 35,
        emoji: '💦'
      }
    ]
  },
  {
    id: 'french_fries',
    name: '바삭 짭조름 감자튀김',
    emoji: '🍟',
    basePower: { sight: 40, sound: 35, smell: 40, taste: 40, touch: 15 },
    toppings: [
      {
        id: 'f1',
        name: '시각 토핑: 노릇노릇 황금빛 비주얼',
        description: '갓 튀겨내어 겉이 노랗고 바삭하게 익은 영롱한 빛깔!',
        sense: 'sight',
        powerBonus: 30,
        emoji: '⭐'
      },
      {
        id: 'f2',
        name: '청각 토핑: 와작와작 바삭바삭 소리',
        description: '한 입 물면 머릿속까지 울려 퍼지는 경쾌한 바삭 소리!',
        sense: 'sound',
        powerBonus: 35,
        emoji: '🔊'
      },
      {
        id: 'f3',
        name: '후각 토핑: 고소한 기름과 소금 향',
        description: '후끈한 감자 튀김의 고소하고 짭조름한 냄새가 코를 자극해요!',
        sense: 'smell',
        powerBonus: 30,
        emoji: '👃'
      },
      {
        id: 'f4',
        name: '미각 토핑: 새콤달콤 토마토 케첩',
        description: '짭조름한 감자튀김에 새콤한 케첩이 더해져 감칠맛이 폭발해요!',
        sense: 'taste',
        powerBonus: 35,
        emoji: '🍅'
      }
    ]
  },
  {
    id: 'tteokbokki',
    name: '매콤 달달 국민 떡볶이',
    emoji: '🥘',
    basePower: { sight: 45, sound: 20, smell: 40, taste: 50, touch: 25 },
    toppings: [
      {
        id: 'b1',
        name: '시각 토핑: 빨갛고 윤기 나는 국물',
        description: '붉은 고추장 양념이 자르르 흐르며 군침을 돌게 해요!',
        sense: 'sight',
        powerBonus: 35,
        emoji: '✨'
      },
      {
        id: 'b2',
        name: '청각 토핑: 쩝쩝 쫄깃쫄깃 소리',
        description: '입안 가득 차는 쫀득한 쌀떡을 오물오물 씹는 소리!',
        sense: 'sound',
        powerBonus: 25,
        emoji: '👄'
      },
      {
        id: 'b3',
        name: '후각 토핑: 매콤 달콤 파 기름 향',
        description: '양파와 대파가 맛있게 어우러진 달짝지근하고 매콤한 냄새!',
        sense: 'smell',
        powerBonus: 30,
        emoji: '🌿'
      },
      {
        id: 'b4',
        name: '미각 토핑: 치즈 이불과 매콤 소스',
        description: '매콤하고 달콤한 고추장 베이스에 치즈의 고소한 맛이 환상의 짝꿍!',
        sense: 'taste',
        powerBonus: 40,
        emoji: '🧀'
      }
    ]
  }
];
