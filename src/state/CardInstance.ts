import type { Card, Zone, Keyword, Rule } from "../types/index.js";

export type PlayerId = "P1" | "P2";

export interface CardInstance {
  readonly instanceId: string; // UUID — unique across all instances in the game
  readonly card: Readonly<Card>; // immutable definition reference
  readonly owner: PlayerId; // who owns the card (doesn't change)
  readonly controller: PlayerId; // who controls it (can change via effects)
  readonly zone: Zone;
  readonly rested: boolean;
  readonly donAttached: number; // DON!! attached to this character
  readonly temporaryPower: number; // net ADD_POWER / MINUS_POWER this turn, cleared at Refresh
  readonly grantedKeywords: ReadonlyArray<Keyword>;
  readonly grantedRules: ReadonlyArray<Rule>;
  readonly oncePerTurnUsed: ReadonlyArray<string>; // rule IDs used this turn (string[] for structuredClone safety)
  readonly playedThisTurn: boolean; // gates non-RUSH attack
  readonly faceUp: boolean; // life cards start face-down
}
