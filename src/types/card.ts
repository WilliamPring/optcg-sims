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
  /** Leaders only: number of starting life cards (4 for dual-color, 5 for mono). */
  life?: number;
  keywords: Keyword[];
  rules?: Rule[];
  /** treat this card's name as X — used for name-based targeting. */
  alternateNames?: string[];
}
