import type { GuideMeta } from "../guides";

export const tipsAndStrategies: GuideMeta = {
  slug: "tips-and-strategies",
  title: "Lights Out Tips & Strategies: From Beginner to Pro",
  description:
    "Proven strategies to win at Lights Out: the row-by-row method, working from the corners, symmetry, optimal play, and advanced techniques for bigger boards.",
  category: "Strategy",
  updated: "2026-09-14",
  readingTime: "7 min",
  keywords: [
    "lights out strategy",
    "how to solve lights out",
    "lights out row method",
    "lights out tips",
    "win lights out every time",
  ],
  faq: [
    {
      question: "What is the row-by-row method for Lights Out?",
      answer:
        "Decide exactly which cells of the top row need tapping to turn it dark, tap them, then clear each following row by tapping cells in the row above. The remaining bottom-row pattern tells you the finishing moves.",
    },
    {
      question: "Why does pressing the same cell twice cancel out?",
      answer:
        "Every cell flips twice, returning it to its original state. So any sequence of presses can be reduced to a set of cells pressed at most once, which is why optimal solutions never repeat a cell.",
    },
    {
      question: "Are there Lights Out boards that cannot be solved?",
      answer:
        "Yes. Some board states are mathematically unsolvable. Easy Lights Out only produces boards that are verified solvable, so every puzzle you receive has a solution.",
    },
  ],
  content: [
    { type: "p", text: "There are two levels of Lights Out skill: solving boards, and solving them well. These strategies move you through both." },
    { type: "h2", text: "Strategy 1: the row-by-row method" },
    {
      type: "p",
      text: "The most reliable way to solve any board is to collapse it row by row:",
    },
    {
      type: "ol",
      items: [
        "Study the top row and decide which cells to tap so that the whole row goes dark. Each tap affects the row below too, so plan carefully.",
        "Tap those cells. The top row is now off.",
        "Move to the second row. To clear it, tap cells in the third row directly below the lit cells of the second row.",
        "Repeat downward: each row is cleared by tapping the row beneath it.",
        "When you reach the bottom, the remaining lights follow a small, predictable set of patterns. Matching that pattern with the correct bottom-row taps finishes the board.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Why it works",
      text: "Tapping a cell in row N+1 flips exactly one cell in row N directly above it, which lets you turn off every light on row N individually. This deterministic cleanup is the backbone of serious Lights Out play.",
    },
    { type: "h2", text: "Strategy 2: think in corners and edges" },
    {
      type: "p",
      text: "Corners are special: they have only two neighbors, so they are easier to control with predictable taps. Work structured regions inward from the edges rather than tapping freely in the middle, which creates chaos you will have to unwind.",
    },
    { type: "h2", text: "Strategy 3: use symmetry" },
    {
      type: "p",
      text: "Many boards are close to symmetric, and symmetric boards often have symmetric solutions. When a pattern looks mirrored, try mirroring your next move. Asymmetry in the board is usually the clearest clue about what changed.",
    },
    { type: "h2", text: "Strategy 4: avoid redundant taps" },
    {
      type: "p",
      text: "Press a cell twice and nothing changes. Every wasted double-tap is a wasted move. When you form a habit of pressing carefully once, your move counts drop dramatically across every mode.",
    },
    { type: "h2", text: "Understanding solution branching" },
    {
      type: "p",
      text: "Not every board has a unique solution. Some have several, and the solver can enumerate them. When multiple solutions exist, you can choose the cleanest path rather than the only path, and in Minimum Moves mode the engine finds the shortest one for you.",
    },
    { type: "h2", text: "Rapid improvement checklist" },
    {
      type: "ul",
      items: [
        "Master the row-by-row method on a 3 x 3 board until it feels automatic.",
        "Move to 4 x 4 and watch how the bottom-row patterns repeat.",
        "Use Zen mode or undo to experiment freely in the mid-game.",
        "Before tapping, ask: what is the single move that turns off the most lit cells?",
        "In Timed mode, keep the top-row plan short and execute without re-checking.",
      ],
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "Can every Classic board be solved with the row method? Every board Easy Lights Out generates is solvable, and the row method will reach the solution, though the finishing step requires recognizing the bottom pattern.",
        "What if I get stuck mid-board? Undo a few moves and look for a cell that, if flipped, would resolve several lit cells at once. Stuck positions usually come from a single wrong tap in an earlier row.",
        "Is there a single universal solution? There is no fixed sequence for all boards, but the row-by-row framework is universal: it works on every rectangular board size.",
      ],
    },
  ],
};

