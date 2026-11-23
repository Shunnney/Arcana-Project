import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTarotCardDto } from './dto/create-tarot-card.dto';
import { UpdateTarotCardDto } from './dto/update-tarot-card.dto';
import { TarotCard } from './entities/tarot-card.entity';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const INITIAL_CARDS: TarotCard[] = [
  {
    id: 0,
    number: 0,
    name: 'The Fool',
    numeral: '0',
    arcana: 'Major Arcana',
    theme: 'fool',
    glyph: '✧',
    keywords: ['Beginnings', 'Innocence', 'Leap of faith'],
    summary: 'A leap of faith into the unknown.',
    description:
      'The Fool stands at the edge of a cliff with a light pack and an open heart. This card invites you to begin something new without needing every answer, trusting that curiosity is a worthy guide.',
    meaning:
      'The Fool stands at the edge of a cliff with a light pack and an open heart. This card invites you to begin something new without needing every answer, trusting that curiosity is a worthy guide.',
    uprightMeaning:
      'New beginnings, Spontaneity, Openness, Trust in the journey',
    reversedMeaning: 'Recklessness, Hesitation, Naivety',
    upright: [
      'New beginnings',
      'Spontaneity',
      'Openness',
      'Trust in the journey',
    ],
    reversed: ['Recklessness', 'Hesitation', 'Naivety'],
    symbolism:
      'A traveler poised on a precipice, carrying a white rose of purity and accompanied by a loyal dog warning of danger.',
    element: 'Air',
    planet: 'Uranus',
    zodiac: 'Aquarius',
    love: 'A fresh connection, or a fresh openness within an existing one. Stay curious and unguarded.',
    career:
      'A new venture or role is calling. Take the first step before everything is perfectly planned.',
    growth: 'Let yourself be a beginner again. Not knowing is where learning starts.',
    quote: 'Every journey begins with a single, unguarded step.',
    themes: ['growth', 'hope'],
    slug: 'the-fool',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/0.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 1,
    number: 1,
    name: 'The Magician',
    numeral: 'I',
    arcana: 'Major Arcana',
    theme: 'magician',
    glyph: '✦',
    keywords: ['Willpower', 'Skill', 'Manifestation'],
    summary: 'Everything you need is already in your hands.',
    description:
      'The Magician channels what is above into what is below, turning intention into action. He reminds you that you already hold the tools — focus, craft, and will — to shape what comes next.',
    meaning:
      'The Magician channels what is above into what is below, turning intention into action. He reminds you that you already hold the tools — focus, craft, and will — to shape what comes next.',
    uprightMeaning: 'Resourcefulness, Focus, Inspired action, Confidence',
    reversedMeaning: 'Scattered energy, Manipulation, Untapped potential',
    upright: ['Resourcefulness', 'Focus', 'Inspired action', 'Confidence'],
    reversed: ['Scattered energy', 'Manipulation', 'Untapped potential'],
    symbolism:
      'The lemniscate of eternity above his head, wand raised to the sky, and table set with the four tarot elemental suits.',
    element: 'Air',
    planet: 'Mercury',
    zodiac: 'Gemini',
    love: 'Express yourself clearly. Honest, intentional communication builds real connection.',
    career: 'Your skills are enough. Pick one goal and aim your talent at it.',
    growth: 'Intention becomes real through practice. Start small and repeat.',
    quote: 'As above, so below; as within, so without.',
    themes: ['career', 'growth'],
    slug: 'the-magician',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/1.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    number: 2,
    name: 'The High Priestess',
    numeral: 'II',
    arcana: 'Major Arcana',
    theme: 'priestess',
    glyph: '☾',
    keywords: ['Intuition', 'Mystery', 'Inner knowing'],
    summary: 'Listen to what is not being said.',
    description:
      'The High Priestess sits between two pillars, guarding the threshold of the subconscious. She asks you to slow down, go inward, and trust the quiet knowledge that arrives before words do.',
    meaning:
      'The High Priestess sits between two pillars, guarding the threshold of the subconscious. She asks you to slow down, go inward, and trust the quiet knowledge that arrives before words do.',
    uprightMeaning: 'Intuition, Stillness, Hidden knowledge, Reflection',
    reversedMeaning: 'Ignored instincts, Secrets, Disconnection',
    upright: ['Intuition', 'Stillness', 'Hidden knowledge', 'Reflection'],
    reversed: ['Ignored instincts', 'Secrets', 'Disconnection'],
    symbolism:
      'The twin pillars of Boaz and Jachin, a pomegranated veil concealing divine mysteries, and a crescent moon resting at her feet.',
    element: 'Water',
    planet: 'Moon',
    zodiac: 'Cancer',
    love: 'Feelings may be unspoken. Notice what your intuition says before you act.',
    career: 'Observe before you decide. Not every detail is visible yet.',
    growth: 'Quiet is not empty. Make room for stillness and journaling.',
    quote: 'Some answers arrive only when you stop asking.',
    themes: ['growth', 'shadow'],
    slug: 'the-high-priestess',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/2.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    number: 3,
    name: 'The Empress',
    numeral: 'III',
    arcana: 'Major Arcana',
    theme: 'empress',
    glyph: '❦',
    keywords: ['Nurture', 'Abundance', 'Creativity'],
    summary: 'Care grows what it touches.',
    description:
      'The Empress is the garden in full bloom: sensual, generous, and creative. She represents nurturing — of people, of ideas, of yourself — and the abundance that follows patient care.',
    meaning:
      'The Empress is the garden in full bloom: sensual, generous, and creative. She represents nurturing — of people, of ideas, of yourself — and the abundance that follows patient care.',
    uprightMeaning: 'Nurturing, Abundance, Creativity, Comfort',
    reversedMeaning: 'Neglect, Creative block, Overgiving',
    upright: ['Nurturing', 'Abundance', 'Creativity', 'Comfort'],
    reversed: ['Neglect', 'Creative block', 'Overgiving'],
    symbolism:
      'A crown of twelve six-pointed stars, lush golden wheat field, flowing stream, and the shield of Venus.',
    element: 'Earth',
    planet: 'Venus',
    zodiac: 'Taurus',
    love: 'Warmth, affection and devotion. Let love be tender and unhurried.',
    career:
      'Creative projects flourish with care. Invest in what you want to grow.',
    growth: "Tend to your own needs as faithfully as you tend to others'.",
    quote: 'What you nurture, you grow.',
    themes: ['love', 'growth'],
    slug: 'the-empress',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/3.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    number: 4,
    name: 'The Emperor',
    numeral: 'IV',
    arcana: 'Major Arcana',
    theme: 'emperor',
    glyph: '♔',
    keywords: ['Structure', 'Authority', 'Stability'],
    summary: 'Build on steady ground.',
    description:
      'The Emperor brings order to chaos through discipline and clear boundaries. His strength is the foundation beneath a well-built life: structure, responsibility, and calm leadership.',
    meaning:
      'The Emperor brings order to chaos through discipline and clear boundaries. His strength is the foundation beneath a well-built life: structure, responsibility, and calm leadership.',
    uprightMeaning: 'Structure, Leadership, Stability, Discipline',
    reversedMeaning: 'Rigidity, Control, Lack of discipline',
    upright: ['Structure', 'Leadership', 'Stability', 'Discipline'],
    reversed: ['Rigidity', 'Control', 'Lack of discipline'],
    symbolism:
      'A stone cubic throne carved with ram heads, an orb of dominion, an ankh scepter, and rugged mountain ramparts.',
    element: 'Fire',
    planet: 'Mars',
    zodiac: 'Aries',
    love: 'Reliability and commitment matter. Clear boundaries make a relationship feel safe.',
    career:
      'Lead with a plan. Systems and consistency will carry you further than force.',
    growth:
      'Create routines that support you. Structure can be a form of self-respect.',
    quote: 'Order is the quiet partner of freedom.',
    themes: ['career'],
    slug: 'the-emperor',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/4.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    number: 5,
    name: 'The Hierophant',
    numeral: 'V',
    arcana: 'Major Arcana',
    theme: 'hierophant',
    glyph: '✢',
    keywords: ['Tradition', 'Guidance', 'Learning'],
    summary: 'Wisdom is passed from hand to hand.',
    description:
      'The Hierophant is the keeper of shared tradition: teachers, institutions, and the values passed between generations. The card asks what you were taught, what you still believe, and who can guide you now.',
    meaning:
      'The Hierophant is the keeper of shared tradition: teachers, institutions, and the values passed between generations. The card asks what you were taught, what you still believe, and who can guide you now.',
    uprightMeaning: 'Tradition, Mentorship, Shared values, Learning',
    reversedMeaning: 'Rebellion, Dogma, Questioning rules',
    upright: ['Tradition', 'Mentorship', 'Shared values', 'Learning'],
    reversed: ['Rebellion', 'Dogma', 'Questioning rules'],
    symbolism:
      'Triple papal cross, the crossed golden keys of spiritual knowledge, and two priests receiving wisdom.',
    element: 'Earth',
    planet: 'Venus',
    zodiac: 'Taurus',
    love: 'Shared values and commitment deepen a bond. Rituals can make love feel steady.',
    career:
      'A mentor or formal path can help. Learn the rules before you reshape them.',
    growth: 'Seek teachers, then decide for yourself what truly fits.',
    quote: 'To learn is to be handed a lantern.',
    themes: ['career', 'growth'],
    slug: 'the-hierophant',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/5.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    number: 6,
    name: 'The Lovers',
    numeral: 'VI',
    arcana: 'Major Arcana',
    theme: 'lovers',
    glyph: '♡',
    keywords: ['Union', 'Choice', 'Alignment'],
    summary: 'Choose what aligns with your heart.',
    description:
      'The Lovers is about connection and the choices that reveal who we are. Beyond romance, it asks you to align your actions with your values and to choose with honesty.',
    meaning:
      'The Lovers is about connection and the choices that reveal who we are. Beyond romance, it asks you to align your actions with your values and to choose with honesty.',
    uprightMeaning: 'Harmony, Connection, Values, Meaningful choice',
    reversedMeaning: 'Misalignment, Indecision, Disconnection',
    upright: ['Harmony', 'Connection', 'Values', 'Meaningful choice'],
    reversed: ['Misalignment', 'Indecision', 'Disconnection'],
    symbolism:
      'Archangel Raphael showering blessing over Adam and Eve, flanked by the Tree of Life and the Tree of Knowledge.',
    element: 'Air',
    planet: 'Mercury',
    zodiac: 'Gemini',
    love: 'A deep bond or an honest choice about one. Be truthful about what you want.',
    career:
      'A decision about direction or partnership. Choose what matches your values.',
    growth: 'Your choices are mirrors. Make the ones you can stand behind.',
    quote: 'To choose is to say who you are.',
    themes: ['love'],
    slug: 'the-lovers',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/6.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 7,
    number: 7,
    name: 'The Chariot',
    numeral: 'VII',
    arcana: 'Major Arcana',
    theme: 'chariot',
    glyph: '✪',
    keywords: ['Determination', 'Control', 'Victory'],
    summary: 'Hold the reins and move forward.',
    description:
      'The Chariot is driven by two opposing forces held in balance by will. Progress comes when you steer with focus and decide which of your pulls to follow.',
    meaning:
      'The Chariot is driven by two opposing forces held in balance by will. Progress comes when you steer with focus and decide which of your pulls to follow.',
    uprightMeaning: 'Determination, Momentum, Self-discipline, Victory',
    reversedMeaning: 'Lack of direction, Aggression, Burnout',
    upright: ['Determination', 'Momentum', 'Self-discipline', 'Victory'],
    reversed: ['Lack of direction', 'Aggression', 'Burnout'],
    symbolism:
      'Two opposing sphinxes harnessed without physical reins, driven solely by the charioteer’s focused resolve under a starry canopy.',
    element: 'Water',
    planet: 'Moon',
    zodiac: 'Cancer',
    love: 'Move forward with intention. Do not let competing wants pull you in two directions.',
    career: 'Momentum is building. Focus your energy on one clear goal.',
    growth:
      'Discipline is a form of direction. Steer yourself with kindness and resolve.',
    quote: 'Victory belongs to those who keep steering.',
    themes: ['career', 'growth'],
    slug: 'the-chariot',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/7.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 8,
    number: 8,
    name: 'Strength',
    numeral: 'VIII',
    arcana: 'Major Arcana',
    theme: 'strength',
    glyph: '∞',
    keywords: ['Courage', 'Compassion', 'Patience'],
    summary: 'Gentle power outlasts force.',
    description:
      'Strength shows a figure calming a lion with a gentle hand. True courage here is not domination but patience, compassion, and mastery of your own instincts.',
    meaning:
      'Strength shows a figure calming a lion with a gentle hand. True courage here is not domination but patience, compassion, and mastery of your own instincts.',
    uprightMeaning: 'Courage, Compassion, Patience, Inner resolve',
    reversedMeaning: 'Self-doubt, Raw emotion, Insecurity',
    upright: ['Courage', 'Compassion', 'Patience', 'Inner resolve'],
    reversed: ['Self-doubt', 'Raw emotion', 'Insecurity'],
    symbolism:
      'A serene woman gently closing the jaws of a lion, crowned with the infinity symbol and clad in white flowers.',
    element: 'Fire',
    planet: 'Sun',
    zodiac: 'Leo',
    love: 'Meet vulnerability with patience. Softness can be the bravest choice.',
    career:
      'Handle pressure calmly. Steady influence works better than pushing.',
    growth: 'You can be gentle with yourself and still be strong.',
    quote: 'The bravest thing is to stay gentle.',
    themes: ['growth', 'hope'],
    slug: 'strength',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/8.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 9,
    number: 9,
    name: 'The Hermit',
    numeral: 'IX',
    arcana: 'Major Arcana',
    theme: 'hermit',
    glyph: '✺',
    keywords: ['Solitude', 'Reflection', 'Guidance'],
    summary: 'Light your own lantern.',
    description:
      'The Hermit withdraws from the noise to find his own light. This card marks a season of solitude, study, and introspection, where wisdom is gathered quietly.',
    meaning:
      'The Hermit withdraws from the noise to find his own light. This card marks a season of solitude, study, and introspection, where wisdom is gathered quietly.',
    uprightMeaning: 'Introspection, Solitude, Wisdom, Searching',
    reversedMeaning: 'Isolation, Loneliness, Withdrawal',
    upright: ['Introspection', 'Solitude', 'Wisdom', 'Searching'],
    reversed: ['Isolation', 'Loneliness', 'Withdrawal'],
    symbolism:
      'An elder cloaked in grey standing on snowy crags, lifting a lantern containing the six-pointed star of truth.',
    element: 'Earth',
    planet: 'Mercury',
    zodiac: 'Virgo',
    love: 'Time alone may clarify what you truly need. Return to others with that clarity.',
    career: 'Step back, research, and reflect before the next move.',
    growth: 'Solitude is a teacher when you listen. Take time to reflect.',
    quote: 'Even a small lantern lights the whole path.',
    themes: ['growth', 'shadow'],
    slug: 'the-hermit',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/9.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 10,
    number: 10,
    name: 'Wheel of Fortune',
    numeral: 'X',
    arcana: 'Major Arcana',
    theme: 'wheel',
    glyph: '☸',
    keywords: ['Cycles', 'Change', 'Fate'],
    summary: 'Everything turns, in time.',
    description:
      'The Wheel of Fortune turns through seasons of rise and fall. It reminds you that circumstances change, luck shifts, and each cycle carries lessons worth keeping.',
    meaning:
      'The Wheel of Fortune turns through seasons of rise and fall. It reminds you that circumstances change, luck shifts, and each cycle carries lessons worth keeping.',
    uprightMeaning: 'Cycles, Turning points, Luck, Change',
    reversedMeaning: 'Resistance to change, Setbacks, Bad timing',
    upright: ['Cycles', 'Turning points', 'Luck', 'Change'],
    reversed: ['Resistance to change', 'Setbacks', 'Bad timing'],
    symbolism:
      'The cosmic wheel flanked by Hermanubis, the Sphinx, and Typhon, inscribed with Hebrew letters and alchemy signs.',
    element: 'Fire',
    planet: 'Jupiter',
    zodiac: 'Sagittarius',
    love: 'A turning point is near. Flow with change rather than against it.',
    career:
      'Fortunes shift. Stay adaptable and ready when the opportunity arrives.',
    growth: 'Cycles teach patience. Neither highs nor lows last forever.',
    quote: 'What falls will rise; what rises will turn.',
    themes: ['hope'],
    slug: 'wheel-of-fortune',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/10.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 11,
    number: 11,
    name: 'Justice',
    numeral: 'XI',
    arcana: 'Major Arcana',
    theme: 'justice',
    glyph: '⚖',
    keywords: ['Truth', 'Fairness', 'Accountability'],
    summary: 'Truth and consequence in balance.',
    description:
      'Justice weighs actions against their consequences with clear eyes. It calls for honesty, fairness, and accountability — to others and to yourself.',
    meaning:
      'Justice weighs actions against their consequences with clear eyes. It calls for honesty, fairness, and accountability — to others and to yourself.',
    uprightMeaning: 'Fairness, Truth, Accountability, Clarity',
    reversedMeaning: 'Dishonesty, Unfairness, Avoiding responsibility',
    upright: ['Fairness', 'Truth', 'Accountability', 'Clarity'],
    reversed: ['Dishonesty', 'Unfairness', 'Avoiding responsibility'],
    symbolism:
      'Upright double-edged sword slicing through illusions, and golden scales held in perfect balance.',
    element: 'Air',
    planet: 'Venus',
    zodiac: 'Libra',
    love: 'Honest, balanced exchange. Both people deserve to be heard.',
    career: 'Contracts, decisions, and ethics are in focus. Act with integrity.',
    growth: 'Own your choices and their effects. Clarity brings freedom.',
    quote: 'Truth is the lightest thing to carry.',
    themes: ['career'],
    slug: 'justice',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/11.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 12,
    number: 12,
    name: 'The Hanged Man',
    numeral: 'XII',
    arcana: 'Major Arcana',
    theme: 'hanged',
    glyph: '✣',
    keywords: ['Surrender', 'Perspective', 'Pause'],
    summary: 'See it from another angle.',
    description:
      'The Hanged Man hangs willingly, seeing the world turned upside down. This is a pause by choice: letting go of control and finding a perspective you could not reach by pushing.',
    meaning:
      'The Hanged Man hangs willingly, seeing the world turned upside down. This is a pause by choice: letting go of control and finding a perspective you could not reach by pushing.',
    uprightMeaning: 'Surrender, New perspective, Pause, Letting go',
    reversedMeaning: 'Stalling, Resistance, Needless sacrifice',
    upright: ['Surrender', 'New perspective', 'Pause', 'Letting go'],
    reversed: ['Stalling', 'Resistance', 'Needless sacrifice'],
    symbolism:
      'Suspended upside-down from a living wooden T-cross by one foot, radiating a golden halo of calm enlightenment.',
    element: 'Water',
    planet: 'Neptune',
    zodiac: 'Pisces',
    love: 'Wait, listen, and see the other side. Patience may reveal what rushing hides.',
    career: 'Progress is paused. Use the delay to reconsider your approach.',
    growth: 'Sometimes the answer comes when you stop trying to force it.',
    quote: 'To see differently, first let go.',
    themes: ['growth', 'shadow'],
    slug: 'the-hanged-man',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/12.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 13,
    number: 13,
    name: 'Death',
    numeral: 'XIII',
    arcana: 'Major Arcana',
    theme: 'death',
    glyph: '☠',
    keywords: ['Transformation', 'Endings', 'Rebirth'],
    summary: 'Something ends so something can begin.',
    description:
      'Death represents transformation, endings, and the beginning of something new. It is not a literal death, but a symbolic one — the end of a chapter, making space for a new chapter to begin.',
    meaning:
      'Death represents transformation, endings, and the beginning of something new. It is not a literal death, but a symbolic one — the end of a chapter, making space for a new chapter to begin.',
    uprightMeaning: 'Transformation, Release, Transition, New beginnings',
    reversedMeaning: 'Resistance to change, Stagnation, Fear of endings',
    upright: ['Transformation', 'Release', 'Transition', 'New beginnings'],
    reversed: ['Resistance to change', 'Stagnation', 'Fear of endings'],
    symbolism:
      'Black-armored skeletal rider carrying a mystic rose flag, while a new golden dawn breaks between distant twin towers.',
    element: 'Water',
    planet: 'Pluto',
    zodiac: 'Scorpio',
    love: 'A relationship may be entering a period of significant change. Let go of what no longer serves you.',
    career:
      'An old professional chapter may be coming to an end. Trust the process.',
    growth: 'Letting go can create space for something new and better.',
    quote: 'Sometimes, the end is the beginning in disguise.',
    themes: ['shadow', 'growth'],
    slug: 'death',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/13.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 14,
    number: 14,
    name: 'Temperance',
    numeral: 'XIV',
    arcana: 'Major Arcana',
    theme: 'temperance',
    glyph: '≋',
    keywords: ['Balance', 'Moderation', 'Harmony'],
    summary: 'Blend patiently, find the middle.',
    description:
      'Temperance pours between two cups, mixing opposites into something harmonious. It asks for moderation, patience, and the slow craft of finding your own balance.',
    meaning:
      'Temperance pours between two cups, mixing opposites into something harmonious. It asks for moderation, patience, and the slow craft of finding your own balance.',
    uprightMeaning: 'Balance, Patience, Moderation, Healing',
    reversedMeaning: 'Excess, Imbalance, Impatience',
    upright: ['Balance', 'Patience', 'Moderation', 'Healing'],
    reversed: ['Excess', 'Imbalance', 'Impatience'],
    symbolism:
      'An angel standing with one foot on earth and one in water, continuously pouring life force between two golden urns.',
    element: 'Fire',
    planet: 'Jupiter',
    zodiac: 'Sagittarius',
    love: 'Calm, balanced exchange. Give and receive in equal measure.',
    career: 'Collaboration and steady pacing win. Avoid extremes.',
    growth:
      'Small, steady adjustments restore balance better than drastic ones.',
    quote: 'Healing is slow, and that is enough.',
    themes: ['love', 'hope'],
    slug: 'temperance',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/14.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 15,
    number: 15,
    name: 'The Devil',
    numeral: 'XV',
    arcana: 'Major Arcana',
    theme: 'devil',
    glyph: '⛧',
    keywords: ['Attachment', 'Shadow', 'Temptation'],
    summary: 'Notice what holds you.',
    description:
      'The Devil shows chains that are loose enough to remove. It points to unhealthy attachments, habits, and fears — and reminds you that awareness is the first step toward freedom.',
    meaning:
      'The Devil shows chains that are loose enough to remove. It points to unhealthy attachments, habits, and fears — and reminds you that awareness is the first step toward freedom.',
    uprightMeaning: 'Attachment, Temptation, Shadow self, Awareness',
    reversedMeaning: 'Release, Breaking free, Reclaiming power',
    upright: ['Attachment', 'Temptation', 'Shadow self', 'Awareness'],
    reversed: ['Release', 'Breaking free', 'Reclaiming power'],
    symbolism:
      'A horned satyr figure perched above two captives chained loosely by the neck, illustrating self-imposed entrapment.',
    element: 'Earth',
    planet: 'Saturn',
    zodiac: 'Capricorn',
    love: 'Look at patterns of dependence or obsession. Real love does not bind.',
    career:
      'Beware of golden handcuffs and overwork. Ask what truly keeps you here.',
    growth:
      'Name what controls you. Naming is the first step to loosening its grip.',
    quote: 'The chains are lighter than they appear.',
    themes: ['shadow', 'love'],
    slug: 'the-devil',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/15.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 16,
    number: 16,
    name: 'The Tower',
    numeral: 'XVI',
    arcana: 'Major Arcana',
    theme: 'tower',
    glyph: '⚡',
    keywords: ['Upheaval', 'Revelation', 'Release'],
    summary: 'What falls was never stable.',
    description:
      'The Tower is the sudden collapse of what was built on shaky ground. It is shocking, but it clears space, revealing truth and making rebuilding possible.',
    meaning:
      'The Tower is the sudden collapse of what was built on shaky ground. It is shocking, but it clears space, revealing truth and making rebuilding possible.',
    uprightMeaning: 'Sudden change, Revelation, Awakening, Release',
    reversedMeaning: 'Fear of change, Avoided disaster, Slow collapse',
    upright: ['Sudden change', 'Revelation', 'Awakening', 'Release'],
    reversed: ['Fear of change', 'Avoided disaster', 'Slow collapse'],
    symbolism:
      'A lightning bolt shattering a stone fortress crown, twenty-two fiery sparks illuminating the night sky.',
    element: 'Fire',
    planet: 'Mars',
    zodiac: 'Aries',
    love: 'A truth may surface and shake things. Honesty can rebuild what is real.',
    career:
      'Disruption may force a new direction. Let go of what cannot hold.',
    growth: 'Breakdowns can be breakthroughs. Rebuild on firmer ground.',
    quote: 'After the storm, the sky is wide open.',
    themes: ['shadow'],
    slug: 'the-tower',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/16.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 17,
    number: 17,
    name: 'The Star',
    numeral: 'XVII',
    arcana: 'Major Arcana',
    theme: 'star',
    glyph: '✦',
    keywords: ['Hope', 'Renewal', 'Faith'],
    summary: 'Hope, renewal, and faith in the journey ahead.',
    description:
      'The Star arrives after the storm, a quiet light in a dark sky. It speaks of healing, renewed faith, and the gentle certainty that better days can still be reached.',
    meaning:
      'The Star arrives after the storm, a quiet light in a dark sky. It speaks of healing, renewed faith, and the gentle certainty that better days can still be reached.',
    uprightMeaning: 'Hope, Renewal, Inspiration, Serenity',
    reversedMeaning: 'Discouragement, Disconnection, Lost faith',
    upright: ['Hope', 'Renewal', 'Inspiration', 'Serenity'],
    reversed: ['Discouragement', 'Disconnection', 'Lost faith'],
    symbolism:
      'A maiden pouring water upon land and pool beneath an eight-pointed star and seven surrounding constellations.',
    element: 'Air',
    planet: 'Uranus',
    zodiac: 'Aquarius',
    love: 'Healing and openness. Trust that love can return, softly.',
    career: 'Inspiration is returning. Follow the vision that feels hopeful.',
    growth: 'Rest, refill, and believe again. You are allowed to hope.',
    quote: 'Not everything that is lost is gone forever.',
    themes: ['hope'],
    slug: 'the-star',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/17.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 18,
    number: 18,
    name: 'The Moon',
    numeral: 'XVIII',
    arcana: 'Major Arcana',
    theme: 'moon',
    glyph: '☾',
    keywords: ['Illusion', 'Dreams', 'Subconscious'],
    summary: 'Not everything is as it seems.',
    description:
      'The Moon lights a path through uncertain terrain, where shadows look like shapes and the mind fills in the gaps. It asks you to move gently through confusion and trust your intuition while seeking clarity.',
    meaning:
      'The Moon lights a path through uncertain terrain, where shadows look like shapes and the mind fills in the gaps. It asks you to move gently through confusion and trust your intuition while seeking clarity.',
    uprightMeaning: 'Intuition, Dreams, Uncertainty, Inner depths',
    reversedMeaning: 'Clarity returning, Confusion, Hidden fears',
    upright: ['Intuition', 'Dreams', 'Uncertainty', 'Inner depths'],
    reversed: ['Clarity returning', 'Confusion', 'Hidden fears'],
    symbolism:
      'A crayfish crawling from the waters of the unconscious, a domestic dog and wild wolf howling between gateway towers.',
    element: 'Water',
    planet: 'Neptune',
    zodiac: 'Pisces',
    love: 'Feelings may be unclear. Pay attention to what is felt, not just what is said.',
    career:
      'Information is incomplete. Proceed carefully and verify the details.',
    growth: 'Dreams and fears are messages. Listen with curiosity.',
    quote: 'Even in the dark, the path is there.',
    themes: ['shadow'],
    slug: 'the-moon',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/18.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 19,
    number: 19,
    name: 'The Sun',
    numeral: 'XIX',
    arcana: 'Major Arcana',
    theme: 'sun',
    glyph: '☀',
    keywords: ['Joy', 'Vitality', 'Success'],
    summary: 'Warmth, clarity, and joy.',
    description:
      'The Sun shines on everything at once: clarity, vitality, and uncomplicated joy. After uncertainty, it brings confidence, warmth, and the sense that things are going well.',
    meaning:
      'The Sun shines on everything at once: clarity, vitality, and uncomplicated joy. After uncertainty, it brings confidence, warmth, and the sense that things are going well.',
    uprightMeaning: 'Joy, Vitality, Success, Clarity',
    reversedMeaning: 'Temporary gloom, Overexposure, Delayed success',
    upright: ['Joy', 'Vitality', 'Success', 'Clarity'],
    reversed: ['Temporary gloom', 'Overexposure', 'Delayed success'],
    symbolism:
      'A joyful child wearing a crown of flowers atop a calm white steed beneath a radiant golden sun.',
    element: 'Fire',
    planet: 'Sun',
    zodiac: 'Leo',
    love: 'Open, joyful, and honest affection. Enjoy the warmth.',
    career: 'Success and recognition. Your efforts are visible.',
    growth: 'Celebrate what is working. Joy is a worthy goal.',
    quote: 'Let yourself be warmed.',
    themes: ['hope', 'love'],
    slug: 'the-sun',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/19.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 20,
    number: 20,
    name: 'Judgement',
    numeral: 'XX',
    arcana: 'Major Arcana',
    theme: 'judgement',
    glyph: '♪',
    keywords: ['Awakening', 'Reckoning', 'Renewal'],
    summary: 'Answer the call to rise.',
    description:
      'Judgement is a trumpet call to wake up, reflect on your life so far, and forgive what needs forgiving. It marks a moment of reckoning and the choice to rise into a new chapter.',
    meaning:
      'Judgement is a trumpet call to wake up, reflect on your life so far, and forgive what needs forgiving. It marks a moment of reckoning and the choice to rise into a new chapter.',
    uprightMeaning: 'Awakening, Reflection, Forgiveness, Calling',
    reversedMeaning: 'Self-doubt, Ignoring the call, Harsh self-judgment',
    upright: ['Awakening', 'Reflection', 'Forgiveness', 'Calling'],
    reversed: ['Self-doubt', 'Ignoring the call', 'Harsh self-judgment'],
    symbolism:
      'Archangel Gabriel blowing a trumpet adorned with a banner, as figures rise reborn with open arms from stone graves.',
    element: 'Fire',
    planet: 'Pluto',
    zodiac: 'Scorpio',
    love: 'Forgive, release the past, and answer honestly what your heart now asks.',
    career: 'A calling comes into focus. Review your path and rise to it.',
    growth: 'Reflect with compassion, then step forward renewed.',
    quote: 'It is never too late to answer the call.',
    themes: ['growth', 'hope'],
    slug: 'judgement',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/20.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 21,
    number: 21,
    name: 'The World',
    numeral: 'XXI',
    arcana: 'Major Arcana',
    theme: 'world',
    glyph: '◎',
    keywords: ['Completion', 'Wholeness', 'Fulfilment'],
    summary: 'A cycle completes in wholeness.',
    description:
      'The World is the completion of the long journey: integration, accomplishment, and the sense of belonging to something larger. It is both an ending and the doorway to the next cycle.',
    meaning:
      'The World is the completion of the long journey: integration, accomplishment, and the sense of belonging to something larger. It is both an ending and the doorway to the next cycle.',
    uprightMeaning: 'Completion, Wholeness, Achievement, Belonging',
    reversedMeaning: 'Loose ends, Delay, Lack of closure',
    upright: ['Completion', 'Wholeness', 'Achievement', 'Belonging'],
    reversed: ['Loose ends', 'Delay', 'Lack of closure'],
    symbolism:
      'A dancing figure encircled in an emerald laurel wreath of victory, flanked by the four sacred guardians of heaven.',
    element: 'Earth',
    planet: 'Saturn',
    zodiac: 'Capricorn',
    love: 'A relationship feels whole, or a chapter closes well. Celebrate what you have built.',
    career:
      'A project reaches its finish. Acknowledge the milestone, then look ahead.',
    growth: 'Honour how far you have come before beginning again.',
    quote: 'The circle closes, and a larger one begins.',
    themes: ['hope', 'career'],
    slug: 'the-world',
    image:
      'https://gfx.tarot.com/images/site/decks/english-magic/full_size/21.jpg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

@Injectable()
export class TarotCardsService {
  private cards: TarotCard[] = JSON.parse(JSON.stringify(INITIAL_CARDS));

  findAll(): TarotCard[] {
    return [...this.cards];
  }

  findOne(id: number): TarotCard {
    const card = this.cards.find((c) => c.id === id);
    if (!card) {
      throw new NotFoundException(`Tarot card with ID ${id} not found.`);
    }
    return card;
  }

  create(createTarotCardDto: CreateTarotCardDto): TarotCard {
    const nameLower = createTarotCardDto.name.trim().toLowerCase();

    const duplicateName = this.cards.some(
      (c) => c.name.toLowerCase() === nameLower,
    );
    if (duplicateName) {
      throw new ConflictException(
        `Tarot card with name "${createTarotCardDto.name}" already exists.`,
      );
    }

    const duplicateNumber = this.cards.some(
      (c) => c.number === createTarotCardDto.number,
    );
    if (duplicateNumber) {
      throw new ConflictException(
        `Tarot card with number ${createTarotCardDto.number} already exists.`,
      );
    }

    const nextId =
      this.cards.length > 0 ? Math.max(...this.cards.map((c) => c.id)) + 1 : 0;
    const now = new Date().toISOString();

    const uprightList =
      createTarotCardDto.upright ||
      createTarotCardDto.uprightMeaning
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const reversedList =
      createTarotCardDto.reversed ||
      createTarotCardDto.reversedMeaning
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const newCard: TarotCard = {
      ...createTarotCardDto,
      id: nextId,
      name: createTarotCardDto.name.trim(),
      number: createTarotCardDto.number,
      arcana: createTarotCardDto.arcana || 'Major Arcana',
      uprightMeaning: createTarotCardDto.uprightMeaning,
      reversedMeaning: createTarotCardDto.reversedMeaning,
      description: createTarotCardDto.description,
      symbolism: createTarotCardDto.symbolism || '',
      element: createTarotCardDto.element || 'Aether',
      planet: createTarotCardDto.planet || 'Cosmos',
      zodiac: createTarotCardDto.zodiac || 'All',
      image: createTarotCardDto.image,
      keywords: createTarotCardDto.keywords || [],
      isFavorite: createTarotCardDto.isFavorite ?? false,
      createdAt: now,
      updatedAt: now,

      // Frontend compatibility fields
      numeral: createTarotCardDto.numeral || String(createTarotCardDto.number),
      theme: createTarotCardDto.theme || slugify(createTarotCardDto.name),
      glyph: createTarotCardDto.glyph || '✦',
      summary: createTarotCardDto.summary || createTarotCardDto.description,
      meaning: createTarotCardDto.meaning || createTarotCardDto.description,
      upright: uprightList,
      reversed: reversedList,
      love: createTarotCardDto.love || createTarotCardDto.uprightMeaning,
      career: createTarotCardDto.career || createTarotCardDto.uprightMeaning,
      growth: createTarotCardDto.growth || createTarotCardDto.description,
      quote:
        createTarotCardDto.quote ||
        `Wisdom of ${createTarotCardDto.name.trim()}.`,
      themes:
        createTarotCardDto.themes && createTarotCardDto.themes.length > 0
          ? createTarotCardDto.themes
          : ['growth'],
      slug: createTarotCardDto.slug || slugify(createTarotCardDto.name),
    };

    this.cards.push(newCard);
    return newCard;
  }

  update(id: number, updateTarotCardDto: UpdateTarotCardDto): TarotCard {
    const index = this.cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarot card with ID ${id} not found.`);
    }

    if (updateTarotCardDto.name) {
      const nameLower = updateTarotCardDto.name.trim().toLowerCase();
      const duplicate = this.cards.some(
        (c) => c.id !== id && c.name.toLowerCase() === nameLower,
      );
      if (duplicate) {
        throw new ConflictException(
          `Another tarot card with name "${updateTarotCardDto.name}" already exists.`,
        );
      }
    }

    if (updateTarotCardDto.number !== undefined) {
      const duplicate = this.cards.some(
        (c) => c.id !== id && c.number === updateTarotCardDto.number,
      );
      if (duplicate) {
        throw new ConflictException(
          `Another tarot card with number ${updateTarotCardDto.number} already exists.`,
        );
      }
    }

    const currentCard = this.cards[index];
    const updatedCard: TarotCard = {
      ...currentCard,
      ...updateTarotCardDto,
      updatedAt: new Date().toISOString(),
    };

    if (updateTarotCardDto.name && !updateTarotCardDto.slug) {
      updatedCard.slug = slugify(updateTarotCardDto.name);
    }
    if (updateTarotCardDto.uprightMeaning && !updateTarotCardDto.upright) {
      updatedCard.upright = updateTarotCardDto.uprightMeaning
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (updateTarotCardDto.reversedMeaning && !updateTarotCardDto.reversed) {
      updatedCard.reversed = updateTarotCardDto.reversedMeaning
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    this.cards[index] = updatedCard;
    return updatedCard;
  }

  remove(id: number): { message: string; card: TarotCard } {
    const index = this.cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarot card with ID ${id} not found.`);
    }

    const [removed] = this.cards.splice(index, 1);
    return {
      message: `Tarot card with ID ${id} removed successfully.`,
      card: removed,
    };
  }
}

