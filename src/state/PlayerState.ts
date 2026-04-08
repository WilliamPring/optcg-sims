import type { CardInstance } from "./CardInstance.js";
import type { DonState } from "./DonState.js";

export interface PlayerState {
  readonly hand: ReadonlyArray<CardInstance>;
  readonly deck: ReadonlyArray<CardInstance>; // index 0 = top of deck
  readonly life: ReadonlyArray<CardInstance>; // index 0 = top; face-down until revealed during damage
  readonly trash: ReadonlyArray<CardInstance>;
  readonly characters: ReadonlyArray<CardInstance>; // cards on the board; rested state lives on CardInstance
  readonly leader: CardInstance;
  readonly stage: CardInstance | null; // at most one Stage in play; null if none
  readonly don: DonState;
}
