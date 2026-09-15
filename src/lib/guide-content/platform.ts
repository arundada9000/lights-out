import type { GuideMeta } from "../guides";

export const statsAndAchievements: GuideMeta = {
  slug: "statistics-and-achievements",
  title: "Statistics, Records, and Achievements: Track Your Progress",
  description:
    "Understand your personal statistics, records, streaks, and achievements in Easy Lights Out, and how competitive and non-competitive runs are kept honest.",
  category: "Platform",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "lights out statistics",
    "lights out records",
    "lights out achievements",
    "puzzle game progress",
    "lights out personal best",
  ],
  faq: [
    {
      question: "What statistics does Easy Lights Out track?",
      answer:
        "Games played, completed, failed, completion rate, total and average moves, best and average time, best optimality, and longest streak, broken down by mode and board size.",
    },
    {
      question: "Can a hint-filled run overwrite my record?",
      answer:
        "Never. A run that uses hints, undo, or assistance is marked non-competitive and can never overwrite a legitimate competitive record.",
    },
    {
      question: "Where are my statistics stored?",
      answer:
        "Everything is stored locally on your device. There are no accounts and no cloud sync, so your data stays private and the game keeps working fully offline.",
    },
  ],
  content: [
    { type: "p", text: "Progress tracking in Easy Lights Out is designed to be truthful. Every number is real, every record is reproducible, and your privacy is absolute." },
    { type: "h2", text: "Your statistics at a glance" },
    {
      type: "p",
      text: "The statistics panel breaks your play down by mode, board size, difficulty, and ruleset:",
    },
    {
      type: "ul",
      items: [
        "Games played, completed, and failed.",
        "Completion rate across all games.",
        "Total moves and average moves per solve.",
        "Best time and average time per board size.",
        "Best optimality ratio, how close to the minimum you have solved.",
        "Longest completion streak.",
      ],
    },
    { type: "h2", text: "Personal records" },
    {
      type: "p",
      text: "Records are tracked per ruleset so a 3 x 3 record never competes with an 8 x 8 record:",
    },
    {
      type: "ul",
      items: [
        "Fastest completion.",
        "Fewest moves.",
        "Best score in scored modes.",
        "Longest survival run and most boards completed in Rush.",
        "Best Daily Puzzle result and best challenge result.",
      ],
    },
    { type: "h2", text: "Competitive honesty" },
    {
      type: "callout",
      tone: "info",
      title: "Never silently discarded",
      text: "Each run is marked Competitive or Non-competitive. Using a hint, undo, or an assist marks the run non-competitive, and such a run never overwrites a clean record. Nothing is ever deleted silently.",
    },
    { type: "h2", text: "Achievements" },
    {
      type: "p",
      text: "Achievements reward actual mastery and are awarded only for real conditions:",
    },
    {
      type: "table",
      header: ["Achievement", "Requirement"],
      rows: [
        ["First Solve", "Complete your first puzzle."],
        ["Perfect", "Solve a board within the minimum known move count."],
        ["Efficient", "Solve 10 puzzles at or near optimal."],
        ["Daily Habit", "Complete a sequence of Daily Puzzles."],
        ["Pattern Master", "Complete a set of Pattern puzzles."],
        ["Minimalist", "Complete a board with no wasted moves."],
        ["Survivor", "Reach a major Survival mode milestone."],
      ],
    },
    { type: "h2", text: "Streaks are informational" },
    {
      type: "p",
      text: "Daily, challenge, and survival streaks are displayed purely as information. There are no manipulative notifications, no guilt mechanics, and no pressure to keep a streak alive. Miss a day and the streak simply starts fresh when you return.",
    },
    { type: "h2", text: "Local and private" },
    {
      type: "p",
      text: "Settings, statistics, records, achievements, daily history, unfinished games, and replay metadata all live on your device. Nothing is uploaded, tracked, or shared. Offline play and local persistence are the foundation of the whole app.",
    },
  ],
};

