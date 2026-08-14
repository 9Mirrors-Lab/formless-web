/** Timed read-along cues aligned to published chapter audio. */

import type { AudioSentence } from '@/data/audioBook';

function sentences(
  chapterId: number,
  lines: Array<{ text: string; start: number; end: number }>,
): AudioSentence[] {
  return lines.map((line, index) => ({
    id: `c${chapterId}-s${index + 1}`,
    text: line.text,
    start: line.start,
    end: line.end,
  }));
}

/** Chapter 1 read-along cues aligned to the uploaded original master (whisper-timed). */
const CHAPTER_1_MANUSCRIPT = sentences(1, [
  {
    text: 'Chapter 1. The Feeling of Wholeness.',
    start: 0,
    end: 5.66,
  },
  {
    text: 'You’ve made it in life. You have the house, the family, the career, the steady routine that signals success.',
    start: 5.66,
    end: 14.5,
  },
  {
    text: 'The life you once imagined has mostly unfolded.',
    start: 14.5,
    end: 18.0,
  },
  {
    text: 'And yet, a familiar emptiness lingers. A quiet unease. A sense of not feeling whole, not having arrived.',
    start: 18.0,
    end: 28.76,
  },
  {
    text: 'No matter what you achieve, something in you keeps wanting more.',
    start: 28.76,
    end: 34.24,
  },
  {
    text: 'If it’s not this house, maybe a bigger one will finally make you happy. If it’s not this relationship, perhaps the next one will bring you back to life.',
    start: 34.24,
    end: 44.92,
  },
  {
    text: 'Maybe it’s a new job. A different city. A fresh start. Then you think everything will feel right.',
    start: 44.92,
    end: 53.2,
  },
  {
    text: 'Your mind convinces you that fulfillment is just one change away.',
    start: 53.2,
    end: 58.5,
  },
  {
    text: 'That if the outer picture can be changed, the inner emptiness will disappear.',
    start: 58.5,
    end: 66.8,
  },
  {
    text: 'Yet, no matter how many times you rearrange the furniture of your life, the quiet ache returns, reminding you that what you seek cannot be found in the next thing, the next place, or the next person.',
    start: 66.8,
    end: 78.84,
  },
  {
    text: 'You begin to question it. How can you have accomplished so much and still feel like something is missing?',
    start: 78.84,
    end: 88.0,
  },
  {
    text: 'The struggle continues. The finish line keeps moving. You wait for the world to reflect your happiness back to you, expecting it to tell you who you are to make you feel complete.',
    start: 88.0,
    end: 104.48,
  },
  {
    text: 'You believe peace and wholeness live somewhere outside of you, and you just have to find them.',
    start: 104.48,
    end: 111.64,
  },
  {
    text: 'And so the search goes on as you continue wanting something more, something different.',
    start: 111.64,
    end: 119.4,
  },
  {
    text: 'You haven’t yet realized that what you’re searching for has never been missing.',
    start: 119.4,
    end: 127.12,
  },
  {
    text: 'It isn’t out there in the world. It’s here, alive within you, beneath the noise of wanting.',
    start: 127.12,
    end: 136.24,
  },
  {
    text: 'Every moment you’ve been chasing, every desire you’ve tried to fulfill has been leading you back to this, the stillness inside, the wholeness that has never left.',
    start: 136.24,
    end: 150.16,
  },
]);

const CHAPTER_4_MANUSCRIPT = sentences(4, [
  {
    text: 'Resistance is the mind’s attempt to keep the known world intact.',
    start: 0,
    end: 6.4,
  },
  {
    text: 'It tightens around what feels threatening, and calls that tightness protection.',
    start: 6.4,
    end: 13.8,
  },
  {
    text: 'Surrender is not collapse. It is the willingness to see without defending.',
    start: 13.8,
    end: 21.2,
  },
  {
    text: 'When you stop fighting the moment, space opens around the thought.',
    start: 21.2,
    end: 28.0,
  },
  {
    text: 'In that space, you are no longer the resistance. You are the awareness that notices it.',
    start: 28.0,
    end: 37.5,
  },
]);

