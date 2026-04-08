import type { Attribute, CardType, Color, Keyword } from "./core.js";
import type { Rule } from "./rule.js";

export interface Card {
  id: string;
  code: string;
  name: string;
  type: CardType;
  color: Color[];
  attribute?: Attribute;
  /** Parsed from API sub_types field. */
  factions: string[];
  cost?: number;
  power?: number;
  counter?: number;
  /** Leaders only: number of starting life cards (3, 4, or 5 depending on the specific leader). */
  life?: number;
  keywords: Keyword[];
  rules?: Rule[];
  /** treat this card's name as X — used for name-based targeting. */
  alternateNames?: string[];
}