export const offlineAndPwa: GuideMeta = {
  slug: "offline-and-pwa",
  title: "Play Offline: How the Easy Lights Out PWA Works",
  description:
    "Easy Lights Out is a fully offline Progressive Web App. Learn how to install it, play without internet, and why everything is stored on your device.",
  category: "Platform",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "lights out offline",
    "lights out pwa",
    "install puzzle game",
    "play offline puzzle",
    "progressive web app game",
  ],
  faq: [
    {
      question: "Does Easy Lights Out need internet to play?",
      answer:
        "No. The complete core game runs entirely offline. Once the app assets are loaded, every mode, puzzle, and saved game works without a connection.",
    },
    {
      question: "How do I install Easy Lights Out?",
      answer:
        "Open the site in a supported browser and use the Add to Home Screen option on iOS, the Install button in Chrome or Edge, or the equivalent menu option on Android.",
    },
    {
      question: "Where is my game data saved?",
      answer:
        "Settings, statistics, records, daily history, and unfinished games are stored locally on your device. There is no account and nothing is uploaded to a server.",
    },
  ],
  content: [
    { type: "p", text: "Easy Lights Out was designed to run where you are: on a train, a plane, or a spot with no signal at all. The entire game is a Progressive Web App built around an offline-first principle." },
    { type: "h2", text: "What offline-first means here" },
    {
      type: "ul",
      items: [
        "No account, no login, and no backend dependency.",
        "All puzzle generation runs on your device.",
        "Statistics, records, and unfinished games persist locally.",
        "The Daily Puzzle is computed from your calendar and works without internet.",
        "Once loaded, the app functions fully independently.",
      ],
    },
    { type: "h2", text: "Installing the app" },
    {
      type: "p",
      text: "On mobile and desktop, Easy Lights Out can be installed like a native app:",
    },
    {
      type: "table",
      header: ["Platform", "How to install"],
      rows: [
        ["iOS", "Safari: Share, then Add to Home Screen."],
        ["Android", "Chrome: menu, then Install app."],
        ["Windows / Edge", "Address bar install icon, or menu, Install."],
        ["macOS", "Chrome or Edge: Install from the menu."],
      ],
    },
    { type: "h2", text: "What you get by installing" },
    {
      type: "ul",
      items: [
        "A home-screen icon and app-style launcher.",
        "Faster startup and an app shell that loads instantly.",
        "Reliable offline behavior for the whole game.",
        "A distraction-free, full-screen experience.",
      ],
    },
    { type: "h2", text: "Unfinished games" },
    {
      type: "p",
      text: "Leave mid-solving and the exact board state is saved. When you return, you are offered to Continue your unfinished game or start a New Game. Nothing is lost when the tab closes.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Works on a plane",
      text: "Because the Daily Puzzle derives from your device's calendar and every mode runs locally, you can keep your streak going literally anywhere, with zero connectivity.",
    },
    { type: "h2", text: "Updates stay seamless" },
    {
      type: "p",
      text: "Installed PWAs receive updates automatically in the background. When you next open the app with a connection, the newest version is ready, and your local data carries over unchanged.",
    },
  ],
};

export const keyboardAndAccessibility: GuideMeta = {
  slug: "keyboard-and-accessibility",
  title: "Keyboard Shortcuts and Accessibility in Easy Lights Out",
  description:
    "The complete keyboard shortcut reference and the accessibility features of Easy Lights Out: reduced motion, contrast, screen readers, focus, and more.",
  category: "Platform",
  updated: "2026-09-14",
  readingTime: "4 min",
  keywords: [
    "lights out keyboard shortcuts",
    "lights out accessibility",
    "puzzle keyboard controls",
    "reduced motion game",
    "accessible puzzle game",
  ],
  faq: [
    {
      question: "What keyboard shortcuts does the game support?",
      answer:
        "Arrow keys move the cursor, Enter or Space activates the focused cell, R restarts, Z undoes where allowed, and Escape or P pauses. A shortcut reference is available in settings.",
    },
    {
      question: "Can I play without sound, haptics, animation, or color?",
      answer:
        "Yes. Every feature of the game works without any single channel. Cells have non-color state indicators, reduced motion is respected, and screen-reader labels describe every cell.",
    },
  ],
  content: [
    { type: "p", text: "A great game is playable by everyone. Easy Lights Out ships with full keyboard support, comprehensive accessibility, and no requirement to see, hear, or move quickly." },
    { type: "h2", text: "Keyboard controls" },
    {
      type: "table",
      header: ["Key", "Action"],
      rows: [
        ["Arrow keys", "Move the board cursor."],
        ["Enter / Space", "Activate (tap) the focused cell."],
        ["R", "Restart the current puzzle."],
        ["Z", "Undo the last move where allowed."],
        ["P / Escape", "Pause or resume."],
        ["H", "Request a hint where allowed."],
      ],
    },
    {
      type: "p",
      text: "Shortcuts can be viewed and customized in the settings panel, and a command palette gives instant access to the most common actions.",
    },
    { type: "h2", text: "Touch and pointer" },
    {
      type: "ul",
      items: [
        "Tap with a finger or a stylus, click with a mouse.",
        "Cells use comfortable 44px-plus touch targets.",
        "Large boards support zoom and pan instead of shrinking cells.",
        "Rapid tapping never triggers accidental duplicate moves.",
      ],
    },
    { type: "h2", text: "Color-independent states" },
    {
      type: "p",
      text: "Cell state is never conveyed by color alone. On, off, selected, and solved cells also differ in shape, brightness, texture, and accessibility labels, so the game remains clear with any color vision.",
    },
    { type: "h2", text: "Reduced motion" },
    {
      type: "p",
      text: "When your system requests reduced motion, transitions shorten, movement is trimmed, and only essential feedback remains. No important gameplay information is ever carried by motion alone.",
    },
    { type: "h2", text: "Sound and haptics" },
    {
      type: "p",
      text: "Both are entirely optional and controllable. They layer feedback on top of the core game but are never required to play. Master toggles and per-channel controls keep the experience quiet when you want silence.",
    },
    { type: "h2", text: "Screen readers" },
    {
      type: "p",
      text: "Every cell is a labeled element describing its position and state, and solved, paused, and result states are announced semantically. The game is fully navigable with a screen reader and keyboard alone.",
    },
    { type: "h2", text: "High contrast and scale" },
    {
      type: "p",
      text: "The interface offers an adjustable scale and high-contrast treatment, so text and controls remain readable at any preference. Typography uses flexible sizing rather than fixed pixel snapshots.",
    },
  ],
};

