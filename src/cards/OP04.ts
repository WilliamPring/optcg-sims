import type { Card } from "../types/index.js";

/**
 * OP04-001 — Nefeltari Vivi (Leader)
 * This Leader cannot attack.
 * [Activate:Main] [Once Per Turn] (2): Draw 1 card and up to 1 of your Characters
 * gains [Rush] during this turn.
 *
 * Notable: dual-color Blue/Red leader with 5 life and a permanent attack restriction.
 */
export const OP04_001: Card = {
  id: "op04-001",
  code: "OP04-001",
  name: "Nefeltari Vivi",
  type: "LEADER",
  color: ["Blue", "Red"],
  attribute: "Slash",
  factions: ["Alabasta"],
  power: 5000,
  life: 5,
  keywords: [],
  rules: [
    {
      // "This Leader cannot attack." — permanent restriction encoded as CONTINUOUS.
      id: "vivi-op04-cannot-attack",
      type: "CONTINUOUS",
      effects: [
        {
          type: "RESTRICT_ATTACK",
          target: { scope: "SELF" },
        },
      ],
    },
    {
      id: "vivi-op04-activate",
      type: "ACTIVATED",
      timing: "ACTIVATE_MAIN",
      oncePerTurn: true,
      cost: [
        { type: "RETURN_DON", amount: 2 },
      ],
      effects: [
        {
          type: "DRAW",
          target: { scope: "SELF" },
          amount: 1,
          then: [
            {
              type: "GRANT_KEYWORD",
              target: {
                scope: "SINGLE_FRIENDLY_CHARACTER",
                maxTargets: 1,
              },
              keyword: "RUSH",
              duration: "END_OF_TURN",
              optional: true,
            },
          ],
        },
      ],
    },
  ],
};
