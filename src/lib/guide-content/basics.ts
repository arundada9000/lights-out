import type { GuideMeta } from "../guides";

export const whatIsLightsOut: GuideMeta = {
  slug: "what-is-lights-out",
  title: "What Is Lights Out? The Classic Puzzle Explained",
  description:
    "Discover the history, rules, and enduring appeal of the classic Lights Out puzzle game, and how Easy Lights Out reimagines it for the modern web.",
  category: "Basics",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "what is lights out",
    "lights out puzzle history",
    "classic logic game",
    "tiger electronics lights out",
    "lights out game meaning",
  ],
  content: [
    {
      type: "p",
      text: "Lights Out is a classic single-player puzzle game built on one elegant idea: every cell on a board is either on or off, tapping a cell flips that cell and its neighbors, and your job is to turn every light off.",
    },
    { type: "h2", text: "A short history" },
    {
      type: "p",
      text: "The original Lights Out game was released by Tiger Electronics in 1995 as a handheld electronic puzzle. A 5 x 5 grid of lit buttons turned off and on as you pressed them, following a simple rule: press any button and both it and the four adjacent buttons, above, below, left, and right, change their state.",
    },
    {
      type: "p",
      text: "The game became famous precisely because the rule is so simple yet the puzzles are so deep. A board with a handful of lights can take dozens of careful moves to solve, and the mathematics behind the game, a branch of linear algebra over binary arithmetic, makes it a favorite study for computer scientists and puzzle enthusiasts.",
    },
    { type: "h2", text: "The core rule" },
    {
      type: "p",
      text: "At any moment you know exactly what a tap does:",
    },
    {
      type: "ul",
      items: [
        "A cell that is off turns on.",
        "A cell that is on turns off.",
        "The four orthogonal neighbors of the tapped cell also flip at the same time.",
        "Every tap counts as exactly one move.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "The goal",
      text: "Turn every cell off. When the entire board is dark, you have solved the puzzle.",
    },
    { type: "h2", text: "Why it is so satisfying" },
    {
      type: "p",
      text: "Lights Out is a puzzle of consequence. One careless tap can undo ten moves of progress, and the same board position can reappear from completely different decisions. This creates a constant loop of planning, correction, and the deeply rewarding click of a board finally going dark.",
    },
    {
      type: "p",
      text: "Because the rule never changes, a good player eventually learns to think in patterns: rows resolve downward, corners lock in answers, and symmetry becomes the brightest tool on the board.",
    },
    { type: "h2", text: "How Easy Lights Out expands it" },
    {
      type: "p",
      text: "Easy Lights Out honors the original while exploring what the rule can become. Boards grow from 3 x 3 to 8 x 8. Modes change the target from an empty board to a specific pattern. Timed and Minimum Moves modes add pressure and precision. Zen mode removes both.",
    },
    {
      type: "p",
      text: "Underneath it all runs a real puzzle engine with a mathematical solver, so every generated board is guaranteed solvable and every difficulty rating is based on measurable puzzle properties, not guesswork.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Try it yourself",
      text: "The best way to understand Lights Out is to tap a few cells. Play the interactive demo on the home page, then explore the How to Play guide.",
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "Is Lights Out the same as the Tigers Electronics handheld game? The rule is identical, yes. Easy Lights Out is a modern, free digital adaptation with more modes and board sizes.",
        "Can every Lights Out board be solved? No, arbitrary boards can be unsolvable. Every board Easy Lights Out generates is mathematically guaranteed solvable.",
        "Is Lights Out about lights or logic? Both. The theme is lights, but the challenge is pure logic and careful planning.",
      ],
    },
  ],
};

