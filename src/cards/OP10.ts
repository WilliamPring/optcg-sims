import type { Card } from "../types/index.js";

/**
 * OP10-045 — Cavendish
 * [When Attacking] [Once Per Turn] Draw 2 cards and trash 1 card from your hand.
 */
export const OP10_045: Card = {
  id: "op10-045",
  code: "OP10-045",
  name: "Cavendish",
  type: "CHARACTER",
  color: ["Blue"],
  attribute: "Slash",
  factions: ["Beautiful Pirates", "Dressrosa"],
  cost: 4,
  power: 6000,
  keywords: [],
  rules: [
    {
      id: "cavendish-when-attacking",
      type: "TRIGGERED",
      timing: "WHEN_ATTACKING",
      oncePerTurn: true,
      effects: [
        {
          type: "DRAW",
          target: { scope: "SELF" },
          amount: 2,
          then: [
            {
              type: "TRASH_CARD",
              target: { scope: "SELF" },
              amount: 1,
            },
          ],
        },
      ],
    },
  ],
};
