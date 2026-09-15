import type { Metadata } from "next";
import { playMetadata } from "@/lib/seo";
import { GameScreen } from "@/components/game/GameScreen";

export const metadata: Metadata = playMetadata;

export default function PlayPage() {
  return <GameScreen />;
}