import { randomUUID } from "node:crypto";
import type { Card, Zone } from "../types/index.js";

export type { PlayerId, CardInstance } from "./CardInstance.js";
export type { DonState } from "./DonState.js";
export type { PlayerState } from "./PlayerState.js";
export type { TurnState } from "./TurnState.js";
export type { CombatState } from "./CombatState.js";
export type { PendingEffect, EffectStack } from "./EffectStack.js";
export type { GameEvent, GameState } from "./GameState.js";

import type { PlayerId, CardInstance } from "./CardInstance.js";
import type { PlayerState } from "./PlayerState.js";
import type { GameState } from "./GameState.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: ReadonlyArray<T>): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // i and j are always valid indices within a — Fisher-Yates guarantees this
    const temp = a[i]!;
    a[i] = a[j]!;
    a[j] = temp;
  }
  return a;
}

function makeInstance(card: Card, owner: PlayerId, zone: Zone, faceUp = true): CardInstance {
  return {
    instanceId: randomUUID(),
    card,
    owner,
    controller: owner,
    zone,
    rested: false,
    donAttached: 0,
    temporaryPower: 0,
    grantedKeywords: [],
    grantedRules: [],
    oncePerTurnUsed: [],
    playedThisTurn: false,
    faceUp,
  };
}

function buildPlayer(leader: Card, deck: Card[], id: PlayerId): PlayerState {
  // Life count comes directly from the card definition — leaders can have 3, 4, or 5.
  // Falling back to 5 is a safety net; every leader Card should have life set.
  const lifeCount = leader.life ?? 5;

  const shuffled = shuffle(deck).map(c => makeInstance(c, id, "DECK"));

  // Take life cards face-down from the top of the shuffled deck
  const life = shuffled.slice(0, lifeCount).map(ci => ({
    ...ci,
    zone: "LIFE" as Zone,
    faceUp: false,
  }));

  // Deal opening hand of 5
  const hand = shuffled.slice(lifeCount, lifeCount + 5).map(ci => ({
    ...ci,
    zone: "HAND" as Zone,
  }));

  // Remaining cards stay in deck (index 0 = top)
  const remaining = shuffled.slice(lifeCount + 5);

  return {
    hand,
    deck: remaining,
    life,
    trash: [],
    characters: [],
    leader: makeInstance(leader, id, "BOARD"),
    stage: null,
    don: { deck: 10, active: 0, rested: 0 },
  };
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates the initial GameState for a match.
 *
 * Each deck must be exactly 50 non-leader cards. The leader is passed separately
 * (matching real OPTCG: the leader sits outside the 50-card deck).
 *
 * Setup steps per OPTCG rules:
 *   1. Shuffle both decks.
 *   2. Place life cards face-down (count from leader.life — 3, 4, or 5).
 *   3. Deal 5-card opening hand.
 *   4. P1 begins in REFRESH phase; isFirstPlayerFirstTurn gates draw/DON skip.
 */
export function createGameState(
  p1Leader: Card,
  p1Deck: Card[],
  p2Leader: Card,
  p2Deck: Card[],
): GameState {
  return {
    players: [buildPlayer(p1Leader, p1Deck, "P1"), buildPlayer(p2Leader, p2Deck, "P2")],
    turn: {
      activePlayer: "P1",
      phase: "REFRESH",
      turnNumber: 1,
      isFirstPlayerFirstTurn: true,
    },
    combat: null,
    effectStack: { pending: [] },
    winner: null,
    log: [],
  };
}
