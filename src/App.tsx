import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  Ear, 
  Hand, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  Trophy, 
  ChefHat, 
  Heart, 
  Smile, 
  RefreshCw,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  User
} from 'lucide-react';
import { TOMATO_POEM_WORDS, MYSTERY_BOX_ITEMS, CLASSROOM_OBJECTS, FOOD_TEMPLATES } from './data';
import { playClick, playSuccess, playIncorrect, playReveal, playFanfare } from './audio';
import { SharedRecipe, ClassroomObject } from './types';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // MathJax typesetting effect on slide change
  useEffect(() => {
    if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
      setTimeout(() => {
        (window as any).MathJax.typesetPromise().catch((err: any) => console.log('MathJax error:', err));
      }, 100);
    }
  }, [currentSlide]);

  const toggleBGM = () => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav'); // Sound backup
      bgmRef.current.loop = true;
    }
    
    // safe alternative fallback sneaky detective music
    if (!bgmRef.current.src || bgmRef.current.src === '') {
      bgmRef.current.src = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8173516.mp3?filename=sneaky-snitch-111003.mp3';
      bgmRef.current.volume = 0.25;
    }

    if (bgmPlaying) {
      bgmRef.current.pause();
      setBgmPlaying(false);
    } else {
      bgmRef.current.play().then(() => {
        setBgmPlaying(true);
      }).catch((e) => {
        console.warn('Audio play block:', e);
      });
    }
    playClick();
  };

  const nextSlide = () => {
    if (currentSlide < 5) {
      setCurrentSlide(currentSlide + 1);
      playClick();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      playClick();
    }
  };

  // State for Slide 1: Mystery Box
  const [selectedMysteryIndex, setSelectedMysteryIndex] = useState(0);
  const [hintStep, setHintStep] = useState(0);
  const [mysteryGuess, setMysteryGuess] = useState('');
  const [mysterySolved, setMysterySolved] = useState(false);
  const [mysteryAttempts, setMysteryAttempts] = useState(0);

  const currentMysteryItem = MYSTERY_BOX_ITEMS[selectedMysteryIndex];

  const handleRevealHint = () => {
    if (hintStep < 3) {
      setHintStep(hintStep + 1);
      playReveal();
    }
  };

  const handleMysterySubmit = (guessText: string) => {
    const isCorrect = currentMysteryItem.acceptedAnswers.some(ans => 
      guessText.toLowerCase().replace(/\s+/g, '').includes(ans)
    );

    if (isCorrect) {
      setMysterySolved(true);
      playSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      playIncorrect();
      setMysteryAttempts(mysteryAttempts + 1);
    }
  };

  const handleMysteryReset = (index: number) => {
    setSelectedMysteryIndex(index);
    setHintStep(0);
    setMysteryGuess('');
    setMysterySolved(false);
    setMysteryAttempts(0);
    playClick();
  };

  // State for Slide 2: Tomato Poem Clicker
  const [clickedPoemWords, setClickedPoemWords] = useState<string[]>([]);
  const [poemSuccess, setPoemSuccess] = useState(false);

  const handlePoemWordClick = (wordText: string, index: number) => {
    if (!clickedPoemWords.includes(wordText)) {
      const newClicked = [...clickedPoemWords, wordText];
      setClickedPoemWords(newClicked);
      playSuccess();
      
      // Localized confetti splash
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.5 }
      });

      if (newClicked.length === TOMATO_POEM_WORDS.length) {
        setPoemSuccess(true);
        setTimeout(() => {
          playSuccess();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#f59e0b', '#14b8a6']
          });
        }, 600);
      }
    }
  };

  const handlePoemReset = () => {
    setClickedPoemWords([]);
    setPoemSuccess(false);
    playClick();
  };

  // State for Slide 3: Classroom Investigation Tabs
  const [classroomObjects, setClassroomObjects] = useState<ClassroomObject[]>([
    ...CLASSROOM_OBJECTS,
    {
      id: 'custom-preset-1',
      name: '말랑말랑 하얀 지우개',
      icon: '🧽',
      senses: {
        sight: '네모나고 양옆에 하얀 가루가 살짝 묻어 있으며, 알록달록 종이 옷을 입고 있어요.',
        sound: '종이에 대고 슥슥슥 빠르게 문지르면 경쾌한 마찰 소리가 나요.',
        touch: '말랑말랑하면서도 손가락 끝으로 누르면 아주 쫀쫀하고 단단한 감촉이 느껴져요.'
      },
      power: { sight: 60, sound: 75, smell: 10, touch: 90, taste: 5 },
      author: '지민 수사관 🕵️‍♂️',
      isRevealed: false
    },
    {
      id: 'custom-preset-2',
      name: '분필',
      icon: '🖍️',
      senses: {
        sight: '길쭉하고 동그란 막대기 모양인데, 요즘 분필은 가루가 많이 날리지 않아서 하얀 가루가 손에 그렇게 많이 묻어나지 않아요.',
        sound: '딱딱한 칠판에 글씨를 적을 때 또각또각, 슥슥 사락사락 정겨운 소리가 나요.',
        touch: '표면은 건조하고 사각사각한데, 요즘 것은 가루가 덜 날려 깔끔하고 힘을 주면 똑 부러져요.'
      },
      power: { sight: 50, sound: 85, smell: 15, touch: 70, taste: 0 },
      author: '은지 수사관 🕵️‍♀️',
      isRevealed: false
    }
  ]);
  const [activeClassroomTab, setActiveClassroomTab] = useState('wine_hat');
  const [investigatedSenses, setInvestigatedSenses] = useState<string[]>([]);

  // Kids input states for custom classroom objects
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [newObjectName, setNewObjectName] = useState('');
  const [newObjectIcon, setNewObjectIcon] = useState('🎒');
  const [newObjectAuthor, setNewObjectAuthor] = useState('');
  const [newObjectSenses, setNewObjectSenses] = useState({
    sight: '',
    sound: '',
    smell: '',
    touch: '',
    taste: ''
  });
  const [newObjectPower, setNewObjectPower] = useState({
    sight: 50,
    sound: 50,
    smell: 50,
    touch: 50,
    taste: 10
  });

  const handleInvestigateSense = (senseKey: string) => {
    const key = `${activeClassroomTab}-${senseKey}`;
    if (!investigatedSenses.includes(key)) {
      setInvestigatedSenses([...investigatedSenses, key]);
      playClick();
    }
  };

  const currentClassroomObject = classroomObjects.find(obj => obj.id === activeClassroomTab) || classroomObjects[0];

  const handleAddNewObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectName.trim()) {
      alert('물건 이름을 입력해 주세요! (예: 노란색 가방)');
      playIncorrect();
      return;
    }
    if (!newObjectAuthor.trim()) {
      alert('출제자 이름을 입력해 주세요!');
      playIncorrect();
      return;
    }
    
    // Check if at least one sensory expression is provided
    const hasSense = 
      newObjectSenses.sight.trim() !== '' ||
      newObjectSenses.sound.trim() !== '' ||
      newObjectSenses.smell.trim() !== '' ||
      newObjectSenses.touch.trim() !== '' ||
      newObjectSenses.taste.trim() !== '';
    if (!hasSense) {
      alert('최소한 하나 이상의 감각적 표현을 입력해 주세요!');
      playIncorrect();
      return;
    }

    const newId = `custom-${Date.now()}`;
    
    // Build senses object dynamically with only filled descriptions
    const senses: Record<string, string> = {};
    if (newObjectSenses.sight.trim()) senses.sight = newObjectSenses.sight.trim();
    if (newObjectSenses.sound.trim()) senses.sound = newObjectSenses.sound.trim();
    if (newObjectSenses.smell.trim()) senses.smell = newObjectSenses.smell.trim();
    if (newObjectSenses.touch.trim()) senses.touch = newObjectSenses.touch.trim();
    if (newObjectSenses.taste.trim()) senses.taste = newObjectSenses.taste.trim();

    const newObj = {
      id: newId,
      name: newObjectName.trim(),
      icon: newObjectIcon,
      senses,
      power: {
        sight: senses.sight ? newObjectPower.sight : 0,
        sound: senses.sound ? newObjectPower.sound : 0,
        smell: senses.smell ? newObjectPower.smell : 0,
        touch: senses.touch ? newObjectPower.touch : 0,
        taste: senses.taste ? newObjectPower.taste : 0,
      },
      author: newObjectAuthor.trim() || '나만의 수사대',
      isRevealed: false
    };

    setClassroomObjects([...classroomObjects, newObj]);
    setActiveClassroomTab(newId);
    setIsAddingObject(false);
    
    // Reset form
    setNewObjectName('');
    setNewObjectIcon('🎒');
    setNewObjectAuthor('나만의 수사대');
    setNewObjectSenses({ sight: '', sound: '', smell: '', touch: '', taste: '' });
    setNewObjectPower({ sight: 50, sound: 50, smell: 50, touch: 50, taste: 10 });
    
    playSuccess();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleRevealClassroomObject = (id: string) => {
    setClassroomObjects(prev => 
      prev.map(obj => {
        if (obj.id === id) {
          playReveal();
          return { ...obj, isRevealed: true };
        }
        return obj;
      })
    );
  };

  // State for Slide 4: Food Recipe Customizer
  const [selectedFoodId, setSelectedFoodId] = useState('maratang');
  const [activeToppings, setActiveToppings] = useState<string[]>([]);
  const [customDishName, setCustomDishName] = useState('');
  const [recipeCompleted, setRecipeCompleted] = useState(false);
  const [recipeAuthor, setRecipeAuthor] = useState('');
  
  // Shared recipes list state
  const [sharedRecipes, setSharedRecipes] = useState<SharedRecipe[]>([
    {
      id: 'default-1',
      foodId: 'maratang',
      foodName: '얼큰 알싸 마라탕',
      foodEmoji: '🍜',
      dishName: '불타는 용암 마라폭발탕',
      author: '민재 탐험가',
      toppings: [
        { name: '시각 토핑: 홍고추 고추기름', emoji: '🌶️', sense: 'sight' },
        { name: '미각 토핑: 불타는 3단계 마라 소스', emoji: '🔥', sense: 'taste' }
      ],
      powers: { sight: 70, sound: 20, smell: 40, taste: 90, touch: 30 },
      likes: 8,
      comments: [
        { author: '하은', text: '헉 너무 매워 보여요! 외계인이 불을 뿜겠어요 🔥', createdAt: '3분 전' },
        { author: '준우', text: '매운맛 3단계라니 대단해! 칭찬합니다 👍', createdAt: '1분 전' }
      ],
      createdAt: '5분 전'
    },
    {
      id: 'default-2',
      foodId: 'tanghulu',
      foodName: '달콤 바삭 탕후루',
      foodEmoji: '🍓',
      dishName: '반짝반짝 달콤 과즙 보석선물',
      author: '서연 탐험가',
      toppings: [
        { name: '시각 토핑: 반짝반짝 설탕 코팅', emoji: '💎', sense: 'sight' },
        { name: '청각 토핑: 와작와작 ASMR', emoji: '⚡', sense: 'sound' },
        { name: '미각 토핑: 즙 팡팡 생과일', emoji: '🍯', sense: 'taste' }
      ],
      powers: { sight: 80, sound: 75, smell: 20, taste: 75, touch: 20 },
      likes: 12,
      comments: [
        { author: '민우', text: '와삭 소리 완전 ASMR 맛집이네요!', createdAt: '10분 전' },
        { author: '소윤', text: '진짜 보석처럼 반짝거려요 ✨', createdAt: '8분 전' }
      ],
      createdAt: '15분 전'
    },
    {
      id: 'default-3',
      foodId: 'tteokbokki',
      foodName: '매콤 달달 국민 떡볶이',
      foodEmoji: '🥘',
      dishName: '치즈이불 덮은 쫀득보들 떡볶이',
      author: '지우 탐험가',
      toppings: [
        { name: '시각 토핑: 빨갛고 윤기 나는 국물', emoji: '✨', sense: 'sight' },
        { name: '미각 토핑: 치즈 이불과 매콤 소스', emoji: '🧀', sense: 'taste' },
        { name: '청각 토핑: 쩝쩝 쫄깃쫄깃 소리', emoji: '👄', sense: 'sound' }
      ],
      powers: { sight: 80, sound: 45, smell: 40, taste: 90, touch: 25 },
      likes: 15,
      comments: [
        { author: '선생님', text: '치즈를 얹으니 매콤달콤 아주 맛있겠네요! 칭찬 스티커 쾅!', createdAt: '20분 전' },
        { author: '다인', text: '오늘 급식 떡볶이보다 훨씬 고품격이에요 😋', createdAt: '18분 전' }
      ],
      createdAt: '25분 전'
    }
  ]);

  // Comment input per shared recipe ID
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  // Comment author input per shared recipe ID (defaults to '탐험친구')
  const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});

  const currentFoodTemplate = FOOD_TEMPLATES.find(f => f.id === selectedFoodId) || FOOD_TEMPLATES[0];

  const handleShareRecipe = () => {
    if (!recipeCompleted) return;
    if (!recipeAuthor.trim()) {
      alert('만든이 이름을 입력해 주세요!');
      playIncorrect();
      return;
    }
    
    // Get currently selected toppings
    const selectedToppingsList = currentFoodTemplate.toppings
      .filter(t => activeToppings.includes(t.id))
      .map(t => ({
        name: t.name,
        emoji: t.emoji,
        sense: t.sense
      }));

    const finalDishName = customDishName.trim() || `${recipeAuthor}의 특별한 ${currentFoodTemplate.name}`;
    
    const newRecipe: SharedRecipe = {
      id: `custom-${Date.now()}`,
      foodId: selectedFoodId,
      foodName: currentFoodTemplate.name,
      foodEmoji: currentFoodTemplate.emoji,
      dishName: finalDishName,
      author: recipeAuthor.trim(),
      toppings: selectedToppingsList,
      powers: {
        sight: calculateFoodPower('sight'),
        sound: calculateFoodPower('sound'),
        smell: calculateFoodPower('smell'),
        taste: calculateFoodPower('taste'),
        touch: calculateFoodPower('touch')
      },
      likes: 0,
      comments: [],
      createdAt: '방금 전'
    };

    setSharedRecipes([newRecipe, ...sharedRecipes]);
    playSuccess();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#FF4757', '#FFD32D', '#2ED573', '#1E90FF']
    });

    // Reset recipe design but keep success feedback
    setActiveToppings([]);
    setCustomDishName('');
    setRecipeCompleted(false);

    // Scroll to the shared list
    setTimeout(() => {
      const element = document.getElementById('shared-recipes-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const handleLikeRecipe = (id: string) => {
    setSharedRecipes(prev => 
      prev.map(recipe => {
        if (recipe.id === id) {
          playReveal();
          return { ...recipe, likes: recipe.likes + 1 };
        }
        return recipe;
      })
    );
  };

  const handleAddComment = (recipeId: string) => {
    const text = commentInputs[recipeId]?.trim();
    const author = commentAuthors[recipeId]?.trim() || '탐험친구';
    if (!text) return;

    setSharedRecipes(prev =>
      prev.map(recipe => {
        if (recipe.id === recipeId) {
          playClick();
          return {
            ...recipe,
            comments: [
              ...recipe.comments,
              { author, text, createdAt: '방금 전' }
            ]
          };
        }
        return recipe;
      })
    );

    // Clear comment input
    setCommentInputs(prev => ({ ...prev, [recipeId]: '' }));
  };

  const handleToggleTopping = (toppingId: string) => {
    if (recipeCompleted) return;
    playClick();
    if (activeToppings.includes(toppingId)) {
      setActiveToppings(activeToppings.filter(id => id !== toppingId));
    } else {
      setActiveToppings([...activeToppings, toppingId]);
    }
  };

  const calculateFoodPower = (senseKey: 'sight' | 'sound' | 'smell' | 'taste' | 'touch') => {
    let base = currentFoodTemplate.basePower[senseKey];
    currentFoodTemplate.toppings.forEach(topping => {
      if (activeToppings.includes(topping.id) && topping.sense === senseKey) {
        base += topping.powerBonus;
      }
    });
    return Math.min(100, base);
  };

  const handleCompleteRecipe = () => {
    if (activeToppings.length === 0) {
      alert('최소한 한 개 이상의 감각 토핑을 추가해주세요!');
      playIncorrect();
      return;
    }
    if (!recipeAuthor.trim()) {
      alert('만든이 이름을 입력해 주세요!');
      playIncorrect();
      return;
    }
    setRecipeCompleted(true);
    playSuccess();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff4500', '#ffd700', '#32cd32', '#00bfff']
    });
  };

  const handleResetRecipe = () => {
    setActiveToppings([]);
    setCustomDishName('');
    setRecipeCompleted(false);
    playClick();
  };

  const handleStartApp = () => {
    setCurrentSlide(1);
    if (!bgmPlaying) {
      toggleBGM();
    }
    playClick();
  };

  // State for unlocking visual elements
  useEffect(() => {
    if (currentSlide === 5) {
      playFanfare();
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ffe066', '#f39c12', '#e74c3c', '#9b59b6']
      });
    }
  }, [currentSlide]);

  // Determine active senses for Slide 1 under-box display
  const getSensesStatus = () => {
    const statuses = { sight: false, sound: false, smell: false, taste: false, touch: false };
    if (currentMysteryItem.id === 'peach') {
      if (hintStep >= 1) statuses.touch = true;
      if (hintStep >= 2) statuses.smell = true;
      if (hintStep >= 3) statuses.taste = true;
    } else if (currentMysteryItem.id === 'potato_chips') {
      if (hintStep >= 1) statuses.touch = true;
      if (hintStep >= 2) statuses.sound = true;
      if (hintStep >= 3) statuses.taste = true;
    } else if (currentMysteryItem.id === 'slime') {
      if (hintStep >= 1) statuses.touch = true;
      if (hintStep >= 2) statuses.sound = true;
      if (hintStep >= 3) statuses.smell = true;
    }
    return statuses;
  };
  const activeSenses = getSensesStatus();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden font-sans select-none bg-[#FAF7F2]">
      
      {/* Primary Screen Container - Full screen website layout */}
      <div className="relative w-full h-full text-[#2D2D2D] flex flex-col justify-between transition-all duration-300 overflow-hidden">
        
        {/* Header Navigation (Magazine Masthead Style) */}
        <header className="bg-[#1A1A1A] text-white px-8 py-3.5 flex justify-between items-center border-b-4 border-[#FF4757] shrink-0 z-40">
          <div className="flex flex-col cursor-pointer" onClick={() => { setCurrentSlide(0); playClick(); }}>
            <span className="text-[#FFD32D] text-[10px] font-black tracking-widest uppercase">Lesson Phase: 01-05</span>
            <h1 className="text-2xl font-black italic uppercase tracking-tight">
              오감(五感) 탐험대 <span className="text-[#FF4757]">/</span> SENSORY MISSION
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              {[
                { index: 1, label: '비밀 상자' },
                { index: 2, label: '방울 토마토' },
                { index: 3, label: '교실 수사대' },
                { index: 4, label: '비밀 레시피' },
                { index: 5, label: '명예 훈장' }
              ].map((tab) => {
                const isActive = currentSlide === tab.index;
                return (
                  <button
                    key={tab.index}
                    onClick={() => {
                      setCurrentSlide(tab.index);
                      playClick();
                    }}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 border-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FF4757] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105'
                        : 'bg-[#2D2D2D] text-zinc-300 hover:bg-neutral-800 hover:text-white border-transparent'
                    }`}
                  >
                    0{tab.index}. {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Integrated BGM button inside the masthead */}
            <button 
              onClick={toggleBGM}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-black border-2 border-black rounded-lg transition-all cursor-pointer ${
                bgmPlaying 
                  ? 'bg-[#2ED573] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                  : 'bg-[#FF4757] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {bgmPlaying ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{bgmPlaying ? 'BGM 켜짐' : 'BGM 꺼짐'}</span>
            </button>
          </div>
        </header>

        {/* MAIN SLIDE VIEWER */}
        <div className="flex-1 w-full min-h-0 flex flex-col px-12 py-8 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {/* SLIDE 0: Cover Slide */}
            {currentSlide === 0 && (
              <motion.div
                key="slide0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col justify-center items-start h-full max-w-4xl z-10"
              >
                <div className="inline-block px-4 py-1.5 mb-4 text-xs font-black tracking-widest text-white bg-black uppercase rounded-lg shadow-[3px_3px_0px_0px_rgba(255,71,87,1)] border-2 border-black">
                  ★ MISSION: SENSORY DETECTIVE ★
                </div>
                
                {/* Massive fashion-magazine style title */}
                <h1 className="text-6xl md:text-7xl font-black font-serif tracking-tight leading-none text-black drop-shadow-[4px_4px_0px_#FFD32D]">
                  알록달록 <span className="text-[#FF4757] underline decoration-black decoration-wavy decoration-3">오감</span> 탐험대
                </h1>
                <h2 className="text-4xl md:text-5xl font-black font-sans tracking-tight mt-3 text-[#2D2D2D] leading-none">
                  감각 수사 첩보전
                </h2>

                <p className="mt-6 text-base md:text-lg font-bold text-neutral-800 leading-relaxed max-w-2xl bg-white p-5 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  세상의 모든 매혹적인 소리, 달콤한 맛, 쫀득한 감촉을 훔쳐간 무채색 흑백 악당! 
                  세상이 회색빛으로 변하기 전에, 잃어버린 감각적 표현의 단서들을 수집하여 세상을 다시 오색찬란하게 구해주세요!
                </p>

                <button
                  onClick={handleStartApp}
                  className="mt-8 flex items-center gap-3 px-8 py-4 text-xl font-black text-black bg-[#FFD32D] hover:bg-yellow-400 border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
                >
                  <span>감각 탐험대 출동!</span>
                  <Sparkles className="w-6 h-6 group-hover:animate-bounce text-[#FF4757]" />
                </button>
              </motion.div>
            )}

            {/* SLIDE 1: Mystery Box Game */}
            {currentSlide === 1 && (
              <motion.div
                key="slide1"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center"
              >
                {/* Left Panel: Content / Guesser */}
                <div className="md:col-span-7 flex flex-col justify-center pr-4">
                  <div className="bg-[#FF4757] text-white px-3 py-1 font-black text-xs uppercase transform -rotate-1 inline-block border-2 border-black shadow-[2px_2px_0px_#000] w-max mb-3">
                    동기유발 • [수리수리 마수리! 비밀 상자 퀴즈]
                  </div>
                  
                  {/* HUGE Activity title */}
                  <h2 className="text-4xl font-black text-[#1A1A1A] font-sans tracking-tight mb-2">
                    비밀 상자 속에 든 <span className="text-[#FF4757] underline decoration-black decoration-wavy decoration-2">물건</span>은 무엇일까?
                  </h2>
                  <p className="text-neutral-700 text-sm font-bold mb-4 leading-relaxed">
                    상자를 탭하여 감각적 표현 힌트를 하나씩 해제해보세요. 
                    세 단서를 모두 해제한 뒤 상자 속에 어떤 보물이 숨겨져 있는지 맞혀보세요!
                  </p>

                  {/* Retro Flat Ledger Panel */}
                  <div className="bg-white p-5 rounded-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                    <div className="flex gap-2.5 mb-4">
                      {MYSTERY_BOX_ITEMS.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => handleMysteryReset(idx)}
                          className={`px-4 py-2 text-xs font-black border-2 border-black rounded-lg transition-all cursor-pointer ${
                            selectedMysteryIndex === idx 
                              ? 'bg-[#FFD32D] text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-105' 
                              : 'bg-white hover:bg-neutral-100 text-neutral-700 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]'
                          }`}
                        >
                          📦 비밀 상자 {idx + 1}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 mb-4 min-h-[145px]">
                      {Array.from({ length: 3 }).map((_, stepIdx) => (
                        <div 
                          key={stepIdx}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                            hintStep > stepIdx 
                              ? 'bg-white border-black border-l-8 border-l-[#FF4757] text-[#1A1A1A] shadow-[3px_3px_0px_rgba(0,0,0,1)]' 
                              : 'bg-[#FAF7F2]/60 border-dashed border-neutral-300 text-neutral-400 opacity-60'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-sm shrink-0 ${
                            hintStep > stepIdx ? 'bg-[#FFD32D] text-black' : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            {stepIdx + 1}
                          </div>
                          <span className="text-sm font-black">
                            {hintStep > stepIdx ? currentMysteryItem.hints[stepIdx] : '상자 탭하기를 누르거나, 아래 상자를 마구 흔들어 힌트를 수사하세요!'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Guessing controls */}
                    {hintStep >= 3 && !mysterySolved && (
                      <div className="flex flex-col gap-3 animate-bounce">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={mysteryGuess}
                            onChange={(e) => setMysteryGuess(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleMysterySubmit(mysteryGuess)}
                            placeholder="추리한 물건 이름 입력 (예: 복숭아)"
                            className="flex-1 px-4 py-2.5 text-sm font-bold border-2 border-black rounded-lg bg-[#FAF7F2] focus:bg-white text-black outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
                          />
                          <button
                            onClick={() => handleMysterySubmit(mysteryGuess)}
                            className="px-6 py-2.5 font-black text-sm text-black bg-[#FFD32D] border-2 border-black hover:bg-yellow-400 rounded-lg transition-all shadow-[2px_2px_0px_#000]"
                          >
                            정답 확인
                          </button>
                        </div>
                        
                        {/* Kid-friendly emoji options */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-neutral-500">지목 후보 단서:</span>
                          {['🍑 복숭아', '🥔 감자칩', '🧪 슬라임', '🍭 사탕', '🍎 사과', '🍞 빵'].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                const cleanWord = opt.split(' ')[1];
                                setMysteryGuess(cleanWord);
                                handleMysterySubmit(cleanWord);
                              }}
                              className="px-2.5 py-1.5 bg-white hover:bg-[#FFD32D] text-xs font-black border-2 border-black rounded-lg transition-all text-neutral-800 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:scale-105 cursor-pointer"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {mysterySolved && (
                      <div className="p-4 bg-[#2ED573]/10 border-3 border-[#2ED573] text-black rounded-lg flex items-center gap-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <span className="text-5xl">{currentMysteryItem.emoji}</span>
                        <div>
                          <h4 className="font-black text-base text-emerald-800">🎉 와우! 명품 감각 탐정의 활약!</h4>
                          <p className="text-xs font-bold text-[#2D2D2D] mt-0.5">
                            정답은 <strong className="text-sm font-black underline text-emerald-700">{currentMysteryItem.name}</strong>였습니다! 
                            오감을 적극적으로 살린 멋진 단서 수집이었습니다.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Mystery Box Illustration with Reactive Sense Icons */}
                <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                  
                  {/* Bouncing Box Container */}
                  <motion.div
                    animate={
                      mysterySolved 
                        ? { scale: [1, 1.15, 1], rotate: [0, 12, -12, 0] } 
                        : hintStep > 0 ? { y: [0, -8, 0], rotate: [-2, 2, -2] } : {}
                    }
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    onClick={handleRevealHint}
                    className={`w-72 h-72 flex flex-col justify-center items-center border-4 border-black relative cursor-pointer group shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all rounded-xl ${
                      mysterySolved ? 'bg-[#2ED573]' : 'bg-[#FFD32D] hover:bg-yellow-400'
                    }`}
                  >
                    {/* Retro ribbon detail */}
                    <div className="absolute top-0 w-8 h-full bg-[#FF4757]/80 border-x-2 border-black" />
                    <div className="absolute left-0 w-full h-8 bg-[#FF4757]/80 border-y-2 border-black" />

                    <div className="z-10 flex flex-col items-center justify-center">
                      <span className="text-8xl drop-shadow-md select-none group-hover:scale-110 transition-transform">
                        {mysterySolved ? currentMysteryItem.emoji : '🎁'}
                      </span>
                      <span className="mt-4 px-4 py-1.5 bg-black text-white text-xs font-black rounded-lg shadow-[2px_2px_0px_#fff] border border-black">
                        {mysterySolved ? '탐정 수색 완료!' : `터치하여 흔들기 (${hintStep}/3)`}
                      </span>
                    </div>

                    {/* Mystery badge */}
                    {!mysterySolved && (
                      <div className="absolute -top-4 -right-4 bg-black border-2 border-black text-white text-xs font-black px-3 py-1 rounded-md rotate-12 shadow-[3px_3px_0px_#FFD32D] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                        <span>의문의 비밀 상자</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Reactive Sense Indicator under the Box (Exact Design HTML pattern match) */}
                  <div className="mt-8 grid grid-cols-5 gap-3 bg-white border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] w-full max-w-sm">
                    {[
                      { icon: '👀', key: 'sight', label: '시각' },
                      { icon: '👂', key: 'sound', label: '청각' },
                      { icon: '👃', key: 'smell', label: '후각' },
                      { icon: '👅', key: 'taste', label: '미각' },
                      { icon: '🖐️', key: 'touch', label: '촉각' }
                    ].map((senseItem) => {
                      const isHighlighted = (activeSenses as any)[senseItem.key];
                      return (
                        <div 
                          key={senseItem.key} 
                          className={`flex flex-col items-center transition-all ${isHighlighted ? 'scale-105 opacity-100' : 'opacity-30'}`}
                        >
                          <div className={`w-11 h-11 bg-white border-2 border-black rounded-lg flex items-center justify-center text-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] ${isHighlighted ? 'ring-4 ring-[#FF4757] bg-yellow-100' : ''}`}>
                            {senseItem.icon}
                          </div>
                          <span className={`text-[9px] font-black mt-1 uppercase ${isHighlighted ? 'text-[#FF4757]' : 'text-neutral-500'}`}>
                            {senseItem.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reset/Try another one */}
                  <button
                    onClick={() => handleMysteryReset((selectedMysteryIndex + 1) % MYSTERY_BOX_ITEMS.length)}
                    className="mt-5 flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-50 text-black font-extrabold text-xs border-2 border-black rounded-lg shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>다른 상자 수사하기</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SLIDE 2: Poem Exploration */}
            {currentSlide === 2 && (
              <motion.div
                key="slide2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  <div className="bg-[#2ED573] text-black px-3 py-1 font-black text-xs uppercase transform -rotate-1 inline-block border-2 border-black shadow-[2px_2px_0px_#000] w-max mb-3">
                    활동 2 • [두근두근 시 속 탐험]
                  </div>
                  
                  {/* HUGE Activity title */}
                  <h2 className="text-4xl font-black text-black font-sans tracking-tight mb-1">
                    시 속 숨겨진 <span className="text-[#FF4757] underline decoration-black decoration-wavy decoration-2">감각적 표현</span>의 비밀을 밝혀라!
                  </h2>
                  <p className="text-neutral-700 text-sm font-bold mb-4">
                    동생의 귀여움을 방울 토마토에 빗댄 서정적인 시입니다. 
                    시에서 <strong>감각이 느껴지는 세 곳의 구절</strong>을 찾아 마우스로 탭해보세요!
                  </p>
                </div>

                {/* Poetry Frame & Inspector Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch my-auto">
                  
                  {/* Poem Content */}
                  <div className="md:col-span-7 bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center text-center relative min-h-[290px]">
                    
                    {/* Decorative Tomato Icon */}
                    <div className="absolute top-4 right-4 text-4xl animate-bounce">🍅</div>
                    
                    <h3 className="text-2xl font-black font-serif text-[#FF4757] mb-6 border-b-2 border-dashed border-[#FF4757]/20 pb-2 px-6">
                      방울 토마토는 일곱 살
                    </h3>

                    <div className="space-y-4 text-lg md:text-xl font-bold font-serif text-[#2D2D2D] leading-relaxed">
                      <p>
                        햇빛을 받아{' '}
                        <button
                          onClick={() => handlePoemWordClick('빨갛게 익은', 0)}
                          className={`px-3 py-1 rounded-lg border-2 border-dashed font-serif font-black transition-all cursor-pointer ${
                            clickedPoemWords.includes('빨갛게 익은')
                              ? 'bg-[#FF4757] border-2 border-black text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-105 border-solid'
                              : 'bg-[#FAF7F2] hover:bg-neutral-100 border-neutral-300 text-[#2D2D2D]'
                          }`}
                        >
                          빨갛게 익은
                        </button>{' '}
                        얼굴
                      </p>

                      <p>
                        한 입 베어 물면{' '}
                        <button
                          onClick={() => handlePoemWordClick('새콤달콤한', 1)}
                          className={`px-3 py-1 rounded-lg border-2 border-dashed font-serif font-black transition-all cursor-pointer ${
                            clickedPoemWords.includes('새콤달콤한')
                              ? 'bg-[#FFD32D] border-2 border-black text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-105 border-solid'
                              : 'bg-[#FAF7F2] hover:bg-neutral-100 border-neutral-300 text-[#2D2D2D]'
                          }`}
                        >
                          새콤달콤한
                        </button>{' '}
                        즙이 팡!
                      </p>

                      <p>
                        손가락으로 만져보면 아주{' '}
                        <button
                          onClick={() => handlePoemWordClick('탱글탱글한', 2)}
                          className={`px-3 py-1 rounded-lg border-2 border-dashed font-serif font-black transition-all cursor-pointer ${
                            clickedPoemWords.includes('탱글탱글한')
                              ? 'bg-[#2ED573] border-2 border-black text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-105 border-solid'
                              : 'bg-[#FAF7F2] hover:bg-neutral-100 border-neutral-300 text-[#2D2D2D]'
                          }`}
                        >
                          탱글탱글한
                        </button>
                      </p>

                      <p className="text-neutral-500 mt-2 text-base font-serif">
                        방울 토마토는 일곱 살 내 동생.
                      </p>
                    </div>
                  </div>

                  {/* Inspector / Detective Progress Box (Styled like a retro notebook profile) */}
                  <div className="md:col-span-5 flex flex-col justify-between">
                    <div className="bg-[#1A1A1A] text-white p-5 rounded-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex-1 flex flex-col justify-center gap-3">
                      <div className="flex items-center gap-2 text-[#FFD32D] font-black text-sm">
                        <Trophy className="w-5 h-5 text-[#FFD32D]" />
                        <span>탐정 수사 일지 ({clickedPoemWords.length}/3 수집 완료)</span>
                      </div>

                      <div className="space-y-2 mt-2">
                        {TOMATO_POEM_WORDS.map((w, idx) => {
                          const isFound = clickedPoemWords.includes(w.text);
                          return (
                            <div 
                              key={idx}
                              className={`p-2.5 rounded-lg border-2 flex items-center justify-between text-xs font-bold transition-all ${
                                isFound 
                                  ? 'bg-[#2D2D2D] border-black text-[#2ED573] shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                                  : 'bg-neutral-800 border-dashed border-neutral-600 text-neutral-500'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                                  isFound ? 'bg-[#2ED573] text-black' : 'bg-neutral-700 text-neutral-400'
                                }`}>
                                  {idx + 1}
                                </span>
                                <span>{isFound ? `"${w.text}" : [${w.sense}]` : `단서 ${idx + 1} 수색 진행 중`}</span>
                              </div>
                              {isFound && <Check className="w-4 h-4 text-[#2ED573]" />}
                            </div>
                          );
                        })}
                      </div>

                      {poemSuccess && (
                        <div className="mt-2 p-2.5 bg-[#2ED573]/20 border border-[#2ED573] text-zinc-100 text-xs rounded-lg flex items-center gap-2 font-bold animate-pulse">
                          <span>🎉 방울 토마토의 비밀 완벽 해제! 빨갛게 익고(시각), 새콤달콤하고(미각), 탱글탱글한(촉각) 오감 표현을 전부 확보했습니다!</span>
                        </div>
                      )}
                    </div>

                    {poemSuccess && (
                      <button
                        onClick={handlePoemReset}
                        className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-neutral-50 text-black font-extrabold text-xs border-2 border-black rounded-lg shadow-[3px_3px_0px_#000] transition-all self-end cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>다시 수색하기</span>
                      </button>
                    )}
                  </div>

                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs border-2 border-black rounded-lg shadow-[4px_4px_0px_#fff] hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>교실 물건 탐정 수색하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SLIDE 3: Classroom Investigation Tabs */}
            {currentSlide === 3 && (
              <motion.div
                key="slide3"
                id="slide3-container"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex flex-col h-full relative overflow-y-auto pr-1.5 scrollbar-thin space-y-3"
              >
                <div>
                  <div className="bg-[#1E90FF] text-white px-3 py-1 font-black text-xs uppercase transform -rotate-1 inline-block border-2 border-black shadow-[2px_2px_0px_#000] w-max mb-2">
                    활동 3 • [슥삭슥삭! 우리 교실 감각 수사대]
                  </div>
                  
                  {/* HUGE Activity title */}
                  <h2 className="text-3xl font-black text-black font-sans tracking-tight mb-1">
                    우리 교실 안의 <span className="text-[#FF4757] underline decoration-black decoration-wavy decoration-2">물건</span>들을 샅샅이 수사하라!
                  </h2>
                  <p className="text-neutral-700 text-xs font-bold">
                    카테고리 탭을 선택하여 물건의 각 부위에 숨겨진 풍성한 감각적 표현을 누르고 수집해보세요. 직접 새로운 물건과 감각 표현을 등록할 수도 있습니다!
                  </p>
                </div>

                {/* Folder style tab bar - Supports wrapping and dynamic items */}
                <div className="flex flex-wrap gap-1.5 bg-[#FAF7F2] p-1.5 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-lg shrink-0">
                  {classroomObjects.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => {
                        setActiveClassroomTab(obj.id);
                        playClick();
                      }}
                      className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-black rounded-md border-2 border-black transition-all cursor-pointer ${
                        activeClassroomTab === obj.id
                          ? 'bg-[#FFD32D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                          : 'bg-white hover:bg-neutral-50 text-neutral-800 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <span 
                        className="text-base inline-block"
                        style={obj.id === 'wine_hat' ? { filter: 'hue-rotate(130deg) saturate(1.8) brightness(0.85)' } : undefined}
                      >
                        {obj.icon}
                      </span>
                      <span>{obj.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      playClick();
                      const element = document.getElementById('new-object-form-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="flex-none flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-black rounded-md border-2 border-black bg-[#FF4757] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#ff3c4d] hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <span>➕ 새 물건 제보하기</span>
                  </button>
                </div>

                {/* Tab Contents: 3D-ish inspector layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch shrink-0">
                  
                  {/* Object Illustration Card */}
                  <div className="md:col-span-5 bg-white p-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center relative min-h-[160px] shrink-0 text-center">
                    {currentClassroomObject.id.startsWith('custom-') && !currentClassroomObject.isRevealed ? (
                      <div className="flex flex-col items-center justify-center py-4 w-full">
                        <div className="text-7xl animate-pulse mb-3 select-none">🕵️‍♂️❓</div>
                        <h3 className="text-sm font-black text-black">친구들이 제보한 비밀 감각 물건</h3>
                        <p className="text-[10px] font-black text-[#1E90FF] mt-1 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full inline-block">
                          👤 출제자: {currentClassroomObject.author || '나만의 수사대'}
                        </p>
                        
                        <div className="mt-4 w-full border-t border-dashed border-neutral-200 pt-3">
                          <p className="text-[10px] font-bold text-neutral-500 mb-1.5">
                            우측의 감각 단서들을 읽고 맞춰보세요!
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRevealClassroomObject(currentClassroomObject.id)}
                            className="w-full py-2 bg-[#FFD32D] hover:bg-[#ffe066] border-2 border-black rounded-lg text-xs font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1 text-black"
                          >
                            <span>🔓 정답 공개하기 (교사용)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="text-6xl animate-bounce mb-2"
                          style={currentClassroomObject.id === 'wine_hat' ? { filter: 'hue-rotate(130deg) saturate(1.8) brightness(0.85)' } : undefined}
                        >
                          {currentClassroomObject.icon}
                        </div>
                        <h3 className="text-lg font-black text-black text-center">{currentClassroomObject.name}</h3>
                        
                        {currentClassroomObject.id.startsWith('custom-') ? (
                          <p className="text-[10px] font-black text-[#2ED573] mt-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            👤 출제자: {currentClassroomObject.author || '나만의 수사대'}
                          </p>
                        ) : (
                          <p className="text-[10px] font-bold text-neutral-500 mt-0.5">
                            교실 수색 기록 #00{currentClassroomObject.id === 'wine_hat' ? '1' : currentClassroomObject.id === 'pencil_case' ? '2' : '3'}
                          </p>
                        )}
                        
                        {currentClassroomObject.id.startsWith('custom-') && (
                          <div className="mt-2 text-[10px] font-black text-rose-500 animate-bounce">
                            🎉 정답을 맞췄습니다! 참 잘했어요! 👍
                          </div>
                        )}
                      </>
                    )}

                    {/* Fun badge */}
                    <div className="absolute top-2.5 left-2.5 bg-[#FF4757] text-white border-2 border-black text-[8px] font-black px-1.5 py-0.5 rounded-md rotate-[-6deg] shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      SENSORY DETECTIVE
                    </div>
                  </div>

                  {/* Senses Details Inspector */}
                  <div className="md:col-span-7 flex flex-col justify-between gap-3">
                    <div className="bg-white p-5 rounded-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-2.5 flex-1 flex flex-col justify-center">
                      <h4 className="text-xs font-black text-neutral-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                        <Smile className="w-4 h-4 text-[#FF4757]" />
                        <span>부위별 감각 프로필 단서 (클릭하여 획득)</span>
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(currentClassroomObject.senses).map(([senseKey, desc]) => {
                          if (!desc) return null; // skip if description is empty
                          const isUnlocked = investigatedSenses.includes(`${activeClassroomTab}-${senseKey}`);
                          const getSenseLabel = (k: string) => {
                            if (k === 'sight') return { label: '시각 (눈)', icon: <Eye className="w-3.5 h-3.5 text-blue-500" />, color: 'bg-blue-50 border-blue-400' };
                            if (k === 'sound') return { label: '청각 (귀)', icon: <Ear className="w-3.5 h-3.5 text-purple-500" />, color: 'bg-purple-50 border-purple-400' };
                            if (k === 'smell') return { label: '후각 (코)', icon: <HelpCircle className="w-3.5 h-3.5 text-orange-500" />, color: 'bg-orange-50 border-orange-400' };
                            if (k === 'taste') return { label: '미각 (입)', icon: <ChefHat className="w-3.5 h-3.5 text-rose-500" />, color: 'bg-rose-50 border-rose-400' };
                            return { label: '촉각 (손)', icon: <Hand className="w-3.5 h-3.5 text-teal-500" />, color: 'bg-emerald-50 border-emerald-400' };
                          };
                          const info = getSenseLabel(senseKey);

                          return (
                            <button
                              key={senseKey}
                              onClick={() => handleInvestigateSense(senseKey)}
                              className={`p-3 rounded-lg border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                                isUnlocked 
                                  ? `${info.color} text-neutral-900 font-bold shadow-[2px_2px_0px_#000] border-black` 
                                  : 'bg-[#FAF7F2] border-dashed border-neutral-300 text-neutral-400 hover:bg-neutral-100'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border-2 border-black ${isUnlocked ? 'bg-white' : 'bg-neutral-200'}`}>
                                  {info.icon}
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-black text-neutral-500">{info.label}</span>
                                  <p className="text-xs font-black mt-0.5">
                                    {isUnlocked ? desc : '?? 의문의 감각적 특징을 분석하려면 클릭하십시오 ??'}
                                  </p>
                                </div>
                              </div>
                              {isUnlocked && <Check className="w-4 h-4 text-black" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sensory Power Level Chart (Visual meters) */}
                    <div className="bg-[#1A1A1A] text-white p-4 rounded-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                      <div className="w-full">
                        <span className="text-[10px] font-black text-[#FFD32D] uppercase tracking-wider block mb-2">오감 파워 지수 (SENSORY STRENGTH)</span>
                        <div className="grid grid-cols-5 gap-3 text-center">
                          {Object.entries(currentClassroomObject.power).map(([k, val]) => {
                            const getLabel = (key: string) => {
                              if (key === 'sight') return '시각';
                              if (key === 'sound') return '청각';
                              if (key === 'smell') return '후각';
                              if (key === 'touch') return '촉각';
                              return '미각';
                            };
                            return (
                              <div key={k} className="flex flex-col items-center">
                                <div className="w-full bg-[#2D2D2D] h-10 border-2 border-black rounded-lg relative overflow-hidden flex items-end">
                                  <div 
                                    className="w-full bg-[#FFD32D] border-t-2 border-black transition-all duration-700" 
                                    style={{ height: `${val}%` }} 
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black drop-shadow text-white font-mono">
                                    {val}
                                  </span>
                                </div>
                                <span className="text-[10px] font-black text-neutral-300 mt-1">{getLabel(k)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Friends' Sensory Quiz Board */}
                <div className="mt-8 bg-[#FFF9E6] p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b-2 border-dashed border-black">
                    <div>
                      <h3 className="text-lg font-black text-black flex items-center gap-2">
                        <span>👥</span>
                        <span>친구들이 출제한 교실 감각 퀴즈 게시판 (스크롤)</span>
                      </h3>
                      <p className="text-xs font-bold text-neutral-600 mt-1">
                        친구들이 교실에서 직접 수색하고 제보한 재미있는 오감 퀴즈입니다! 힌트를 읽고 정답을 맞춰본 뒤, 교사용 정답 확인 버튼을 클릭해 보세요.
                      </p>
                    </div>
                    <div className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-black shrink-0 shadow-[2px_2px_0px_#FFD32D]">
                      총 {classroomObjects.filter(obj => obj.id.startsWith('custom-') || obj.id.startsWith('custom-preset-')).length}개 퀴즈 출제됨
                    </div>
                  </div>

                  {classroomObjects.filter(obj => obj.id.startsWith('custom-') || obj.id.startsWith('custom-preset-')).length === 0 ? (
                    <div className="text-center py-8 bg-white border-2 border-black border-dashed rounded-xl">
                      <p className="text-sm font-black text-neutral-400">🕵️‍♀️ 아직 등록된 수사 문제가 없어요!</p>
                      <p className="text-xs text-neutral-500 mt-1">상단의 "➕ 새 물건 제보하기" 버튼을 눌러 여러분만의 감각 퀴즈를 직접 출제해보세요!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
                      {classroomObjects.filter(obj => obj.id.startsWith('custom-') || obj.id.startsWith('custom-preset-')).map((quiz) => {
                        return (
                          <div 
                            key={quiz.id}
                            className={`bg-white p-4 rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between transition-all relative ${
                              activeClassroomTab === quiz.id ? 'bg-[#FFFDF5] border-[#FFD32D] scale-[0.99]' : ''
                            }`}
                          >
                            <div>
                              {/* Card Header */}
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-[11px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-300">
                                  👤 출제 수사관: {quiz.author || '익명 수사관'}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                                  문제 #{quiz.id.startsWith('custom-preset-') ? '예시-' + quiz.id.slice(-1) : '제보'}
                                </span>
                              </div>

                              {/* Senses clues */}
                              <div className="space-y-2 mb-4">
                                {quiz.senses.sight && (
                                  <div className="flex gap-2 items-start text-xs bg-[#F0F8FF] p-2 rounded-lg border border-blue-100">
                                    <span className="shrink-0 text-sm">👀</span>
                                    <div>
                                      <span className="font-black text-blue-600 block text-[9px] uppercase tracking-wider">눈으로 보면 (시각 단서)</span>
                                      <p className="text-neutral-800 font-bold mt-0.5">{quiz.senses.sight}</p>
                                    </div>
                                  </div>
                                )}
                                {quiz.senses.sound && (
                                  <div className="flex gap-2 items-start text-xs bg-[#FAF5FF] p-2 rounded-lg border border-purple-100">
                                    <span className="shrink-0 text-sm">👂</span>
                                    <div>
                                      <span className="font-black text-purple-600 block text-[9px] uppercase tracking-wider">귀로 들으면 (청각 단서)</span>
                                      <p className="text-neutral-800 font-bold mt-0.5">{quiz.senses.sound}</p>
                                    </div>
                                  </div>
                                )}
                                {quiz.senses.smell && (
                                  <div className="flex gap-2 items-start text-xs bg-[#FFF7ED] p-2 rounded-lg border border-orange-100">
                                    <span className="shrink-0 text-sm">👃</span>
                                    <div>
                                      <span className="font-black text-orange-600 block text-[9px] uppercase tracking-wider">코로 맡으면 (후각 단서)</span>
                                      <p className="text-neutral-800 font-bold mt-0.5">{quiz.senses.smell}</p>
                                    </div>
                                  </div>
                                )}
                                {quiz.senses.touch && (
                                  <div className="flex gap-2 items-start text-xs bg-[#ECFDF5] p-2 rounded-lg border border-emerald-100">
                                    <span className="shrink-0 text-sm">✋</span>
                                    <div>
                                      <span className="font-black text-emerald-600 block text-[9px] uppercase tracking-wider">손으로 만지면 (촉각 단서)</span>
                                      <p className="text-neutral-800 font-bold mt-0.5">{quiz.senses.touch}</p>
                                    </div>
                                  </div>
                                )}
                                {quiz.senses.taste && (
                                  <div className="flex gap-2 items-start text-xs bg-[#FFF1F2] p-2 rounded-lg border border-rose-100">
                                    <span className="shrink-0 text-sm">👅</span>
                                    <div>
                                      <span className="font-black text-rose-600 block text-[9px] uppercase tracking-wider">입으로 맛보면 (미각 단서)</span>
                                      <p className="text-neutral-800 font-bold mt-0.5">{quiz.senses.taste}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Answers and Actions */}
                            <div className="border-t border-dashed border-neutral-200 pt-3 mt-auto">
                              {quiz.isRevealed ? (
                                <div className="bg-emerald-50 border-2 border-[#2ED573] rounded-lg p-2.5 text-center flex flex-col items-center justify-center animate-bounce">
                                  <div className="flex items-center gap-1.5 justify-center">
                                    <span className="text-3xl">{quiz.icon}</span>
                                    <span className="text-xs font-black text-neutral-800 bg-white border border-neutral-300 px-2 py-0.5 rounded shadow-sm">{quiz.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setClassroomObjects(prev =>
                                          prev.map(o => o.id === quiz.id ? { ...o, isRevealed: false } : o)
                                        );
                                        playClick();
                                      }}
                                      className="text-[10px] font-black text-neutral-500 hover:text-black hover:underline cursor-pointer"
                                    >
                                      🔒 정답 다시 숨기기
                                    </button>
                                    <span className="text-neutral-300 text-[10px]">|</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveClassroomTab(quiz.id);
                                        playClick();
                                        const container = document.getElementById('slide3-container');
                                        if (container) {
                                          container.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                      }}
                                      className="text-[10px] font-black text-[#1E90FF] hover:underline cursor-pointer"
                                    >
                                      🔍 대형 스크린으로 수색하기
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveClassroomTab(quiz.id);
                                      playClick();
                                      const container = document.getElementById('slide3-container');
                                      if (container) {
                                        container.scrollTo({ top: 0, behavior: 'smooth' });
                                      }
                                    }}
                                    className="flex-1 py-1.5 bg-[#FAF7F2] hover:bg-neutral-100 border-2 border-black rounded-lg text-[10px] font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer text-black"
                                  >
                                    🔍 대형 스크린에 띄우기
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRevealClassroomObject(quiz.id)}
                                    className="flex-1 py-1.5 bg-[#FFD32D] hover:bg-[#ffe066] border-2 border-black rounded-lg text-[10px] font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer text-black"
                                  >
                                    🔓 정답 확인하기 (교사용)
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ➕ 새로운 교실 물건 & 감각 표현 제보하기 Form Section */}
                <div id="new-object-form-section" className="border-t-4 border-dashed border-neutral-300 pt-6 mt-6">
                  <form onSubmit={handleAddNewObject} className="bg-[#FFF0F2] p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4 text-neutral-800">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b-2 border-dashed border-black">
                      <div>
                        <h3 className="text-lg font-black text-black flex items-center gap-2">
                          <span>🎒</span>
                          <span>새로운 교실 물건 & 감각 표현 제보하기</span>
                        </h3>
                        <p className="text-xs font-bold text-neutral-600 mt-1">
                          교실 안에서 찾은 나만의 물건과 그 오감(시각, 청각, 후각, 촉각, 미각) 단서들을 입력해 친구들에게 퀴즈를 출제해보세요!
                        </p>
                      </div>
                    </div>

                    {/* 1. Object Name and Icon Selector */}
                    <div className="bg-white p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] space-y-3">
                      <h4 className="text-sm font-black text-black border-b-2 border-dashed border-neutral-200 pb-1.5 flex items-center gap-1.5">
                        <span>🎒</span>
                        <span>1단계: 어떤 물건으로 감각 퀴즈를 낼까요? (동기유발 퀴즈)</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-black text-neutral-500 mb-1">출제자 이름</label>
                          <input
                            type="text"
                            value={newObjectAuthor}
                            onChange={(e) => setNewObjectAuthor(e.target.value)}
                            placeholder="예: 홍길동"
                            className="w-full px-3 py-2 text-xs font-bold border-2 border-black rounded-lg bg-[#FAF7F2] focus:bg-white text-black outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#FF4757] mb-1">정답 물건 이름 🔒 (숨겨짐)</label>
                          <input
                            type="text"
                            value={newObjectName}
                            onChange={(e) => setNewObjectName(e.target.value)}
                            placeholder="예: 보들보들 담요, 빨간 꼬깔모자"
                            className="w-full px-3 py-2 text-xs font-bold border-2 border-black rounded-lg bg-[#FAF7F2] focus:bg-white text-black outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-neutral-500 mb-1">물건 이모지 🔒</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={newObjectIcon}
                              onChange={(e) => setNewObjectIcon(e.target.value)}
                              maxLength={2}
                              className="w-10 text-center py-1 text-base font-bold border-2 border-black rounded-lg bg-[#FAF7F2]"
                            />
                            <div className="flex-1 flex flex-wrap gap-1 bg-[#FAF7F2] p-1 border-2 border-black rounded-lg max-h-9 overflow-y-auto">
                              {['🎒', '✏️', '📐', '📕', '🪟', '🥤', '🍭', '🧁', '🍪', '🎨', '⚽', '👓', '🧸', '🍬', '🔑', '🍎', '👒', '🧣', '👟', '☂️'].map((emoji) => (
                                <button
                                  type="button"
                                  key={emoji}
                                  onClick={() => {
                                    setNewObjectIcon(emoji);
                                    playClick();
                                  }}
                                  className={`w-5.5 h-5.5 text-xs flex items-center justify-center rounded hover:bg-neutral-200 cursor-pointer ${
                                    newObjectIcon === emoji ? 'bg-[#FFD32D] border border-black' : ''
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Senses inputs */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-black text-black flex items-center gap-1.5 pl-1">
                        <span>✍️</span>
                        <span>2단계: 이 물건에서 느낄 수 있는 오감(五感) 표현을 찾아보세요!</span>
                      </h4>

                      <div className="space-y-2.5">
                        {/* Sight */}
                        <div className="bg-white p-3 rounded-lg border-2 border-black flex flex-col md:flex-row gap-3 shadow-[2.5px_2.5px_0px_#000]">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">👀</span>
                              <span className="text-xs font-black text-blue-600">시각 (눈으로 보았을 때)</span>
                            </div>
                            <input
                              type="text"
                              value={newObjectSenses.sight}
                              onChange={(e) => setNewObjectSenses({ ...newObjectSenses, sight: e.target.value })}
                              placeholder="예: 눈이 부실 정도로 쨍한 연두빛을 띠고 있어요."
                              className="w-full px-2.5 py-1.5 text-xs font-bold border border-black bg-[#FAF7F2] focus:bg-white text-black outline-none rounded"
                            />
                          </div>
                          <div className="w-full md:w-44 shrink-0 flex flex-col justify-end">
                            <div className="flex justify-between text-[10px] font-black text-neutral-500 mb-0.5">
                              <span>시각 강조 파워</span>
                              <span className="text-blue-600">{newObjectPower.sight}점</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={newObjectPower.sight}
                              onChange={(e) => setNewObjectPower({ ...newObjectPower, sight: parseInt(e.target.value) })}
                              className="w-full accent-blue-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Sound */}
                        <div className="bg-white p-3 rounded-lg border-2 border-black flex flex-col md:flex-row gap-3 shadow-[2.5px_2.5px_0px_#000]">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">👂</span>
                              <span className="text-xs font-black text-purple-600">청각 (귀로 들었을 때)</span>
                            </div>
                            <input
                              type="text"
                              value={newObjectSenses.sound}
                              onChange={(e) => setNewObjectSenses({ ...newObjectSenses, sound: e.target.value })}
                              placeholder="예: 흔들면 또르륵또르륵 맑은 소리가 들려요."
                              className="w-full px-2.5 py-1.5 text-xs font-bold border border-black bg-[#FAF7F2] focus:bg-white text-black outline-none rounded"
                            />
                          </div>
                          <div className="w-full md:w-44 shrink-0 flex flex-col justify-end">
                            <div className="flex justify-between text-[10px] font-black text-neutral-500 mb-0.5">
                              <span>청각 강조 파워</span>
                              <span className="text-purple-600">{newObjectPower.sound}점</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={newObjectPower.sound}
                              onChange={(e) => setNewObjectPower({ ...newObjectPower, sound: parseInt(e.target.value) })}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Smell */}
                        <div className="bg-white p-3 rounded-lg border-2 border-black flex flex-col md:flex-row gap-3 shadow-[2.5px_2.5px_0px_#000]">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">👃</span>
                              <span className="text-xs font-black text-orange-600">후각 (코로 냄새를 맡았을 때)</span>
                            </div>
                            <input
                              type="text"
                              value={newObjectSenses.smell}
                              onChange={(e) => setNewObjectSenses({ ...newObjectSenses, smell: e.target.value })}
                              placeholder="예: 새 고무 지우개의 싱그럽고 달달한 포도 향이 나요."
                              className="w-full px-2.5 py-1.5 text-xs font-bold border border-black bg-[#FAF7F2] focus:bg-white text-black outline-none rounded"
                            />
                          </div>
                          <div className="w-full md:w-44 shrink-0 flex flex-col justify-end">
                            <div className="flex justify-between text-[10px] font-black text-neutral-500 mb-0.5">
                              <span>후각 강조 파워</span>
                              <span className="text-orange-600">{newObjectPower.smell}점</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={newObjectPower.smell}
                              onChange={(e) => setNewObjectPower({ ...newObjectPower, smell: parseInt(e.target.value) })}
                              className="w-full accent-orange-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Touch */}
                        <div className="bg-white p-3 rounded-lg border-2 border-black flex flex-col md:flex-row gap-3 shadow-[2.5px_2.5px_0px_#000]">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">🖐️</span>
                              <span className="text-xs font-black text-emerald-600">촉각 (손으로 만졌을 때)</span>
                            </div>
                            <input
                              type="text"
                              value={newObjectSenses.touch}
                              onChange={(e) => setNewObjectSenses({ ...newObjectSenses, touch: e.target.value })}
                              placeholder="예: 보들보들하면서도 말랑말랑해서 기분이 좋아져요."
                              className="w-full px-2.5 py-1.5 text-xs font-bold border border-black bg-[#FAF7F2] focus:bg-white text-black outline-none rounded"
                            />
                          </div>
                          <div className="w-full md:w-44 shrink-0 flex flex-col justify-end">
                            <div className="flex justify-between text-[10px] font-black text-neutral-500 mb-0.5">
                              <span>촉각 강조 파워</span>
                              <span className="text-emerald-600">{newObjectPower.touch}점</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={newObjectPower.touch}
                              onChange={(e) => setNewObjectPower({ ...newObjectPower, touch: parseInt(e.target.value) })}
                              className="w-full accent-teal-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Taste */}
                        <div className="bg-white p-3 rounded-lg border-2 border-black flex flex-col md:flex-row gap-3 shadow-[2.5px_2.5px_0px_#000]">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">👅</span>
                              <span className="text-xs font-black text-rose-600">미각 (맛을 보았을 때 - 선택사항)</span>
                            </div>
                            <input
                              type="text"
                              value={newObjectSenses.taste}
                              onChange={(e) => setNewObjectSenses({ ...newObjectSenses, taste: e.target.value })}
                              placeholder="예: 상상해보면 엄청 새콤하고 찌릿한 오렌지 맛이 날 것 같아요."
                              className="w-full px-2.5 py-1.5 text-xs font-bold border border-black bg-[#FAF7F2] focus:bg-white text-black outline-none rounded"
                            />
                          </div>
                          <div className="w-full md:w-44 shrink-0 flex flex-col justify-end">
                            <div className="flex justify-between text-[10px] font-black text-neutral-500 mb-0.5">
                              <span>미각 강조 파워</span>
                              <span className="text-rose-600">{newObjectPower.taste}점</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={newObjectPower.taste}
                              onChange={(e) => setNewObjectPower({ ...newObjectPower, taste: parseInt(e.target.value) })}
                              className="w-full accent-rose-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setNewObjectName('');
                          setNewObjectIcon('🎒');
                          setNewObjectAuthor('나만의 수사대');
                          setNewObjectSenses({ sight: '', sound: '', smell: '', touch: '', taste: '' });
                          setNewObjectPower({ sight: 50, sound: 50, smell: 50, touch: 50, taste: 10 });
                          playClick();
                        }}
                        className="px-5 py-2 bg-white text-black hover:bg-neutral-100 font-black text-xs border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer"
                      >
                        입력 초기화 ❌
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#FFD32D] text-black hover:bg-yellow-400 font-black text-xs border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer"
                      >
                        수사대에 등록하기! 🚀
                      </button>
                    </div>
                  </form>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs border-2 border-black rounded-lg shadow-[4px_4px_0px_#fff] hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>비밀 레시피 만들기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SLIDE 4: Food Recipe Customizer & SVG Sensory Power Chart */}
            {currentSlide === 4 && (
              <motion.div
                key="slide4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex flex-col h-full overflow-y-auto pr-1.5 scrollbar-thin space-y-4 pb-6"
              >
                <div>
                  <div className="bg-[#FFD32D] text-black px-3 py-1 font-black text-xs uppercase transform -rotate-1 inline-block border-2 border-black shadow-[2px_2px_0px_#000] w-max mb-3">
                    메인 활동 • [냠냠 쩝쩝! 우리 비밀 레시피]
                  </div>
                  
                  {/* HUGE Activity title */}
                  <h2 className="text-3xl md:text-4xl font-black text-black font-sans tracking-tight mb-1">
                    외계인 친구를 위한 <span className="text-[#FF4757] underline decoration-black decoration-wavy decoration-2">환상의 감각 레시피</span>를 설계하라!
                  </h2>
                  <p className="text-neutral-700 text-sm font-bold mb-3">
                    원하는 메인 요리를 고르고 다양한 감각 토핑을 올려 오감 지수가 변화하는 모습을 시뮬레이션해 보세요!
                  </p>
                </div>

                {/* Selector for Base Food - Supports wrapping for added dishes like French Fries and Tteokbokki */}
                <div className="flex flex-wrap gap-2 mb-3 bg-[#FAF7F2] p-1.5 border-2 border-black shadow-[3px_3px_0px_#000] rounded-lg shrink-0">
                  {FOOD_TEMPLATES.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => {
                        setSelectedFoodId(food.id);
                        setActiveToppings([]);
                        setRecipeCompleted(false);
                        playClick();
                      }}
                      className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-black rounded-lg border-2 border-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedFoodId === food.id
                          ? 'bg-[#FFD32D] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] scale-[1.02]'
                          : 'bg-white text-[#2D2D2D] hover:bg-neutral-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <span className="text-lg">{food.emoji}</span>
                      <span>{food.name}</span>
                    </button>
                  ))}
                </div>

                {/* Recipe Workspace */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left Side: Adding Topping Controls */}
                  <div className="md:col-span-7 bg-white p-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-3 min-h-[260px]">
                    <div>
                      <h3 className="text-xs font-black text-neutral-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                        <ChefHat className="w-4 h-4 text-[#FF4757]" />
                        <span>맛있는 {currentFoodTemplate.emoji} {currentFoodTemplate.name} 감각 토핑 추가</span>
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        {currentFoodTemplate.toppings.map((topping) => {
                          const isAdded = activeToppings.includes(topping.id);
                          return (
                            <button
                              key={topping.id}
                              disabled={recipeCompleted}
                              onClick={() => handleToggleTopping(topping.id)}
                              className={`p-2.5 rounded-lg border-2 border-black text-left transition-all flex items-start gap-2 relative cursor-pointer ${
                                recipeCompleted 
                                  ? 'opacity-60 cursor-default'
                                  : 'hover:scale-[1.01]'
                              } ${
                                isAdded
                                  ? 'bg-[#FFD32D]/20 text-neutral-950 shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                                  : 'bg-[#FAF7F2] hover:bg-white text-neutral-700'
                              }`}
                            >
                              <span className="text-xl mt-0.5">{topping.emoji}</span>
                              <div className="flex-1 pr-5">
                                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                                  {topping.sense === 'sight' ? '시각' : topping.sense === 'sound' ? '청각' : topping.sense === 'smell' ? '후각' : '미각'} 토핑 (+{topping.powerBonus})
                                </p>
                                <h4 className="text-xs font-black leading-tight text-neutral-900 mt-0.5">{topping.name.split(': ')[1]}</h4>
                                <p className="text-[9px] font-bold text-neutral-500 mt-0.5">{topping.description}</p>
                              </div>

                              {isAdded && (
                                <div className="absolute top-2 right-2 bg-[#FFD32D] border-2 border-black text-black p-0.5 rounded-full">
                                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Naming Input & Finalize */}
                    <div className="border-t border-dashed border-neutral-200 pt-3 flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        {/* Author Input Field */}
                        <div className="flex gap-2 items-center">
                          <div className="w-1/3 flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            <span className="text-[11px] font-black shrink-0 text-neutral-500">🧑‍🍳 만든이:</span>
                            <input
                              type="text"
                              disabled={recipeCompleted}
                              value={recipeAuthor}
                              onChange={(e) => setRecipeAuthor(e.target.value)}
                              placeholder="이름"
                              className="w-full text-xs font-bold bg-transparent text-black outline-none border-b border-transparent focus:border-black/20"
                            />
                          </div>

                          <input
                            type="text"
                            disabled={recipeCompleted}
                            value={customDishName}
                            onChange={(e) => setCustomDishName(e.target.value)}
                            placeholder="창의적인 요리 이름을 지어주세요! (예: 달콤와작 딸기탕후루)"
                            className="flex-1 px-3 py-2 text-xs font-bold border-2 border-black rounded-lg bg-[#FAF7F2] focus:bg-white text-black outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          {!recipeCompleted ? (
                            <button
                              onClick={handleCompleteRecipe}
                              className="px-6 py-2 bg-[#FF4757] hover:bg-[#ff3c4d] border-2 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] text-white text-xs font-black transition-all cursor-pointer"
                            >
                              요리 완성! 🍽️
                            </button>
                          ) : (
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={handleShareRecipe}
                                className="px-5 py-2 bg-[#2ED573] hover:bg-[#26af5f] border-2 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>친구들과 공유하기! 👥</span>
                              </button>
                              <button
                                onClick={handleResetRecipe}
                                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 border-2 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>다시 요리하기</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: DYNAMIC REAL-TIME SVG RADAR / BAR CHART */}
                  <div className="md:col-span-5 bg-[#1A1A1A] text-white p-4 rounded-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-between items-center min-h-[260px] relative">
                    
                    <div className="w-full flex justify-between items-center z-10">
                      <span className="text-[10px] font-black text-[#FFD32D] tracking-widest uppercase">실시간 오감 레이더 지수</span>
                      {recipeCompleted && (
                        <span className="bg-[#2ED573] text-black border-2 border-black text-[9px] font-black px-2 py-0.5 rounded-full animate-bounce flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>특급 레시피!</span>
                        </span>
                      )}
                    </div>

                    {/* Custom dynamic SVG Pentagon/Radar Chart */}
                    <div className="w-full flex-1 flex justify-center items-center my-2 relative">
                      <svg viewBox="0 0 200 200" className="w-44 h-44 overflow-visible">
                        {/* Background Grid Lines */}
                        {[20, 40, 60, 80, 100].map((level) => {
                          const r = level * 0.8; // max radius is 80 (from center 100,100)
                          const p1 = `${100},${100 - r}`;
                          const p2 = `${100 + r * Math.sin(72 * Math.PI / 180)},${100 - r * Math.cos(72 * Math.PI / 180)}`;
                          const p3 = `${100 + r * Math.sin(144 * Math.PI / 180)},${100 - r * Math.cos(144 * Math.PI / 180)}`;
                          const p4 = `${100 + r * Math.sin(216 * Math.PI / 180)},${100 - r * Math.cos(216 * Math.PI / 180)}`;
                          const p5 = `${100 + r * Math.sin(288 * Math.PI / 180)},${100 - r * Math.cos(288 * Math.PI / 180)}`;
                          return (
                            <polygon
                              key={level}
                              points={`${p1} ${p2} ${p3} ${p4} ${p5}`}
                              fill="none"
                              stroke="rgba(255, 211, 45, 0.15)"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* Axis lines from center */}
                        {Array.from({ length: 5 }).map((_, i) => {
                          const angle = (i * 72) * Math.PI / 180;
                          const x = 100 + 80 * Math.sin(angle);
                          const y = 100 - 80 * Math.cos(angle);
                          return (
                            <line
                              key={i}
                              x1="100"
                              y1="100"
                              x2={x}
                              y2={y}
                              stroke="rgba(255, 255, 255, 0.15)"
                              strokeWidth="1.5"
                              strokeDasharray="2,2"
                            />
                          );
                        })}

                        {/* Data Polygon */}
                        {(() => {
                          const powers = [
                            calculateFoodPower('sight'),
                            calculateFoodPower('sound'),
                            calculateFoodPower('smell'),
                            calculateFoodPower('taste'),
                            calculateFoodPower('touch')
                          ];
                          const coords = powers.map((val, i) => {
                            const r = (val / 100) * 80;
                            const angle = (i * 72) * Math.PI / 180;
                            return `${100 + r * Math.sin(angle)},${100 - r * Math.cos(angle)}`;
                          });
                          return (
                            <polygon
                              points={coords.join(' ')}
                              fill="rgba(255, 71, 87, 0.4)"
                              stroke="#FF4757"
                              strokeWidth="2.5"
                              className="transition-all duration-500"
                            />
                          );
                        })()}

                        {/* Data Points */}
                        {(() => {
                          const powers = [
                            calculateFoodPower('sight'),
                            calculateFoodPower('sound'),
                            calculateFoodPower('smell'),
                            calculateFoodPower('taste'),
                            calculateFoodPower('touch')
                          ];
                          return powers.map((val, i) => {
                            const r = (val / 100) * 80;
                            const angle = (i * 72) * Math.PI / 180;
                            const cx = 100 + r * Math.sin(angle);
                            const cy = 100 - r * Math.cos(angle);
                            return (
                              <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r="4.5"
                                fill="#FFD32D"
                                stroke="#1A1A1A"
                                strokeWidth="2"
                                className="transition-all duration-500"
                              />
                            );
                          });
                        })()}

                        {/* Labels */}
                        {['시각', '청각', '후각', '미각', '촉각'].map((lbl, i) => {
                          const angle = (i * 72) * Math.PI / 180;
                          const offset = 95;
                          const x = 100 + offset * Math.sin(angle);
                          const y = 100 - offset * Math.cos(angle) + 4; // slight center offset adjustments
                          return (
                            <text
                              key={lbl}
                              x={x}
                              y={y}
                              textAnchor="middle"
                              className="text-[11px] font-black fill-zinc-300 font-sans"
                            >
                              {lbl}
                            </text>
                          );
                        })}
                      </svg>

                      {/* Giant Floating Emoji of Food */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1A1A1A] border-2 border-black w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg">
                        {currentFoodTemplate.emoji}
                      </div>
                    </div>

                    {/* Mini certification text */}
                    <div className="w-full text-center z-10 border-t border-neutral-800 pt-2">
                      <p className="text-xs font-bold text-neutral-400">
                        {recipeCompleted ? (
                          <span>
                            🚀 외계인 전송용{' '}
                            <strong className="text-[#FFD32D]">
                              {customDishName || `${currentFoodTemplate.name}`}
                            </strong>{' '}
                            설계 성공!
                          </span>
                        ) : (
                          '감각 토핑을 토글할 때마다 오감도가 실시간 수정됩니다.'
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* --- SHARED RECIPES GALLERY SECTION --- */}
                <div id="shared-recipes-section" className="border-t-4 border-dashed border-neutral-300 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="bg-[#1E90FF] text-white px-2.5 py-0.5 font-black text-[10px] uppercase border-2 border-black shadow-[1.5px_1.5px_0px_#000] rounded-md inline-block mb-1">
                        감각 게시판 • SENSORY FEED
                      </span>
                      <h3 className="text-2xl font-black text-black">
                        👥 친구들이 수사해 만든 <span className="text-[#1E90FF] underline decoration-black decoration-wavy decoration-1">비밀 감각 레시피</span>
                      </h3>
                      <p className="text-xs font-bold text-neutral-500">
                        친구들의 레시피를 보며 칭찬과 하트를 누르고, 훈훈한 댓글(리플)을 남겨 오감을 공유해보세요!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharedRecipes.map((recipe) => (
                      <div 
                        key={recipe.id}
                        className="bg-white rounded-xl border-3 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] transition-all flex flex-col p-4 gap-3 relative overflow-hidden"
                      >
                        {/* Header of Recipe Card */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[#FFD32D]/30 border-2 border-black flex items-center justify-center text-xl shrink-0">
                              {recipe.foodEmoji}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-black leading-tight">{recipe.dishName}</h4>
                              <p className="text-[10px] font-black text-neutral-500 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{recipe.author}</span>
                                <span className="text-neutral-300">•</span>
                                <span>{recipe.createdAt}</span>
                              </p>
                            </div>
                          </div>
                          
                          <span className="bg-neutral-100 text-[10px] font-black border border-black px-1.5 py-0.5 rounded text-neutral-700 whitespace-nowrap">
                            {recipe.foodName.split(' ').pop()}
                          </span>
                        </div>

                        {/* Toppings list */}
                        <div className="bg-[#FAF7F2] p-2.5 rounded-lg border-2 border-black text-xs font-bold text-neutral-800 space-y-1">
                          <p className="text-[10px] font-black text-neutral-400 mb-1 uppercase tracking-wider">추가된 감각 토핑</p>
                          {recipe.toppings.length === 0 ? (
                            <span className="text-neutral-400 italic">추가된 토핑이 없습니다.</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {recipe.toppings.map((t, idx) => (
                                <span key={idx} className="bg-white border border-black rounded px-1.5 py-0.5 text-[10px] flex items-center gap-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                                  <span>{t.emoji}</span>
                                  <span>{t.name.split(': ')[1]}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Radar scores inside cards */}
                        <div className="grid grid-cols-5 gap-1 text-center bg-[#1A1A1A] text-white rounded-lg border-2 border-black p-1.5 text-[9px] font-black">
                          <div>
                            <p className="text-[#FF4757]">👀 시</p>
                            <p className="text-white">{recipe.powers.sight}</p>
                          </div>
                          <div>
                            <p className="text-[#1E90FF]">🔊 청</p>
                            <p className="text-white">{recipe.powers.sound}</p>
                          </div>
                          <div>
                            <p className="text-[#2ED573]">👃 후</p>
                            <p className="text-white">{recipe.powers.smell}</p>
                          </div>
                          <div>
                            <p className="text-[#FFD32D]">👅 미</p>
                            <p className="text-white">{recipe.powers.taste}</p>
                          </div>
                          <div>
                            <p className="text-teal-400">✋ 촉</p>
                            <p className="text-white">{recipe.powers.touch}</p>
                          </div>
                        </div>

                        {/* Liking and Comment counts */}
                        <div className="flex justify-between items-center border-t border-dashed border-neutral-200 pt-2 shrink-0">
                          <button 
                            onClick={() => handleLikeRecipe(recipe.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-md border-2 border-black bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                          >
                            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                            <span>칭찬하기 ({recipe.likes})</span>
                          </button>

                          <span className="text-[11px] font-black text-neutral-500 flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>리플 {recipe.comments.length}개</span>
                          </span>
                        </div>

                        {/* Comments container */}
                        <div className="flex-1 flex flex-col justify-between pt-2 border-t border-neutral-100">
                          {/* Comments List */}
                          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 mb-2 scrollbar-thin text-[11px]">
                            {recipe.comments.map((c, idx) => (
                              <div key={idx} className="bg-neutral-50 rounded border border-neutral-200 p-1.5">
                                <span className="font-black text-neutral-800 mr-1.5">🧑 {c.author}:</span>
                                <span className="text-neutral-700 font-medium">{c.text}</span>
                              </div>
                            ))}
                            {recipe.comments.length === 0 && (
                              <p className="text-neutral-400 italic text-center py-2">첫 번째 리플을 달아 친구의 오감을 칭찬해주세요!</p>
                            )}
                          </div>

                          {/* Comment Form */}
                          <div className="flex gap-1 border-t border-dashed border-neutral-200 pt-2 shrink-0">
                            {/* Nickname Input */}
                            <input 
                              type="text"
                              value={commentAuthors[recipe.id] || ''}
                              onChange={(e) => setCommentAuthors({ ...commentAuthors, [recipe.id]: e.target.value })}
                              placeholder="닉네임"
                              className="w-14 px-1.5 py-1 text-[10px] font-bold border border-black rounded bg-neutral-50 focus:bg-white text-black outline-none"
                            />
                            {/* Comment text Input */}
                            <input 
                              type="text"
                              value={commentInputs[recipe.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [recipe.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(recipe.id);
                                }
                              }}
                              placeholder="칭찬 리플을 입력하세요..."
                              className="flex-1 px-2 py-1 text-[10px] font-bold border border-black rounded bg-neutral-50 focus:bg-white text-black outline-none"
                            />
                            <button
                              onClick={() => handleAddComment(recipe.id)}
                              className="px-2 py-1 bg-black text-white rounded border border-black hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons of slide */}
                <div className="flex justify-between items-center mt-3 pt-4 border-t border-neutral-200 shrink-0">
                  <div className="text-xs text-neutral-600 font-extrabold">
                    {activeToppings.length > 0 ? `활성화된 감각 단서: ${activeToppings.length}개` : '단서들을 마라탕/탕후루/치킨/감자튀김/떡볶이에 입혀보세요.'}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs border-2 border-black rounded-lg shadow-[4px_4px_0px_#fff] hover:translate-y-0.5 transition-all cursor-pointer animate-pulse"
                  >
                    <span>수사 결과 및 명예 훈장 🏅</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SLIDE 5: Medal Awarding & Deep Reflection */}
            {currentSlide === 5 && (
              <motion.div
                key="slide5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col justify-between h-full text-neutral-900"
              >
                <div>
                  <div className="bg-[#FFD32D] text-black px-4 py-1.5 font-black text-xs uppercase transform -rotate-1 inline-block border-2 border-black shadow-[3px_3px_0px_#000] w-max mb-3">
                    수여 단계 • [최고의 오감 탐험대 훈장 수여식]
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
                  
                  {/* Left Column: Rotating Massive Medal */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                    {/* Glowing golden background behind medal */}
                    <div className="absolute w-64 h-64 bg-radial from-[#FFD32D]/35 via-transparent to-transparent blur-2xl" />
                    
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="w-48 h-48 rounded-full border-4 border-[#FFD32D] flex items-center justify-center bg-[#1A1A1A] relative shadow-[0_0_25px_rgba(255,211,45,0.4)]"
                    >
                      {/* Sunburst lines inside medal */}
                      <div className="absolute inset-2 border-2 border-dashed border-[#FFD32D]/40 rounded-full" />
                      
                      <span className="text-8xl select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                        🏅
                      </span>
                    </motion.div>

                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-black text-black tracking-tight font-serif flex items-center justify-center gap-1">
                        <Award className="w-5 h-5 text-[#FF4757]" />
                        <span>명예 감각 탐험대장 훈장</span>
                      </h3>
                      <p className="text-[10px] font-black text-neutral-500 tracking-wider mt-1">SENSORY EXPLORER OF HONOR</p>
                    </div>
                  </div>

                  {/* Right Column: Moving Editorial Reflection with Drop Cap */}
                  <div className="md:col-span-7 flex flex-col justify-center text-left">
                    <p className="text-lg md:text-xl font-medium font-serif leading-relaxed text-neutral-800 max-w-xl">
                      <span className="text-5xl font-black font-serif text-[#FFD32D] float-left mr-3 mt-1 bg-black px-2.5 py-1 border-2 border-black rounded-lg transform -rotate-3 shadow-[2.5px_2.5px_0px_#FF4757]">여</span>
                      러분이 발견한 방울 토마토의 <strong className="text-[#FF4757] font-serif underline decoration-dashed decoration-2">빨갛고 탱글탱글한</strong> 색감과 감촉,
                      비밀 상자 속에 꼭꼭 숨겨져 있던 <strong className="text-purple-700 font-serif">바스락바스락</strong> 소리와 <strong className="text-amber-600 font-serif">새콤달콤한</strong> 향기...
                    </p>
                    <p className="text-lg md:text-xl font-medium font-serif leading-relaxed text-neutral-800 max-w-xl mt-4">
                      무심코 그냥 지나쳤던 소소한 주변의 사물들이 
                      여러분의 <strong className="text-emerald-700 font-serif">감각적 표현</strong>을 만나 무지갯빛 오색찬란한 옷을 입고 세상에 빛나기 시작했습니다.
                    </p>
                    <p className="text-base md:text-lg font-black text-[#FF4757] font-serif mt-4">
                      세상을 가장 아름답고 구체적으로 느낄 줄 아는 여러분 모두가, 진정한 세상을 구한 영웅입니다.
                    </p>

                    {/* Math Equation Box beautifully designed in Neo-brutalism */}
                    <div className="mt-8 p-4 bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_#FFD32D] relative overflow-hidden">
                      <div className="text-center font-serif text-black text-lg">
                        {/* MathJax rendered formula */}
                        $$ 감각 \times 표현 = 우리의 \ 아름다운 \ 일상^2 $$
                      </div>
                    </div>
                  </div>

                </div>

                {/* Return button and navigation */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      setCurrentSlide(0);
                      handlePoemReset();
                      handleResetRecipe();
                      playClick();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs border-2 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>처음부터 다시 수사하기</span>
                  </button>

                  <div className="text-[10px] font-black text-neutral-500 tracking-widest font-mono">
                    PRODUCED BY GOOGLE AI STUDIO BUILD
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* BOTTOM NAVIGATION RIBBON (Exact theme match) */}
        <footer className="bg-white border-t-4 border-black py-3 px-8 flex justify-between items-center shrink-0 z-30">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF4757] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-neutral-600 tracking-wider">Exploration Badge: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Classroom Detective Mode</span>
            </div>
          </div>
          
          {/* Page dots controller from original app */}
          <div className="flex gap-2.5 items-center">
            {Array.from({ length: 6 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  playClick();
                }}
                className={`h-3.5 rounded-full border-2 border-black transition-all cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-9 bg-[#FF4757] shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]' 
                    : 'w-3.5 bg-neutral-200 hover:bg-neutral-300'
                }`}
                title={`슬라이드 ${idx + 1}`}
              />
            ))}
          </div>

          {/* Chevron buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`px-3.5 py-2 border-2 border-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                currentSlide === 0 
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed shadow-none' 
                  : 'bg-white hover:bg-neutral-50 text-black shadow-[2px_2px_0px_#000] active:translate-y-0.5'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>이전</span>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === 5}
              className={`px-3.5 py-2 border-2 border-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                currentSlide === 5 
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed shadow-none' 
                  : 'bg-[#FFD32D] hover:bg-yellow-400 text-black shadow-[2px_2px_0px_#000] active:translate-y-0.5'
              }`}
            >
              <span>다음</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
