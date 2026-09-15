import type { GuideMeta } from "../guides";

export const howToSolveLightsOut: GuideMeta = {
  slug: "how-to-solve-lights-out",
  title: "How to Solve Lights Out: Step-by-Step Click Guide",
  description:
    "A click-by-click recipe that clears any Lights Out board: sweep rows down, read the bottom row, tap the top-row answer, and sweep once more. Works on every board size.",
  category: "Strategy",
  updated: "2026-09-15",
  readingTime: "6 min",
  keywords: [
    "how to solve lights out",
    "lights out solution steps",
    "lights out step by step",
    "lights out bottom row method",
    "lights out click guide",
  ],
  faq: [
    {
      question: "Does this method solve every board?",
      answer:
        "Yes, for every board Easy Lights Out produces. The generator only creates solvable states, and the three-step click method reaches the solution on all of them.",
    },
    {
      question: "What if the solver says a pattern is invalid?",
      answer:
        "That bottom row cannot be reached by a correct sweep, which means a tap in the sweep above was wrong. Restart the board and repeat the sweep one row at a time.",
    },
    {
      question: "Do bigger boards need a different method?",
      answer:
        "No. The sweep and the bottom-row reading are identical on every board, from 3 x 3 up to 8 x 8. Bigger boards simply have more possible bottom-row patterns.",
    },
  ],
  content: [
    {
      type: "p",
      text: "This guide is a pure click-by-click recipe for clearing any Lights Out board. No theory and no names to memorize: three steps, always the same. Use the interactive solver below to check where you are at any moment.",
    },
    { type: "h2", text: "The three-click method" },
    {
      type: "steps",
      items: [
        "Sweep rows down. Start at the top row. For every lit cell, tap the cell directly below it. Move down one row at a time and repeat, so every row above the bottom row becomes dark.",
        "Read the bottom row. Match the lit cells on your bottom row to a pattern in the interactive tool, then tap the cells it marks on the top row, once.",
        "Sweep one more time. Repeat the first step exactly: from the top row down, tap the cell below every lit cell. When you reach the bottom, the whole board is dark.",
        "If a light remains, reread the bottom row and repeat steps two and three. This is always the finishing move.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "A matching pattern always exists",
      text: "Every board Easy Lights Out creates is built to be solved this way, so the bottom row you land on will always match one of the cards. You never have to fight an unsolvable puzzle.",
    },
    { type: "h2", text: "Step 1 in detail: the downward sweep" },
    {
      type: "p",
      text: "The sweep is the whole method, and it works on one rule: to turn off a lit cell, tap the cell below it. That tap flips the lit cell above it off, and it never touches any other cell in the row above, so you clear each row one light at a time.",
    },
    {
      type: "p",
      text: "Work left to right across the top row, then the second row, then the third, until only the bottom row still has lights. Taps made on a row below never disturb the rows you already cleared.",
    },
    { type: "h2", text: "Try it on your own board" },
    {
      type: "p",
      text: "Copy the lights you see on your bottom row into the tool below. It shows you the exact cells to tap on the top row and walks you through the final sweep.",
    },
    { type: "solver" },
    { type: "h2", text: "Step 2 in detail: reading the bottom row" },
    {
      type: "p",
      text: "After the first sweep, only bottom-row cells can be lit. Tap them into the tool: the marked lamps are the cells to press on your top row, pressed exactly once each. Then finish with the third step.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "The tool rejected your row",
      text: "An invalid message means no correct sweep produces that bottom row, so a tap somewhere above was wrong. Restart the board and sweep again one row at a time, checking each row goes fully dark before moving on.",
    },
    { type: "h2", text: "Practice until it sticks" },
    {
      type: "p",
      text: "Start on a small board and walk through the three steps slowly. After a few clears the sweep becomes automatic, and the bottom-row answers train themselves into your hand.",
    },
    {
      type: "ul",
      items: [
        "Use a 3 x 3 or 4 x 4 board first so the bottom row is short.",
        "Pause before step two and read the bottom row out loud as cell numbers.",
        "After the final sweep, count your moves: fewer retries means a cleaner sweep.",
        "Zen mode and undo make trial runs risk-free while you practice.",
      ],
    },
    {
      type: "link-list",
      links: [{ label: "Play a practice board", href: "/play" }],
    },
    { type: "h2", text: "FAQ" },
    {
      type: "ul",
      items: [
        "Does this method need me to memorize patterns for every board size? No. The tool computes the top-row tap for any bottom row, on any of the supported sizes, so the recipe never changes.",
        "Is this the fastest possible solve? Not always, but it is the most reliable. Minimum Moves mode runs the full search when you want a true shortest solution.",
        "What about the special modes? Pattern and Daily modes keep the same mechanics, so the three steps apply. Timed mode benefits most: one clean sweep beats fast random tapping.",
      ],
    },
  ],
};