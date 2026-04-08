import type { CardInstance, PlayerId } from "./CardInstance.js";

export interface CombatState {
  readonly attacker: CardInstance;
  // "OPPONENT_LEADER" when attacking the leader directly (no instance needed)
  readonly defender: CardInstance | "OPPONENT_LEADER";
  readonly attackerController: PlayerId;
  readonly blockerUsed: boolean;
  readonly counterValue: number; // accumulated counter power added during counter step
  // Set by RESTRICT_BLOCK: only blockers with power >= maxPower may block
  readonly blockerRestricted?: { readonly maxPower: number };
  // Set by RESTRICT_COUNTER: opponent cannot add counter cards this combat
  readonly counterRestricted?: boolean;
}