export const lightsOutAlgorithm: GuideMeta = {
  slug: "lights-out-algorithm",
  title: "The Lights Out Algorithm: The Math Behind the Board",
  description:
    "How Lights Out is solved mathematically. Explore the binary model, GF(2) linear algebra, Gaussian elimination, solution enumeration, and the minimum-move search.",
  category: "Engine",
  updated: "2026-09-14",
  readingTime: "9 min",
  keywords: [
    "lights out algorithm",
    "lights out math",
    "lights out linear algebra",
    "gf2 lights out",
    "lights out solver gaussian elimination",
    "lights out matrix equation",
  ],
  faq: [
    {
      question: "How do you mathematically solve Lights Out?",
      answer:
        "Model each cell as a binary variable and each move as a binary vector. The puzzle becomes the equation A x = b over the field GF(2), where A encodes every move, x is which moves you press, and b is the change from the initial state to the target. Gaussian elimination over GF(2) then finds x.",
    },
    {
      question: "Why is Lights Out linear algebra over GF(2)?",
      answer:
        "Because pressing a cell twice is exactly the same as not pressing it at all, taps obey binary arithmetic. That makes the system linear in a way ordinary numbers cannot express, and Gaussian elimination becomes the natural tool.",
    },
    {
      question: "How is the minimum solution found?",
      answer:
        "After solving the linear system, the solver enumerates the combinations of free variables and picks the solution with the smallest Hamming weight, meaning the fewest pressed cells. For larger boards it does this efficiently rather than brute-forcing every possibility.",
    },
  ],
  content: [
    { type: "p", text: "Behind every generated board is a small piece of beautiful mathematics. Understanding it explains solvability, hints, difficulty, and why pressing a cell twice is always pointless." },
    { type: "h2", text: "Binary representation" },
    {
      type: "p",
      text: "Encode the board as a list of bits, one per cell: 1 for on, 0 for off. A 5 x 5 board is therefore 25 bits. Each legal move is also a 25-bit vector describing exactly which cells it flips: the tapped cell plus its four neighbors.",
    },
    { type: "h2", text: "The equation A x = b" },
    {
      type: "p",
      text: "Suppose you press a set of moves represented by the vector x. Each pressed move flips its five cells. The combined effect is the sum of those move vectors, computed with binary addition, where 1 + 1 = 0 because flipping a cell twice changes nothing.",
    },
    {
      type: "p",
      text: "Define A as the matrix whose columns are the move vectors, and b as the difference between your initial state and your target. Then solving the game is exactly solving:",
    },
    { type: "code", language: "text", code: "A x = b   (over the field GF(2))" },
    {
      type: "p",
      text: "Every solution vector x is a valid set of presses, and every valid set of presses is a solution vector. The puzzle and the equation are the same object.",
    },
    { type: "h2", text: "Gaussian elimination over GF(2)" },
    {
      type: "p",
      text: "The solver converts A x = b into row-echelon form using XOR in place of subtraction. This reveals three outcomes:",
    },
    {
      type: "ul",
      items: [
        "A unique solution: exactly one set of presses works.",
        "No solution: the equation is inconsistent, meaning the board state is unsolvable.",
        "A family of solutions: free variables remain, each choice of them yields a valid answer.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Why solvability matters",
      text: "Random boards are unsolvable more often than intuition suggests. The generator runs this solve during creation and rejects any board whose system is inconsistent, so you never meet an impossible puzzle.",
    },
    { type: "h2", text: "Finding the minimum solution" },
    {
      type: "p",
      text: "When several solutions exist, Minimum Moves mode needs the shortest. The solver enumerates the free-variable combinations and evaluates each candidate by its Hamming weight, the number of cells actually pressed. The candidate with the smallest weight is the optimum.",
    },
    {
      type: "p",
      text: "The search is structured, using the fact that free variables sit in predictable columns, so even on 8 x 8 boards the evaluation finishes instantly rather than exploring all 2^25 possibilities.",
    },
    { type: "h2", text: "Solution validation" },
    {
      type: "p",
      text: "The solver never trusts its own answer blindly. For every output it replays the moves against the initial state, recomputes the final board, and confirms it matches the target exactly. A round trip test too cheap to skip.",
    },
    { type: "h2", text: "From math to features" },
    {
      type: "ul",
      items: [
        "Hints: the solver picks the next pressed cell that stays consistent with a shortest solution.",
        "Difficulty: ratings use the minimum solution length and solution-space structure, not just dimensions.",
        "Daily puzzles: deterministic generation feeds the same verified, solvable board to everyone.",
        "Statistics: optimal move counts are computed from the same solver.",
      ],
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "Is pressing a cell twice ever useful? In Classic Lights Out, no. The second press exactly undoes the first, and every useful sequence can be reduced to a set of single presses.",
        "Why do some boards have many solutions? Because the move matrix can have free variables. When that happens, several press sets produce the same target, and the solver can choose the shortest.",
        "What is GF(2)? It is arithmetic with only the values 0 and 1, where addition is XOR. It is the coordinate system in which Lights Out naturally lives.",
      ],
    },
  ],
};