export const themesAndAppearance: GuideMeta = {
  slug: "themes-and-appearance",
  title: "Themes and Appearance: Make the Board Yours",
  description:
    "Easy Lights Out ships with deep personalization: light and dark modes, system themes, accent colors, typography, spacing, and appearance settings.",
  category: "Platform",
  updated: "2026-09-14",
  readingTime: "3 min",
  keywords: [
    "lights out themes",
    "light dark mode puzzle",
    "puzzle game customization",
    "accent colors game",
    "brightness mode logic game",
  ],
  faq: [
    {
      question: "What appearance settings are available?",
      answer:
        "Light, dark, and system color schemes, accent colors, font families and sizes, spacing density, and sound and haptic preferences, all saved locally.",
    },
    {
      question: "Does the app respect my system theme?",
      answer:
        "Yes. The System option follows your operating system's light or dark setting automatically and responds to changes while the app is open.",
    },
  ],
  content: [
    { type: "p", text: "The game gets out of your way. Every appearance detail is a token you can change, from the background of the board to the color of a lit cell." },
    { type: "h2", text: "Color schemes" },
    {
      type: "p",
      text: "Choose Light, Dark, or System. The System option mirrors your operating system's preference and reacts live to changes, while Light and Dark lock a specific look. Your choice is saved and reapplied instantly on your next visit.",
    },
    { type: "h2", text: "Accent colors" },
    {
      type: "p",
      text: "The accent color defines buttons, highlights, and the glow of lit cells. Pick from a thoughtfully chosen set of iOS-inspired hues. Because the whole interface is token-driven, changing the accent restyles everything consistently in one step.",
    },
    { type: "h2", text: "Typography" },
    {
      type: "p",
      text: "Font family and size are adjustable, including an interface scale that grows or shrinks every label, button, and reading element together. Text is readable and scalable rather than fixed-size snapshots.",
    },
    { type: "h2", text: "Spacing and density" },
    {
      type: "p",
      text: "A spacing preference controls how compact or airy the board and controls feel, letting you tune the interface for your screen size and preferences.",
    },
    { type: "h2", text: "Sound, haptics, and motion" },
    {
      type: "p",
      text: "Master toggles and granular controls configure gameplay sounds, UI sounds, volume, and haptic feedback. Motion sensitivity respects your system's reduced-motion preference and can also be tuned directly.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Everything persists locally",
      text: "All appearance choices are stored on your device and restored instantly. No account, no sync, no cloud.",
    },
    { type: "h2", text: "Consistency by design" },
    {
      type: "p",
      text: "None of this personalization is hardcoded into components. Colors, radii, spacing, and elevation are centralized design tokens, so custom themes can be added, or the whole look restyled at once, with no sweeping edits across the codebase.",
    },
  ],
};