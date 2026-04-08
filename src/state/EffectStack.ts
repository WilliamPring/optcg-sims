import type { Effect, Rule } from "../types/index.js";
import type { CardInstance, PlayerId } from "./CardInstance.js";

export interface PendingEffect {
  readonly effect: Effect;
  readonly source: CardInstance; // card whose rule produced this effect
  readonly controller: PlayerId; // player who controls the source
  readonly triggeringRule?: Rule; // which rule fired (for context during resolution)
}

export interface EffectStack {
  // Effects resolve LIFO (last in, first out), like a TCG stack.
  // Replacement effects (PREVENT_KO) are pulled from the top before resolution.
  readonly pending: ReadonlyArray<PendingEffect>;
}
