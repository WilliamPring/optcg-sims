import type { Card } from "../types/index.js";

/**
 * OP07-117 — Egghead (Stage)
 * [End of Your Turn] If you have 3 or less Life cards, set up to 1 [Egghead] type
 * Character with a cost of 5 or less as active.
 * [Trigger] Play this card.
 */
export const OP07_117: Card = {
  id: "op07-117",
  code: "OP07-117",
  name: "Egghead",
  type: "STAGE",
  color: ["Yellow"],
  factions: ["Egghead"],
  cost: 2,
  keywords: [],
  rules: [
    {
      id: "egghead-end-of-turn",
      type: "TRIGGERED",
      timing: "END_OF_YOUR_TURN",
      conditions: [
        { fact: "self.lifeCount", operator: "LTE", value: 3 },
      ],
      effects: [
        {
          type: "SET_ACTIVE",
          target: {
            scope: "SINGLE_FRIENDLY_CHARACTER",
            filter: [
              { fact: "target.faction", operator: "CONTAINS", value: "Egghead" },
              { fact: "target.cost", operator: "LTE", value: 5 },
            ],
            maxTargets: 1,
          },
          optional: true,
        },
      ],
    },
    {
      id: "egghead-trigger",
      type: "TRIGGERED",
      timing: "TRIGGER",
      effects: [
        {
          // Play this card (the Stage itself) from life area
          type: "PLAY_FROM_HAND",
          target: { scope: "SELF" },
        },
      ],
    },
  ],
};
