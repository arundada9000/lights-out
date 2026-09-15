import type { GuideMeta } from "../guides";

export const classicMode: GuideMeta = {
  slug: "classic-mode",
  title: "Classic Mode: The Pure Lights Out Experience",
  description:
    "The authentic Lights Out puzzle, 3 x 3 up to 8 x 8. Learn what makes Classic mode the cleanest expression of the game and how board size changes the challenge.",
  category: "Modes",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "classic lights out mode",
    "lights out board sizes",
    "5x5 lights out",
    "8x8 lights out",
    "lights out presets",
  ],
  faq: [
    {
      question: "What board sizes are available in Classic mode?",
      answer:
        "Classic mode offers 3 x 3, 4 x 4, 5 x 5, 6 x 6, 7 x 7, and 8 x 8 boards. The 5 x 5 board is the canonical, full-size Classic experience.",
    },
    {
      question: "Is the 5x5 board the standard Lights Out board?",
      answer:
        "Yes. The original Tiger Electronics handheld used a 5 x 5 grid, and Easy Lights Out treats 5 x 5 as the definitive Classic size.",
    },
  ],
  content: [
    { type: "p", text: "Classic mode is the original Lights Out game, distilled to its purest form: a grid of on and off cells, a single neighborhood rule, and one clear objective." },
    { type: "h2", text: "The rules" },
    {
      type: "ul",
      items: [
        "Binary cells: each cell is either on or off.",
        "Tap a cell to toggle it and its orthogonal neighbors.",
        "The goal is all cells off.",
        "Every tap counts as one move.",
        "Completion happens the instant every cell is off.",
      ],
    },
    { type: "h2", text: "Board sizes and how difficulty grows" },
    {
      type: "p",
      text: "Classic offers six sizes:",
    },
    {
      type: "table",
      header: ["Size", "Cells", "Character"],
      rows: [
        ["3 x 3", "9", "Warm-up. Learn the rules quickly."],
        ["4 x 4", "16", "The first real challenge."],
        ["5 x 5", "25", "The canonical Classic board."],
        ["6 x 6", "36", "Planning across the whole board."],
        ["7 x 7", "49", "Deep, layered logic."],
        ["8 x 8", "64", "Maximum difficulty and scale."],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Difficulty is more than size",
      text: "Larger boards are not automatically harder. Easy Lights Out rates difficulty using the minimum solution length and the structure of the solution, so a small board can occasionally surprise you.",
    },
    { type: "h2", text: "Strategy: solving top row down" },
    {
      type: "p",
      text: "The classic strategy is row-first elimination. Decide how the top row must be tapped to go dark, tap those cells, then clear each lower row by tapping cells in the row above it. By the time you reach the bottom, a small set of remaining lights either resolves itself or reveals a pattern to chase.",
    },
    { type: "h2", text: "Restart versus new puzzle" },
    {
      type: "p",
      text: "Restart always resets the same board, letting you retry a puzzle you nearly solved. New Puzzle generates a different board, ideal when you want a fresh challenge.",
    },
    { type: "h2", text: "How records work" },
    {
      type: "p",
      text: "Each size and difficulty keeps its own personal records for fewest moves, fastest time, and best optimality ratio. A record is only counted as competitive if you finished without hints or undo.",
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "What is the best board size to learn with? Start at 3 x 3. Every pattern is visible, and you build intuition fast.",
        "Can I make a custom size? Classic supports the six standard presets now, with more flexibility planned for custom boards.",
        "Do moves carry over between attempts? No. Restart resets the move counter along with the board.",
      ],
    },
  ],
};

