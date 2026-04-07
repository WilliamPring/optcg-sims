export type Color = "Red" | "Green" | "Blue" | "Purple" | "Black" | "Yellow";

export type Attribute = "Slash" | "Strike" | "Ranged" | "Wisdom" | "Special";

export type CardType = "LEADER" | "CHARACTER" | "EVENT" | "STAGE";

export type Keyword =
  | "BLOCKER"
  | "RUSH"
  | "BANISH"
  | "DOUBLE_ATTACK"
  | "UNBLOCKABLE"
  | "TRIGGER"
  | "COUNTER";

export type Zone = "DECK" | "HAND" | "BOARD" | "TRASH" | "LIFE";

export type TargetScope =
  | "SELF"
  | "OPPONENT"
  | "EVENT_TARGET"
  | "SINGLE_FRIENDLY_CHARACTER"
  | "ALL_FRIENDLY_CHARACTERS"
  | "SINGLE_ENEMY_CHARACTER"
  | "ALL_ENEMY_CHARACTERS"
  | "ALL_ENEMY_RESTED_CHARACTERS"
  | "SELF_LEADER"
  | "OPPONENT_LEADER"
  | "FRIENDLY_LEADER_OR_CHARACTER"
  | "ENEMY_LEADER_OR_CHARACTER"
  | "ATTACKING_CARD"
  | "ANY_CHARACTER";

export type Operator = "EQUALS" | "NOT_EQUALS" | "LTE" | "GTE" | "CONTAINS";

export type Duration = "INSTANT" | "END_OF_TURN" | "END_OF_OPPONENT_TURN" | "PERMANENT";

export type TurnPhase = "REFRESH" | "DRAW" | "DON" | "MAIN" | "END";

export type TriggerTiming =
  | "ON_PLAY"
  | "ON_KO"
  | "WHEN_ATTACKING"
  | "WHEN_ATTACKED"
  | "ON_BLOCK"
  | "AFTER_DAMAGE"
  | "COUNTER_STEP"
  | "ACTIVATE_MAIN"
  | "END_OF_YOUR_TURN"
  | "TRIGGER"
  | "ON_OPPONENT_ATTACK";

export type RuleType = "TRIGGERED" | "ACTIVATED" | "CONTINUOUS";

export type CostType = "REST" | "TRASH_CARD" | "RETURN_DON" | "DISCARD" | "PAY";
