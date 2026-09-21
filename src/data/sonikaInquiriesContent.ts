export type SonikaInquiry = {
  id: string;
  question: string;
  topic: string;
  answerParagraphs: readonly string[];
};

export const INQUIRE_WITH_SONIKA_HERO = {
  title: 'Inquire with Sonika',
  subtitle: 'Your inquiries. Sonika\u2019s insights.',
  lede:
    'Explore insights from Sonika around the questions that arise in everyday life. Submit an inquiry and receive a perspective rooted in presence and awareness.',
  remembrance: 'And always remember, the answers you seek are already within you.',
  invitation:
    'Submit your inquiry here and remain anonymous. Sonika personally reads each inquiry, offering her insights and perspective while always pointing you back to the wisdom within yourself.',
  closing:
    'There are no small questions on the path within. Each question is a doorway to deeper understanding.',
} as const;

export const SONIKA_INQUIRIES: readonly SonikaInquiry[] = [
  {
    id: 'overthinking',
    question: 'How do I stop overthinking when my mind just won\u2019t turn off?',
    topic: 'Presence & mind',
    answerParagraphs: [
      'Overthinking happens when your attention is pulled away from the present moment and into the stream of thought. The mind continues because you continue feeding it with your attention, in other words that\u2019s where all of your attention is. You don\u2019t need to fight your thoughts or force them to stop. Simply recognize when you\u2019ve become absorbed in them. The moment you notice, a small space has already opened between you and the mind.',
      'From there, gently return your attention to what is here now. Focus on your breath by paying attention to your inhale and exhale. Listen to the silence around you, for the most distant sound you can hear. Notice your surroundings, where you are, what you are doing. Each time the mind pulls you away, pause and return. The more you rest your attention in the present moment, the less power the stream of thinking has over you.',
    ],
  },
  {
    id: 'kids-triggers',
    question: 'How do I stay present with my kids when their behavior triggers me?',
    topic: 'Parenting & presence',
    answerParagraphs: [
      'The moment you recognize you\u2019re no longer present, awareness has already returned. A trigger reveals something being activated within you: an expectation, judgment, fear, or old pattern.',
      'Instead of immediately following the story your mind creates, notice the reaction within you. Allow it to be there without fighting it or acting from it. Create enough space to see the moment as it actually is, rather than through the emotion surrounding it. And if you do react, notice that too. Awareness can return at any moment. Over time, what once triggered you may begin to lose its power, leaving more space for your child to be themselves, and for you to simply be present with them.',
    ],
  },
  {
    id: 'observe-thoughts',
    question: 'What does it actually mean to \u201cobserve your thoughts?\u201d',
    topic: 'Inner observation',
    answerParagraphs: [
      'Observing your thoughts simply means becoming aware of what the voice in your head is saying. Instead of unconsciously believing and becoming every thought, you begin to notice the activity of the mind.',
      'In that noticing, space appears. You can hear the thought without being the thought. Stillness and meditation can help you recognize this, not through force, but through relaxed awareness of your inner world. The moment you can observe a thought, you have already stepped outside of it. And beneath the constant stream of thinking, you begin to discover the peace that was there all along.',
    ],
  },
  {
    id: 'let-go-past',
    question: 'How do I let go of the past when what happened still affects me today?',
    topic: 'Letting go',
    answerParagraphs: [
      'The past may be over, but the mind can continue carrying it through memories, stories, emotions, and patterns. Each time we replay the story and give it our attention, we experience it again in the present.',
      'Letting go begins with awareness. Notice when the past arises and ask yourself: What is the benefit of keeping this alive? Is holding onto it bringing me peace, or creating more suffering? This doesn\u2019t mean denying what happened or pretending it didn\u2019t matter. It means recognizing that continuing to carry the story cannot change what happened, it only allows the past to continue affecting this moment.',
      'As you begin to see this clearly, you can stop feeding the story with your attention. And little by little, what you\u2019ve been carrying can begin to loosen and pass through.',
    ],
  },
  {
    id: 'not-enough',
    question:
      'Why do I still feel like I\u2019m not enough, even when I know I\u2019ve accomplished so much?',
    topic: 'Self-worth',
    answerParagraphs: [
      'When we look outside ourselves for a sense of wholeness, there will always be another achievement, milestone, relationship, or amount of money that promises to finally make us feel complete. Happiness may come, but it is often short lived.',
      'Beneath it may be an unseen belief that says, who I am right now is not enough. Until that pattern is seen, no accomplishment can permanently satisfy it. When you become aware of the belief instead of continuing to live from it, something shifts. You begin to discover that your enoughness was never something you had to earn. It was simply covered by everything you came to believe about yourself.',
    ],
  },
  {
    id: 'peace-without-change',
    question: 'How do I stop needing someone else to change before I can be at peace?',
    topic: 'Relationships & peace',
    answerParagraphs: [
      'Your peace does not require another person to change. When we believe someone needs to behave differently for us to feel okay, we place our inner state in their hands.',
      'Acceptance doesn\u2019t mean tolerating harmful behavior or remaining in situations that aren\u2019t right for you. It means letting go of the inner demand that another person must be different before you can be at peace. When you reconnect with the stillness beneath your own mind, you can see others more clearly without becoming consumed by their behavior. From that place, you can still set boundaries, leave, speak up, or make a change, but your actions come from clarity rather than resistance. It takes one person to be at peace, to be present, and that person is you.',
    ],
  },
] as const;

export const FEATURED_INQUIRY_ID = SONIKA_INQUIRIES[0].id;
