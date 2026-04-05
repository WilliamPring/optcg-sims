import type { Card } from "../types/index.js";

/**
 * OP06-001 — Uta (Leader)
 * [When Attacking] You may trash 1 "FILM" type card from your hand: Give up to 1 of
 * your opponent's Characters -2000 power during this turn. Then, add up to 1 DON!!
 * card from your DON!! deck and rest it.
 */
export const OP06_001: Card = {
  id: "op06-001",
  code: "OP06-001",
  name: "Uta",
  type: "LEADER",
  color: ["Purple", "Red"],
  attribute: "Special",
  factions: ["FILM"],
  power: 5000,
  life: 4,
  keywords: [],
  rules: [
    {
      id: "uta-when-attacking",
      type: "TRIGGERED",
      timing: "WHEN_ATTACKING",
      optional: true,
      cost: [
        {
          // "You may trash 1 'FILM' type card" — optional DISCARD cost with faction filter.
          type: "DISCARD",
          target: {
            scope: "SELF",
            filter: [{ fact: "target.faction", operator: "CONTAINS", value: "FILM" }],
          },
          amount: 1,
        },
      ],
      effects: [
        {
          type: "ADD_POWER",
          target: { scope: "SINGLE_ENEMY_CHARACTER", maxTargets: 1 },
          amount: -2000,
          duration: "END_OF_TURN",
          optional: true,
          then: [
            {
              // "Add up to 1 DON!! from your DON!! deck and rest it."
              // zones: ["DECK"] indicates the DON!! source; it enters the pool rested.
              type: "ATTACH_DON",
              target: { scope: "SELF" },
              amount: 1,
              zones: ["DECK"],
              optional: true,
            },
          ],
        },
      ],
    },
  ],
};