export const howToPlay: GuideMeta = {
  slug: "how-to-play",
  title: "How to Play Lights Out: Rules, Objective, and Winning",
  description:
    "Learn the complete rules of the Lights Out puzzle in minutes. Understand what each tap does, how moves are counted, and how to win your first board.",
  category: "Basics",
  updated: "2026-09-14",
  readingTime: "5 min",
  keywords: [
    "how to play lights out",
    "lights out rules",
    "lights out objective",
    "tap lights out game",
    "lights out tutorial",
  ],
  faq: [
    {
      question: "How do you win at Lights Out?",
      answer:
        "Turn every cell off. Tapping a cell flips it and its orthogonal neighbors, and you win the moment the entire board is dark.",
    },
    {
      question: "What does a tap do in Lights Out?",
      answer:
        "A tap flips the tapped cell and the four cells directly adjacent to it, above, below, left, and right. Every tap counts as one move.",
    },
    {
      question: "Are all Lights Out boards solvable?",
      answer:
        "Not all possible board states are solvable. Easy Lights Out generates every puzzle with a solver so the board is always solvable, and ensures puzzles are never trivially pre-solved.",
    },
  ],
  content: [
    { type: "p", text: "The full rules of Lights Out fit in a single sentence, and mastering them fits in a single evening." },
    { type: "h2", text: "The objective" },
    {
      type: "p",
      text: "Your goal is to make every cell on the board dark, which means off. The game starts with a mixture of lit and dark cells, and you win the instant the last light goes out.",
    },
    { type: "h2", text: "The move" },
    {
      type: "p",
      text: "A move is a single tap on any cell. Tapping a cell does three things at once:",
    },
    {
      type: "ul",
      items: [
        "The tapped cell flips. On becomes off, off becomes on.",
        "The cell above the tapped cell flips, if it exists.",
        "The cells below, left, and right of the tapped cell flip too, if they exist.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Neighborhood rule",
      text: "This set of five cells, the tapped cell plus its four orthogonal neighbors, is called the classic cross. In future modes the neighborhood can change, but Classic always uses the cross.",
    },
    { type: "h2", text: "Moves and counting" },
    {
      type: "p",
      text: "Every tap is worth exactly one move, whether it changes the board little or a lot. The move counter in the top bar shows how many you have used. Solving faster and with fewer moves is the natural way to improve.",
    },
    { type: "h2", text: "Winning and losing" },
    {
      type: "ul",
      items: [
        "All off: you win. The board is complete and your result is recorded.",
        "Classic and Zen have no loss condition. Keep playing as long as you like.",
        "Timed and Minimum Moves modes add real constraints: a clock or a move budget.",
      ],
    },
    { type: "h2", text: "Restart and undo" },
    {
      type: "ul",
      items: [
        "Restart resets the exact same board to its starting position, so you can retry without losing the puzzle.",
        "New Puzzle generates a fresh board.",
        "Undo is available in non-competitive modes like Practice and Zen. In competitive modes undo either is disabled or marks your run as non-competitive.",
      ],
    },
    { type: "h2", text: "Keyboard and touch" },
    {
      type: "p",
      text: "On touch devices, tap cells directly with your finger. On desktop, click any cell, or use the arrow keys to navigate and Enter or Space to activate. R restarts, Z undoes where allowed, and Escape pauses.",
    },
    { type: "h2", text: "Your first strategy" },
    {
      type: "p",
      text: "For your first board, work from the top row downward. Decide how the top row must look, then clear each row below it in order. This row-by-row method is the foundation of every serious Lights Out strategy, and starting with a 3 x 3 board makes it easy to see why.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Start small",
      text: "New players gain the most from 3 x 3 and 4 x 4 boards, where every mistake is visible and every pattern is learnable. Move to 5 x 5 once the small boards feel automatic.",
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "How do you win at Lights Out? Turn every light off. The board counts as solved the instant every cell is dark.",
        "Can you undo a mistake? Yes, in practice and Zen modes. Competitive modes either disable undo or mark the run non-competitive.",
        "Does restarting use the same board? Yes. Restart resets the same puzzle to its opening position. Use New Puzzle to get a different one.",
      ],
    },
  ],
};