export const patternMode: GuideMeta = {
  slug: "pattern-mode",
  title: "Pattern Mode: Build a Pattern, Not Just an Empty Board",
  description:
    "Pattern mode changes the objective from all-off to a target arrangement of lights. Learn how pattern goals work, how they are generated, and how to approach them.",
  category: "Modes",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "lights out pattern mode",
    "lights out target pattern",
    "match pattern puzzle",
    "checkerboard lights out",
    "lights out objectives",
  ],
  faq: [
    {
      question: "What is Pattern mode in Lights Out?",
      answer:
        "Instead of turning every light off, Pattern mode asks you to reach a specific target arrangement of lit and dark cells. The goal can be a shape, a checkerboard, a border, or another generated pattern.",
    },
    {
      question: "Are Pattern mode puzzles solvable?",
      answer:
        "Yes. Every pattern is validated for solvability, and the start state is often created by applying legal moves to the target, so a solution is guaranteed to exist.",
    },
  ],
  content: [
    { type: "p", text: "Classic Lights Out always ends in darkness. Pattern mode asks a more demanding question: can you land on exactly this arrangement of lights?" },
    { type: "h2", text: "How it differs from Classic" },
    {
      type: "ul",
      items: [
        "The target is a specific pattern, not an empty board.",
        "Cells that are correctly lit must stay lit, and dark cells must stay dark.",
        "Every tap still flips the cross neighborhood on your current board.",
        "Solvability is still guaranteed for every generated pattern.",
      ],
    },
    { type: "h2", text: "Kinds of targets" },
    {
      type: "ul",
      items: [
        "Checkerboard: alternating on and off cells.",
        "Border only: a lit outline around a dark center.",
        "Center only: one lit region in the middle.",
        "Geometric and pixel-art: generated shapes, icons, and silhouettes.",
        "Symmetrical patterns and custom targets.",
      ],
    },
    { type: "h2", text: "Think in deltas" },
    {
      type: "p",
      text: "A useful mental model: ignore what is correct right now and focus on what differs from the target. Because flipping the same cell twice cancels out, you can imagine your sequence of taps as puzzle pieces that assemble into the required change, exactly like solving an equation.",
    },
    { type: "h2", text: "How patterns are generated" },
    {
      type: "p",
      text: "Patterns come from several generators: symmetrical layouts, random states, geometric rules, or pixel-art templates. The initial scrambled board is typically produced by applying random legal moves to the target, which mathematically guarantees that a solution exists.",
    },
    { type: "h2", text: "Tip: use the preview" },
    {
      type: "callout",
      tone: "tip",
      title: "Study the target before tapping",
      text: "Pattern mode rewards planning. Read the target, identify its structure, and only then start solving. Symmetrical targets often trace almost symmetrical solution paths.",
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "Do lights that are already correct matter? Yes. Reaching the target means every cell matches, correct cells included.",
        "Can the target be reached by accident? Yes, and that counts. The result is calculated from the final state, not from intent.",
        "Can I create my own pattern? Custom patterns are planned for the puzzle editor. Generated patterns are available in Pattern mode today.",
      ],
    },
  ],
};

export const dailyPuzzle: GuideMeta = {
  slug: "daily-puzzle",
  title: "Daily Puzzle: One Unique Board Every Day, Everywhere",
  description:
    "The Daily Puzzle gives everyone the same solvable board each day, indefinitely, without internet or accounts. Learn how it works, how streaks build, and where results are stored.",
  category: "Modes",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "lights out daily puzzle",
    "daily puzzle game",
    "lights out streaks",
    "same puzzle everyone",
    "lights out daily challenge",
  ],
  faq: [
    {
      question: "How is the Daily Puzzle generated?",
      answer:
        "It is created deterministically from the date combined with the mode, difficulty, and generator version. Everyone with the same setup receives the identical puzzle that day.",
    },
    {
      question: "Does the Daily Puzzle need internet?",
      answer:
        "No. The Daily Puzzle is fully offline. It is derived from the calendar date and your local device, so it always works without a connection.",
    },
    {
      question: "Can you retry the Daily Puzzle?",
      answer:
        "Yes. You can restart the same day's board as many times as you like. Only your best personal result for that date is remembered.",
    },
  ],
  content: [
    { type: "p", text: "The Easy Lights Out Daily Puzzle is one deterministic board per day: identical for every player, fully offline, and tracked with a personal history and streak." },
    { type: "h2", text: "Everyone gets the same board" },
    {
      type: "p",
      text: "The board is not chosen from a server. It is computed locally from the date, the mode, the difficulty, and the current generator version. Because the same inputs always produce the same board, a puzzle shared by friends, forums, or social media is the exact puzzle everyone else solved that day.",
    },
    { type: "h2", text: "Deterministic, versioned, fair" },
    {
      type: "p",
      text: "The generator input includes a version identifier. If the puzzle engine improves in the future, historical daily boards remain exactly what they were, because that version number keeps today identical to the day it was played.",
    },
    { type: "h2", text: "One puzzle, no changes" },
    {
      type: "ul",
      items: [
        "The puzzle cannot be changed after you start.",
        "Restart is always allowed and resets the same board.",
        "Using hints or undo marks your run non-competitive, so it will not overwrite a clean daily record.",
        "Your personal result is stored locally on your device.",
      ],
    },
    { type: "h2", text: "History and streaks" },
    {
      type: "p",
      text: "The Daily History panel shows which dates you completed, your best time, your moves, and the optimal move count for each day. Completing consecutive days grows your Daily streak, a purely informational counter that never pressures or nags you.",
    },
    { type: "h2", text: "Offline by design" },
    {
      type: "callout",
      tone: "info",
      title: "Works anywhere",
      text: "Because the puzzle derives from your local calendar, it works in airplane mode, on a plane, or in the middle of nowhere. The entire Daily system is offline-first.",
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "What happens if I miss a day? Nothing. Streaks pause and restart from your next completion. There are no punishments.",
        "Is my Daily result synced to the cloud? No. Values stay on your device by design. Everything about the game is local and private.",
        "Why does the board look different from a friend's? The board depends on the same date and version settings, so if you both play the current Daily with default settings, it will match.",
      ],
    },
  ],
};

