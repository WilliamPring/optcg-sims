import type { Duration, Keyword, TargetScope, Zone } from "./core.js";
import type { Condition } from "./condition.js";
import type { Rule } from "./rule.js";

export type EffectType =
  | "DRAW"
  | "KO"
  | "PREVENT_KO"
  | "ADD_POWER"
  | "MINUS_POWER"
  | "REST"
  | "SET_ACTIVE"
  | "ATTACH_DON"
  | "DEAL_DAMAGE"
  | "TRASH_CARD"
  | "PLAY_FROM_HAND"
  | "RETURN_TO_HAND"
  | "ADD_TO_HAND"
  | "LOOK_AT_TOP_DECK"
  | "SEARCH_DECK"
  | "MILL"
  | "SHUFFLE_DECK"
  | "REVEAL"
  | "RESTRICT_PLAY"
  | "RESTRICT_ATTACK"
  | "RESTRICT_BLOCK"
  | "RESTRICT_COUNTER"
  | "GRANT_KEYWORD"
  | "GRANT_EFFECT"
  | "CHOOSE_ONE"
  | "ADD_TO_LIFE"
  | "KO_STAGE";

export interface Target {
  scope: TargetScope;
  /** All conditions must pass for a card to be a valid target. */
  filter?: Condition[];
  maxTargets?: number;
}

export interface Effect {
  type: EffectType;
  /** Omit for effects with no meaningful target (e.g. SHUFFLE_DECK). */
  target?: Target;
  /** Meaning depends on effect type: draw N, add N power, cost N or less, etc. */
  amount?: number;
  keyword?: Keyword;
  /** Additional condition gating this specific effect (not the rule). */
  condition?: Condition;
  zones?: Zone[];
  /** True if this effect replaces another event rather than stacking on it. */
  replacementEffect?: boolean;
  /** For DEAL_DAMAGE: suppress Trigger activation and send life cards to trash. */
  banish?: boolean;
  /** Resolve these effects in sequence after this effect resolves. */
  then?: Effect[];
  optional?: boolean;
  duration?: Duration;
  /** For GRANT_EFFECT: rules temporarily granted to the target card. */
  grantedRules?: Rule[];
  /** For CHOOSE_ONE: player picks exactly one branch to resolve. */
  branches?: Effect[][];
}
