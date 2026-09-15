"use client";

import { useEffect, useMemo, useState } from "react";
import {
  playArm,
  playTap,
  playTimeout,
  playWin,
  setAmbient as engineSetAmbient,
  setFxEnabled,
  setMusic as engineSetMusic,
  shutdown,
  unlockAudio,
  type AmbientKind,
} from "./soundscape";

export interface SoundscapeApi {
  sfxOn: boolean;
  musicOn: boolean;
  ambient: AmbientKind | null;
  setSfx: (on: boolean) => void;
  setMusic: (on: boolean) => void;
  setAmbient: (kind: AmbientKind | null) => void;
  arm: () => void;
  tap: () => void;
  win: () => void;
  timeout: () => void;
}

export function useSoundscape(): SoundscapeApi {
  const [sfxOn, setSfxOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [ambient, setAmbientState] = useState<AmbientKind | null>(null);

  useEffect(() => {
    return () => {
      shutdown();
    };
  }, []);

  return useMemo<SoundscapeApi>(
    () => ({
      sfxOn,
      musicOn,
      ambient,
      setSfx: (on) => {
        setSfxOn(on);
        setFxEnabled(on);
      },
      setMusic: (on) => {
        setMusicOn(on);
        engineSetMusic(on);
      },
      setAmbient: (kind) => {
        setAmbientState(kind);
        engineSetAmbient(kind);
      },
      arm: () => {
        unlockAudio();
        if (sfxOn) playArm();
      },
      tap: () => playTap(),
      win: () => playWin(),
      timeout: () => playTimeout(),
    }),
    [sfxOn, musicOn, ambient]
  );
}