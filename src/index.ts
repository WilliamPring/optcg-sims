///////////////////////////
// 1. Card Types
///////////////////////////
type CardType = "LEADER" | "CHARACTER" | "EVENT" | "STAGE";

///////////////////////////
// 2. Keywords
///////////////////////////
type Keyword = 
    | "BLOCKER"
    | "RUSH"
    | "BANISH"
    | "DOUBLE_ATTACK"
    | "UNBLOCKABLE"
    | "TRIGGER"
    | "COUNTER";


///////////////////////////
// 4. Effect
///////////////////////////
type Effect =
  | { type: "DRAW"; amount: number }
  | { type: "KO"; target: "SELF" | "TARGET" }
  | { type: "ADD_POWER"; target: "SELF" | "TARGET" | "LEADER"; amount: number }
  | { type: "REST"; target: "SELF" | "TARGET" }
  | { type: "UNREST"; target: "SELF" | "TARGET" }
  | { type: "ATTACH_DON"; target: "SELF" | "TARGET"; amount: number }
  | { type: "DEAL_DAMAGE"; target: "OPPONENT"; amount: number };

///////////////////////////
// 5. Condition
///////////////////////////
type Operator = "EQUALS" | "LTE" | "GTE" | "CONTAINS";

interface Condition {
  fact: string;                     // e.g., "self.power", "target.cost", "event.fromZone"
  operator: Operator;
  value: number | string | boolean;
}

///////////////////////////
// 6. Target
///////////////////////////
type TargetScope =
  | "SELF"
  | "OPPONENT"
  | "SINGLE_ENEMY_CHARACTER"
  | "ALL_ENEMY_CHARACTERS"
  | "SINGLE_FRIENDLY_CHARACTER"
  | "ALL_FRIENDLY_CHARACTERS"
  | "LEADER";

interface Target {
  scope: TargetScope;
}

///////////////////////////
// 7. Trigger Timing
///////////////////////////
type TriggerTiming =
  | "ON_PLAY"
  | "ON_ATTACK_STEP"
  | "ON_BLOCK_STEP"
  |  "ON_KO"
  | "COUNTER_STEP"
  | "AFTER_DAMAGE";

///////////////////////////
// 8. Rule
///////////////////////////
interface Rule {
  id: string;
  timing?: TriggerTiming;                   // when this rule can be considered
  condition?: Condition[];     // single or multiple conditions (AND by default)
  target?: Target;
  effects: Effect[];
  optional?: boolean;                       // player may choose to activate
  replacementEffect?: boolean;              //“do something else instead of going to hand” is called a replacement effect.
}

///////////////////////////
// 9. Trigger
///////////////////////////
interface Trigger {
  rules: Rule[];
}

///////////////////////////
// 10. Card
///////////////////////////
interface Card {
  id: string;          // uuid
  code: string;        // ref code
  name: string;
  type: CardType;
  cost?: number;
  power?: number;
  counter?: number;   //1k 2k 
  keywords: Keyword[];
  trigger?: Trigger;   
  rules?: Rule[];      // general non-trigger rules
}