/** Opening Credits read-along cues aligned to the optimized ACX master (whisper-timed). */
const CHAPTER_13_MANUSCRIPT = sentences(13, [
  {
    text: 'Formless, who you truly are beyond the mind.',
    start: 2.1,
    end: 8.84,
  },
  {
    text: 'A Journey Within.',
    start: 8.99,
    end: 11.59,
  },
  {
    text: 'Written and narrated by Sonika Cottman.',
    start: 11.75,
    end: 17.72,
  },
  {
    text: 'Dedicated to my two greatest teachers, my children, Naya and S.J.',
    start: 17.87,
    end: 23.55,
  },
  {
    text: 'Published by Eyes Closed Publishing.',
    start: 23.62,
    end: 26.1,
  },
  {
    text: 'When you truly recognize that you are not your thoughts and emotions, a different way of living reveals itself.',
    start: 26.1,
    end: 36.1,
  },
  {
    text: 'You discover that you can be at peace regardless of your outer circumstances.',
    start: 36.1,
    end: 41.65,
  },
]);

/** Acknowledgments read-along cues aligned to the optimized ACX master (whisper-timed). */
const CHAPTER_12_MANUSCRIPT = sentences(12, [
  {
    text: 'Acknowledgments.',
    start: 2.0,
    end: 3.71,
  },
  {
    text: 'Something I\'ve learned on this journey is that nothing happens in isolation.',
    start: 3.82,
    end: 11.94,
  },
  {
    text: 'Formless is the result of countless experiences, lessons, and people who shaped me and guided me toward transformation.',
    start: 11.94,
    end: 20.43,
  },
  {
    text: 'I want to acknowledge those who deeply impacted this journey.',
    start: 20.53,
    end: 26.69,
  },
  {
    text: 'I would like to begin by expressing my gratitude to Eckhart Tolle and Dr. Joe Dispenza.',
    start: 26.79,
    end: 34.57,
  },
  {
    text: 'Their teachings helped me illuminate a path that ultimately led me back to myself.',
    start: 34.66,
    end: 40.75,
  },
  {
    text: 'Through their books, talks, and wisdom, my awakening journey began.',
    start: 40.82,
    end: 46.09,
  },
  {
    text: 'They provided language for experiences I started to discover firsthand and inspired a deeper exploration of awareness, presence, and the nature of who we are.',
    start: 46.17,
    end: 59.15,
  },
  {
    text: 'Their work helped bridge the worlds of science and spirituality in a way that deeply resonated with me.',
    start: 59.23,
    end: 68.0,
  },
  {
    text: 'While this book reflects my own journey and understanding, their teachings played a meaningful role in the transformation that made it possible.',
    start: 68.08,
    end: 81.18,
  },
  {
    text: 'I knew years ago that one day I would write this book, but Formless would not exist today without Simon Golden and his incredible team of coaches, editors, and writers.',
    start: 81.28,
    end: 94.49,
  },
  {
    text: 'This journey has been deeply fulfilling and a large part of that has been working alongside Simon, his team, and the other talented authors I have met along the way.',
    start: 94.57,
    end: 107.29,
  },
  {
    text: 'I want to particularly acknowledge my writing coach and editor, Kate Williams.',
    start: 107.37,
    end: 113.77,
  },
  {
    text: 'You guided me through this entire writing process with honesty, patience, and care.',
    start: 113.85,
    end: 120.26,
  },
  {
    text: 'I came to you with an open mind and you challenged me to think bigger and pushed me past my own limitations.',
    start: 120.33,
    end: 128.28,
  },
  {
    text: 'You helped bring clarity, credibility, and depth to this book while allowing it to remain true to my voice.',
    start: 128.28,
    end: 136.68,
  },
  {
    text: 'You are truly a master of your craft, and I will always be grateful for the role you played in helping Formless become what it is.',
    start: 136.75,
    end: 147.65,
  },
  {
    text: 'To my dad, Ashok, our journey together taught me some of life\'s most important lessons about healing, forgiveness, acceptance, and compassion.',
    start: 147.75,
    end: 159.88,
  },
  {
    text: 'Through both the challenges and the love, I gained wisdom that became an essential part of my own evolution.',
    start: 159.88,
    end: 168.95,
  },
  {
    text: 'I am grateful for those lessons and for the relationship we continue to build today.',
    start: 169.02,
    end: 175.28,
  },
  {
    text: 'To my siblings, Shalini and Manesh, thank you for helping raise me and for being part of this transformation within our family.',
    start: 175.28,
    end: 185.98,
  },
  {
    text: 'Thank you for keeping your hearts open and allowing our relationship to grow and deepen in new ways.',
    start: 186.05,
    end: 193.6,
  },
  {
    text: 'You have both been an important part of my awakening.',
    start: 193.69,
    end: 198.53,
  },
  {
    text: 'To my cousin, Kritika, one of the first people to embrace this journey alongside me, your openness to living differently and applying these teachings has been inspiring.',
    start: 198.64,
    end: 214.83,
  },
  {
    text: 'Thank you for encouraging me to share these insights more openly and for seeing the possibility of what Eyes Closed could become.',
    start: 214.92,
    end: 224.12,
  },
  {
    text: 'To my mom, Simmy, a true gem in my life, you have stood beside me from the very beginning and courageously embraced your own path of growth, self-discovery, and healing.',
    start: 224.23,
    end: 240.08,
  },
  {
    text: 'I have witnessed such a beautiful shift within you.',
    start: 240.16,
    end: 243.31,
  },
  {
    text: 'One of the most meaningful moments of this journey has been watching our relationship deepen in ways I never imagined possible.',
    start: 243.37,
    end: 252.38,
  },
  {
    text: 'Your love and openness have touched my heart more than words can express.',
    start: 252.46,
    end: 259.25,
  },
  {
    text: 'To my former husband, Sean, who remains someone deeply important in my life, our relationship has evolved in remarkable ways over the past 25 years.',
    start: 259.35,
    end: 271.18,
  },
  {
    text: 'Thank you for trusting me, supporting me, and believing in the path I needed to take.',
    start: 271.27,
    end: 278.64,
  },
  {
    text: 'Thank you for the way we continue to raise our children together with love, respect, and trust.',
    start: 278.64,
    end: 285.36,
  },
  {
    text: 'Most of all, thank you for your own growth and willingness to live life differently.',
    start: 285.36,
    end: 293.2,
  },
  {
    text: 'I am deeply grateful for you and your wonderful wife, Chelsea.',
    start: 293.29,
    end: 299.49,
  },
  {
    text: 'To my two dogs, Bernie and Opal, who transformed my relationship with animals.',
    start: 299.6,
    end: 306.51,
  },
  {
    text: 'Thank you for showing me what it means to live fully in the present moment.',
    start: 306.58,
    end: 311.63,
  },
  {
    text: 'Through your unconditional love and presence, you helped me reconnect with the intelligence woven throughout all of life.',
    start: 311.71,
    end: 321.21,
  },
  {
    text: 'You were a deep inspiration for the nature, animals, and presence chapter, and I am grateful for all that you continue to teach me.',
    start: 321.29,
    end: 332.83,
  },
  {
    text: 'To my beautiful children, Naya and S.J., full of love, curiosity, compassion, and light.',
    start: 332.93,
    end: 342.54,
  },
  {
    text: 'One of the greatest gifts of these past few years has been watching both of you grow through my own transformation.',
    start: 342.66,
    end: 353.75,
  },
  {
    text: 'As I changed, I watched the impact ripple into your lives as well.',
    start: 353.84,
    end: 360.3,
  },
  {
    text: 'I could not be more proud of the human beings you are becoming.',
    start: 360.4,
    end: 365.98,
  },
  {
    text: 'Thank you for your patience throughout the process of writing Formless and building Eyes Closed.',
    start: 366.05,
    end: 373.32,
  },
  {
    text: 'You both are my greatest teachers.',
    start: 373.41,
    end: 376.37,
  },
  {
    text: 'Through both of you, I see the innocence, wisdom, and light that lives within all children.',
    start: 376.46,
    end: 385.64,
  },
  {
    text: 'To my partner, Ryan.',
    start: 385.75,
    end: 387.68,
  },
  {
    text: 'This transformation would not have unfolded the way it did if our paths had not crossed.',
    start: 387.77,
    end: 395.56,
  },
  {
    text: 'You believed in me and saw my true essence before I had fully awakened to it.',
    start: 395.56,
    end: 402.83,
  },
  {
    text: 'People enter our lives for a reason.',
    start: 402.93,
    end: 405.64,
  },
  {
    text: 'Looking back, I can see the meaning and synchronicity in the way our paths came together.',
    start: 405.72,
    end: 413.05,
  },
  {
    text: 'Formless and Eyes Closed would not exist without you.',
    start: 413.17,
    end: 419.14,
  },
  {
    text: 'I will always carry deep gratitude in my heart.',
    start: 419.25,
    end: 424.31,
  },
  {
    text: 'Thank you for helping me share this message with the world.',
    start: 424.42,
    end: 428.73,
  },
]);

const MANUSCRIPTS: Record<number, AudioSentence[]> = {
  1: CHAPTER_1_MANUSCRIPT,
  4: CHAPTER_4_MANUSCRIPT,
  12: CHAPTER_12_MANUSCRIPT,
  13: CHAPTER_13_MANUSCRIPT,
};

export function manuscriptForChapter(chapterId: number): AudioSentence[] {
  return MANUSCRIPTS[chapterId] ?? [];
}