export const howPuzzlesAreMade: GuideMeta = {
  slug: "how-puzzles-are-made",
  title: "How Puzzles Are Made: Generation, Solvability, and Difficulty",
  description:
    "Inside the puzzle generator: reverse generation, solver validation, triviality checks, deterministic seeds, and the difficulty calibration system.",
  category: "Engine",
  updated: "2026-09-14",
  readingTime: "6 min",
  keywords: [
    "lights out puzzle generation",
    "how are puzzles generated",
    "lights out difficulty",
    "reverse generation puzzle",
    "solvable puzzle generator",
  ],
  faq: [
    {
      question: "How does Easy Lights Out generate puzzles?",
      answer:
        "The generator starts from the solved state, applies a sequence of legal random moves, and then validates the result with the solver. This guarantee-based approach makes every board solvable before it ever reaches you.",
    },
    {
      question: "What makes a puzzle difficult?",
      answer:
        "Difficulty is measured with properties like the minimum solution length, the number of active starting cells, the solution-space structure, and the logical complexity, not merely the number of cells.",
    },
    {
      question: "Does the generator ever produce an unsolvable board?",
      answer:
        "No. Every candidate board is checked with the solver before being accepted. Trivial, pre-solved, and excessively expensive boards are rejected as well.",
    },
  ],
  content: [
    { type: "p", text: "A great puzzle is not a random collection of lights. It is a carefully engineered combination of a solvable state, a meaningful minimum path, and a difficulty rating you can trust." },
    { type: "h2", text: "Reverse generation" },
    {
      type: "p",
      text: "The simplest reliable way to guarantee solvability is to never leave the reachable space:",
    },
    {
      type: "ol",
      items: [
        "Begin with the solved, all-off board.",
        "Apply a random but legal sequence of moves.",
        "The resulting state is by construction reachable from solved, therefore solvable.",
        "Validate it with the solver anyway, because every candidate deserves verification.",
      ],
    },
    { type: "h2", text: "Rejecting bad boards" },
    {
      type: "p",
      text: "Solvable is not the same as worth playing. The generator rejects boards that are:",
    },
    {
      type: "ul",
      items: [
        "Already solved, so there is nothing to do.",
        "Solvable in one or two obvious moves.",
        "Unsolvable, an impossibility with reverse generation but still checked.",
        "Outside the requested difficulty band.",
        "Too expensive for the solver to analyze comfortably.",
      ],
    },
    { type: "h2", text: "Difficulty calibration" },
    {
      type: "p",
      text: "Difficulty is data-driven, stored in one central calibration table so it can be tuned without touching the generator. Each band combines several measured properties:",
    },
    {
      type: "table",
      header: ["Level", "Character"],
      rows: [
        ["Beginner", "Very small board, short solution."],
        ["Easy", "Small board, moderate solution."],
        ["Medium", "Standard board, moderate complexity."],
        ["Hard", "Large board, longer or less intuitive solution."],
        ["Expert", "Large board, high complexity."],
        ["Brutal", "Special topology or very high solution complexity."],
      ],
    },
    { type: "h2", text: "Deterministic seeds" },
    {
      type: "p",
      text: "Generation runs from a random or explicit seed. Seeded puzzles, like the Daily Puzzle, regenerate identically every time the seed and version match, making puzzles reproducible, shareable, and posterity-safe.",
    },
    { type: "h2", text: "Multiple solutions and clarity" },
    {
      type: "p",
      text: "The generator and solver also record how many valid solutions a board has. This matters for Minimum Moves mode, where the competition is against the shortest solution, and for hints, where the engine can point at any cell consistent with optimal play.",
    },
    { type: "h2", text: "The payoff" },
    {
      type: "callout",
      tone: "tip",
      title: "Trust every board",
      text: "When Easy Lights Out hands you a puzzle, a solver already proved it works. Every board you tap has a solution, a difficulty rating, and a measured optimum behind it.",
    },
  ],
};