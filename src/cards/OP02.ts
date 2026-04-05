import type { Card } from "../types/index.js";

/**
 * OP02-001 — Edward Newgate (Leader)
 * [End of Your Turn] Add 1 card from the top of your Life cards to your hand.
 *
 * Notable: mono-Red leader with 6000 power and 6 life (non-standard).
 */
export const OP02_001: Card = {
  id: "op02-001",
  code: "OP02-001",
  name: "Edward Newgate",
  type: "LEADER",
  color: ["Red"],
  attribute: "Strike",
  factions: ["The Four Emperors", "Whitebeard Pirates"],
  power: 6000,
  life: 6,
  keywords: [],
  rules: [
    {
      id: "newgate-end-of-turn",
      type: "TRIGGERED",
      timing: "END_OF_YOUR_TURN",
      effects: [
        {
          // Add top life card to hand — zones indicates the source zone.
          type: "ADD_TO_HAND",
          target: { scope: "SELF" },
          amount: 1,
          zones: ["LIFE"],
        },
      ],
    },
  ],
};

/**
 * OP02-070 — New Kama Land (Stage)
 * [Activate:Main] You may rest this Stage: If your Leader is [Emporio.Ivankov],
 * draw 1 card and trash 1 card from your hand. Then, trash up to 3 cards from your hand.
 */
export const OP02_070: Card = {
  id: "op02-070",
  code: "OP02-070",
  name: "New Kama Land",
  type: "STAGE",
  color: ["Blue"],
  factions: ["Impel Down"],
  cost: 1,
  keywords: [],
  rules: [
    {
      id: "new-kama-land-activate",
      type: "ACTIVATED",
      timing: "ACTIVATE_MAIN",
      optional: true,
      cost: [
        { type: "REST", target: { scope: "SELF" } },
      ],
      conditions: [
        { fact: "self.leader.name", operator: "EQUALS", value: "Emporio.Ivankov" },
      ],
      effects: [
        {
          type: "DRAW",
          target: { scope: "SELF" },
          amount: 1,
          then: [
            {
              type: "TRASH_CARD",
              target: { scope: "SELF" },
              amount: 1,
              then: [
                {
                  // "Then, trash up to 3 cards from your hand" — optional mass discard.
                  type: "TRASH_CARD",
                  target: { scope: "SELF" },
                  amount: 3,
                  optional: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
