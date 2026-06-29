export interface SensoryWord {
  text: string;
  sense: string; // '시각' | '청각' | '후각' | '미각' | '촉각'
  description: string;
  glowColor: string;
}

export interface ClassroomObject {
  id: string;
  name: string;
  icon: string;
  senses: {
    sight?: string;
    sound?: string;
    smell?: string;
    taste?: string;
    touch?: string;
  };
  power: {
    sight: number;
    sound: number;
    smell: number;
    touch: number;
    taste: number;
  };
  author?: string;
  isRevealed?: boolean;
}

export interface Topping {
  id: string;
  name: string;
  description: string;
  sense: 'sight' | 'sound' | 'smell' | 'taste' | 'touch';
  powerBonus: number;
  emoji: string;
}

export interface FoodTemplate {
  id: string;
  name: string;
  emoji: string;
  basePower: {
    sight: number;
    sound: number;
    smell: number;
    taste: number;
    touch: number;
  };
  toppings: Topping[];
}

export interface SharedRecipe {
  id: string;
  foodId: string;
  foodName: string;
  foodEmoji: string;
  dishName: string;
  author: string;
  toppings: { name: string; emoji: string; sense: string }[];
  powers: {
    sight: number;
    sound: number;
    smell: number;
    taste: number;
    touch: number;
  };
  likes: number;
  comments: { author: string; text: string; createdAt: string }[];
  createdAt: string;
}

