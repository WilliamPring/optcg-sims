import type { CostType, Duration, RuleType, TriggerTiming } from "./core.js";
import type { Condition } from "./condition.js";
import type { Effect, Target } from "./effect.js";

export interface Cost {
  type: CostType;
  /** Which card/player pays this cost. Optional for costs like PAY (DON!!). */
  target?: Target;
  /** Number of cards to trash/discard, or DON!! to return. */
  amount?: number;
}

export interface Rule {
  id: string;
  type: RuleType;
  /** When this rule fires (TRIGGERED/ACTIVATED) or what phase it's checked (CONTINUOUS). */
  timing?: TriggerTiming;
  /** All must pass for the rule to fire. */
  conditions?: Condition[];
  /** Costs paid before effects resolve (ACTIVATED rules). */
  cost?: Cost[];
  effects: Effect[];
  optional?: boolean;
  priority?: number;
  duration?: Duration;
  oncePerTurn?: boolean;
  /** For CONTINUOUS rules: minimum attached DON!! required for effect to apply ([DON!! x1] prefix). */
  donRequirement?: number;
}
