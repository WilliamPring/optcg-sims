import type { Card } from "../types/index.js";

/**
 * OP15-055 — "Go Ahead and Use 'Em, Mr. Luffy!!!" (Event)
 * [Main] Choose one:
 *   • Draw 2 cards.
 *   • Up to 1 of your {Dressrosa} type Characters gains [Blocker] until the end
 *     of your opponent's next End Phase.
 *
 * Source: Adventure on Kami's Island (OP15), released 2026-04-03.
 * This is the first confirmed real card in the set to use the CHOOSE_ONE mechanic.
 */
export const OP15_055: Card = {
  id: "op15-055",
  code: "OP15-055",
  name: "Go Ahead and Use 'Em, Mr. Luffy!!!",
  type: "EVENT",
  color: ["Blue"],
  factions: ["Dressrosa", "Barto Club"],
  cost: 3,
  keywords: [],
  rules: [
    {
      id: "go-ahead-main",
      type: "TRIGGERED",
      timing: "ON_PLAY",
      effects: [
        {
          type: "CHOOSE_ONE",
          branches: [
            // Branch A: Draw 2 cards.
            [
              {
                type: "DRAW",
                target: { scope: "SELF" },
                amount: 2,
              },
            ],
            // Branch B: Give a Dressrosa Character Blocker until opponent's next End Phase.
            [
              {
                type: "GRANT_KEYWORD",
                keyword: "BLOCKER",
                target: {
                  scope: "SINGLE_FRIENDLY_CHARACTER",
                  filter: [
                    { fact: "target.faction", operator: "CONTAINS", value: "Dressrosa" },
                  ],
                  maxTargets: 1,
                },
                duration: "END_OF_OPPONENT_TURN",
                optional: true,
              },
            ],
          ],
        },
      ],
    },
  ],
};
