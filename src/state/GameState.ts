import type { PlayerState } from "./PlayerState.js";
import type { TurnState } from "./TurnState.js";
import type { CombatState } from "./CombatState.js";
import type { EffectStack } from "./EffectStack.js";
import type { PlayerId } from "./CardInstance.js";

export interface GameEvent {
  readonly type: string; // e.g. "CARD_PLAYED", "EFFECT_RESOLVED", "COMBAT_DAMAGE"
  readonly description: string;
  readonly turnNumber: number;
}

export interface GameState {
  // Tuple — index 0 is P1, index 1 is P2. Tuple ensures exactly two players.
  readonly players: readonly [PlayerState, PlayerState];
  readonly turn: TurnState;
  // null when no combat is in progress
  readonly combat: CombatState | null;
  readonly effectStack: EffectStack;
  // null until a player wins; set when a leader takes damage with 0 life remaining
  readonly winner: PlayerId | null;
  readonly log: ReadonlyArray<GameEvent>;
}
