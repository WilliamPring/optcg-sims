import type { PlayerId } from "./CardInstance.js";
import type { TurnPhase } from "../types/index.js";

export interface TurnState {
  readonly activePlayer: PlayerId;
  readonly phase: TurnPhase;
  readonly turnNumber: number; // starts at 1
  readonly isFirstPlayerFirstTurn: boolean; // P1 skips draw and gains 0 DON!! on turn 1
}
