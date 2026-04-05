import type { Card } from "../types/index.js";

/**
 * EB03-001 — Nefeltari Vivi (Leader)
 *
 * [Once Per Turn] If your Character with a base cost of 4 or more would be K.O.'d,
 * you may trash 1 card from your hand instead.
 *
 * [Activate: Main] You may rest this Leader: Give up to 1 of your opponent's
 * Characters 2000 power during this turn. Then, up to 1 of your Characters without
 * a [When Attacking] effect gains [Rush] during this turn.
 */
export const EB03_001: Card = {
  id: "eb03-001",
  code: "EB03-001",
  name: "Nefeltari Vivi",
  type: "LEADER",
  color: ["Blue", "Red"],
  attribute: "Slash",
  factions: ["Alabasta"],
  power: 5000,
  life: 4,
  keywords: [],
  rules: [
    {
      id: "vivi-protect",
      type: "TRIGGERED",
      timing: "ON_KO",
      oncePerTurn: true,
      optional: true,
      priority: 100,
      conditions: [
        { fact: "event.target.controller", operator: "EQUALS", value: "SELF" },
        { fact: "event.target.baseCost", operator: "GTE", value: 4 },
      ],
      cost: [
        { type: "TRASH_CARD", amount: 1 },
      ],
      effects: [
        {
          type: "PREVENT_KO",
          target: { scope: "EVENT_TARGET" },
          replacementEffect: true,
        },
      ],
    },
    {
      id: "vivi-main",
      type: "ACTIVATED",
      timing: "ACTIVATE_MAIN",
      optional: true,
      cost: [
        { type: "REST", target: { scope: "SELF" } },
      ],
      effects: [
        {
          // Give +2000 power to one of the opponent's Characters this turn.
          // Note: this BUFFS the opponent's character (correct per card text).
          type: "ADD_POWER",
          target: { scope: "SINGLE_ENEMY_CHARACTER", maxTargets: 1 },
          amount: 2000,
          duration: "END_OF_TURN",
          optional: true,
          then: [
            {
              // Grant Rush to one of your Characters that lacks a [When Attacking] effect.
              type: "GRANT_KEYWORD",
              target: {
                scope: "SINGLE_FRIENDLY_CHARACTER",
                filter: [
                  { fact: "target.hasRule", operator: "NOT_EQUALS", value: "WHEN_ATTACKING" },
                ],
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