export const minimumMoves: GuideMeta = {
  slug: "minimum-moves",
  title: "Minimum Moves Mode: Solve with Optimal Efficiency",
  description:
    "Minimum Moves Mode measures you against the shortest possible solution. Learn what optimality means, how it is computed, and how efficiency ratings work.",
  category: "Modes",
  updated: "2026-09-14",
  readingTime: "5 min",
  keywords: [
    "lights out minimum moves",
    "optimal lights out solution",
    "fewest moves puzzle",
    "lights out efficiency",
    "perfect solve lights out",
  ],
  faq: [
    {
      question: "What is Minimum Moves Mode?",
      answer:
        "It is an unlimited-time mode that evaluates how close your solution is to the mathematically shortest one. The engine computes the optimal move count for the board and rates your result against it.",
    },
    {
      question: "How is the optimal move count calculated?",
      answer:
        "The solver represents the board as a system of equations over binary arithmetic and uses Gaussian elimination to find the solution space, then selects the combination of moves with the smallest total count.",
    },
    {
      question: "What are the efficiency ratings?",
      answer:
        "Results are classified as Perfect, Excellent, Good, or Solved based on how close your move count is to the optimum. A Perfect solve uses exactly the minimum number of moves.",
    },
  ],
  content: [
    { type: "p", text: "Anyone can solve a Lights Out board eventually. Minimum Moves Mode asks the sharper question: can you solve it with the fewest taps possible?" },
    { type: "h2", text: "The challenge" },
    {
      type: "p",
      text: "There is no timer in Minimum Moves Mode. The board is the same as Classic, but the score is your efficiency: your move count compared against the optimal, which is the fewest moves the board can possibly be solved in.",
    },
    { type: "h2", text: "How the optimal is found" },
    {
      type: "p",
      text: "Because flipping the same cell twice is the same as not flipping it at all, a solution can be described as a set of cells pressed once. The solver builds a binary equation for every cell, solves the system, and searches the solution space for the set with the smallest size.",
    },
    { type: "h2", text: "Efficiency ratings" },
    {
      type: "table",
      header: ["Rating", "Meaning"],
      rows: [
        ["Perfect", "You matched the optimal move count exactly."],
        ["Excellent", "Within a couple of moves of optimal."],
        ["Good", "A solid solve above the optimum."],
        ["Solved", "You solved it; room to tighten."],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Why repeated cells cancel",
      text: "Tapping a cell twice restores its state completely. So any sequence can be reduced modulo two, and an optimal solution never presses the same cell more than once. Plan for presses, not sequences.",
    },
    { type: "h2", text: "Reading the result screen" },
    {
      type: "p",
      text: "The result shows your moves beside the optimum, for example Optimal: 13, You: 13 for a Perfect solve, or Optimal: 13, You: 18 for a Good solve. A personal best is saved when your efficiency beats your previous record.",
    },
    { type: "h2", text: "Practice advice" },
    {
      type: "p",
      text: "Optimization is a learned skill. Solve the same small board several times, notice where you over-tap, and study the hint engine's suggestion when a solve took far more than optimal.",
    },
  ],
};

export const timedMode: GuideMeta = {
  slug: "timed-mode",
  title: "Timed Mode: Beat the Clock, One Board at a Time",
  description:
    "A timer changes every decision in Lights Out. Learn the presets, how the clock behaves, when you fail, and how competitive scoring works in Timed mode.",
  category: "Modes",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "timed lights out",
    "speed puzzle game",
    "beat the clock puzzle",
    "lights out timer",
    "competitive lights out",
  ],
  faq: [
    {
      question: "How does the timer work in Timed mode?",
      answer:
        "You choose a duration such as 30, 60, or 120 seconds, and the clock starts on your first move. Completing the board before it reaches zero is a win.",
    },
    {
      question: "What happens when time runs out?",
      answer:
        "The game ends immediately and no further moves are accepted. Your result is recorded as a timed-out run with your board progress at that moment.",
    },
    {
      question: "Does pausing pause the timer?",
      answer:
        "Pausing stops the clock and the game. Competitive runs that pause or use assistance are marked non-competitive so a legitimate record is never silently overwritten.",
    },
  ],
  content: [
    { type: "p", text: "Lights Out is a game of thought. Timed mode adds the one pressure that changes everything: a visible, running clock." },
    { type: "h2", text: "Choosing a time" },
    {
      type: "p",
      text: "Pick a preset, 30, 60, or 120 seconds, or set a custom duration. The clock starts on your first move, not when the screen loads, so you always get your thinking time.",
    },
    { type: "h2", text: "The clock is the score" },
    {
      type: "p",
      text: "Your primary result is completion time; secondary metrics are move count and optimality. The completion banner shows how quickly you solved the board, and beating your personal best records a new fastest time.",
    },
    { type: "h2", text: "Failing the clock" },
    {
      type: "p",
      text: "If the timer reaches zero, the game is over. Input stops immediately, the clock stops, and a Time Up result shows your progress, moves, and best prior performance with a Try Again action.",
    },
    { type: "h2", text: "Fairness rules" },
    {
      type: "ul",
      items: [
        "Moves arriving after timeout are ignored.",
        "Backgrounding the app pauses a timed run.",
        "Using hints or undo marks the run non-competitive.",
        "Records require a clean competitive run.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "No unfair pauses",
      text: "Timed competition is kept honest: leaving the tab, pausing, or using assistance cannot create an advantage that silently overwrites legitimate records.",
    },
    { type: "h2", text: "Strategy under pressure" },
    {
      type: "p",
      text: "In Timed mode, speed is not random tapping. Plan the top row quickly, execute the row-by-row method cleanly, and resist the urge to over-verify each tap. Calm, structured play is consistently faster than nervous tapping.",
    },
  ],
};

export const zenMode: GuideMeta = {
  slug: "zen-mode",
  title: "Zen Mode: Play Lights Out Free From Pressure",
  description:
    "Zen mode strips away timers, move limits, and competitive scoring. A calm, friction-free way to enjoy Lights Out with undo and optional hints on every board.",
  category: "Modes",
  updated: "2026-09-14",
  readingTime: "3 min",
  keywords: [
    "zen mode puzzle",
    "relaxing puzzle game",
    "lights out zen",
    "no pressure puzzle",
    "casual lights out",
  ],
  faq: [
    {
      question: "What is Zen mode in Lights Out?",
      answer:
        "Zen mode is the relaxed way to play: no timer, no move limit, undo enabled, optional hints, and a calm result screen. It exists purely for enjoyment.",
    },
    {
      question: "Is there any way to fail in Zen mode?",
      answer:
        "No. There is no failure state in Zen mode. You can restart, undo, and take as long as you like on every puzzle.",
    },
  ],
  content: [
    { type: "p", text: "Not every session with Lights Out needs to be a race to a record. Zen mode is the game exactly as it should feel at the end of a long day." },
    { type: "h2", text: "What Zen mode removes" },
    {
      type: "ul",
      items: [
        "No timer, ever.",
        "No move limit and no failure state.",
        "No pressure to optimize your move count.",
        "No competitive scoring or record overwrites.",
      ],
    },
    { type: "h2", text: "What Zen mode adds" },
    {
      type: "ul",
      items: [
        "Undo is always enabled.",
        "Step-by-step hints are available on request.",
        "Completion is calm and quiet, a soft confirmation rather than a celebration.",
      ],
    },
    { type: "h2", text: "When to use Zen" },
    {
      type: "p",
      text: "Zen is perfect for learning the rules, for unwinding, for solving with company, or for playing while traveling. It is the same board, the same logic, and none of the stakes.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Learn faster in Zen",
      text: "Because the consequences are gentle, Zen mode is the best place to experiment. Try unorthodox sequences and watch how the neighborhood rule responds. You will internalize the logic faster than under a clock.",
    },
    { type: "h2", text: "Statistics still count" },
    {
      type: "p",
      text: "Zen solutions are saved to your statistics, but they never compete with or overwrite competitive records. Your fun is tracked separately from your competitive performance.",
    },
  ],
};