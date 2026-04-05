import type { CardType, Color, Keyword, Operator, TriggerTiming } from "./core.js";

/**
 * Discriminated union of all valid game-state facts that can appear in Conditions.
 * Each branch is fully typed — invalid fact/value combinations are caught at compile time.
 */
export type Condition =
  | { fact: "target.cost";             operator: Operator;                   value: number }
  | { fact: "target.power";            operator: Operator;                   value: number }
  | { fact: "target.type";             operator: "EQUALS" | "NOT_EQUALS";   value: CardType }
  | { fact: "target.faction";          operator: "CONTAINS";                 value: string }
  | { fact: "target.name";             operator: "EQUALS" | "NOT_EQUALS";   value: string }
  | { fact: "target.hasKeyword";       operator: "EQUALS" | "NOT_EQUALS";   value: Keyword }
  | { fact: "target.hasRule";          operator: "EQUALS" | "NOT_EQUALS";   value: TriggerTiming }
  | { fact: "target.isRested";         operator: "EQUALS";                   value: boolean }
  | { fact: "target.color";            operator: "CONTAINS" | "NOT_EQUALS"; value: Color }
  | { fact: "event.target.controller"; operator: "EQUALS";                   value: "SELF" | "OPPONENT" }
  | { fact: "event.target.baseCost";   operator: Operator;                   value: number }
  | { fact: "self.lifeCount";          operator: Operator;                   value: number }
  | { fact: "self.donAttached";        operator: Operator;                   value: number }
  | { fact: "self.characterCount";     operator: Operator;                   value: number }
  | { fact: "self.trashCount";         operator: Operator;                   value: number }
  | { fact: "self.leader.faction";     operator: "CONTAINS";                 value: string }
  | { fact: "self.leader.name";        operator: "EQUALS" | "NOT_EQUALS";   value: string }
  | { fact: "turn.controller";         operator: "EQUALS";                   value: "SELF" | "OPPONENT" };
