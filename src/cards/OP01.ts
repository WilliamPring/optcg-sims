import type { Card } from "../types/index.js";

/**
 * OP01-001 — Roronoa Zoro (Leader)
 * [DON!! x1] [Your Turn] All of your Characters gain +1000 power.
 */
export const OP01_001: Card = {
  id: "op01-001",
  code: "OP01-001",
  name: "Roronoa Zoro",
  type: "LEADER",
  color: ["Red"],
  attribute: "Slash",
  factions: ["Straw Hat Crew", "Supernovas"],
  power: 5000,
  life: 5,
  keywords: [],
  rules: [
    {
      id: "zoro-leader-continuous",
      type: "CONTINUOUS",
      donRequirement: 1,
      conditions: [
        { fact: "turn.controller", operator: "EQUALS", value: "SELF" },
      ],
      effects: [
        {
          type: "ADD_POWER",
          target: { scope: "ALL_FRIENDLY_CHARACTERS" },
          amount: 1000,
          duration: "PERMANENT",
        },
      ],
    },
  ],
};

/**
 * OP01-002 — Trafalgar Law (Leader)
 * [Activate:Main] [Once Per Turn] (2): If you have 5 Characters, return 1 of your
 * Characters to your hand. Then, play up to 1 Character with a cost of 5 or less
 * from your hand that is a different color than the returned Character.
 */
export const OP01_002: Card = {
  id: "op01-002",
  code: "OP01-002",
  name: "Trafalgar Law",
  type: "LEADER",
  color: ["Green", "Red"],
  attribute: "Slash",
  factions: ["Heart Pirates", "Supernovas"],
  power: 5000,
  life: 4,
  keywords: [],
  rules: [
    {
      id: "law-leader-activate",
      type: "ACTIVATED",
      timing: "ACTIVATE_MAIN",
      oncePerTurn: true,
      cost: [
        { type: "RETURN_DON", amount: 2 },
      ],
      conditions: [
        { fact: "self.characterCount", operator: "GTE", value: 5 },
      ],
      effects: [
        {
          type: "RETURN_TO_HAND",
          target: { scope: "SINGLE_FRIENDLY_CHARACTER", maxTargets: 1 },
          then: [
            {
              // Play up to 1 Character cost 5 or less, different color than returned.
              // The color-match constraint is engine-level; amount encodes max cost.
              type: "PLAY_FROM_HAND",
              target: {
                scope: "SINGLE_FRIENDLY_CHARACTER",
                filter: [
                  { fact: "target.type", operator: "EQUALS", value: "CHARACTER" },
                  { fact: "target.cost", operator: "LTE", value: 5 },
                ],
                maxTargets: 1,
              },
              optional: true,
            },
          ],
        },
      ],
    },
  ],
};

/**
 * OP01-016 — Nami
 * [On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew"
 * type Character card other than [Nami] and add it to your hand. Then, place the rest
 * at the bottom of your deck in any order.
 */
export const OP01_016: Card = {
  id: "op01-016",
  code: "OP01-016",
  name: "Nami",
  type: "CHARACTER",
  color: ["Red"],
  attribute: "Special",
  factions: ["Straw Hat Crew"],
  cost: 1,
  power: 2000,
  counter: 2000,
  keywords: [],
  rules: [
    {
      id: "nami-on-play",
      type: "TRIGGERED",
      timing: "ON_PLAY",
      effects: [
        {
          // Look at top 5, then take up to 1 matching, put rest on bottom.
          type: "LOOK_AT_TOP_DECK",
          target: { scope: "SELF" },
          amount: 5,
          then: [
            {
              type: "REVEAL",
              target: {
                scope: "SINGLE_FRIENDLY_CHARACTER",
                filter: [
                  { fact: "target.faction", operator: "CONTAINS", value: "Straw Hat Crew" },
                  { fact: "target.type", operator: "EQUALS", value: "CHARACTER" },
                  { fact: "target.name", operator: "NOT_EQUALS", value: "Nami" },
                ],
                maxTargets: 1,
              },
              optional: true,
              then: [
                {
                  type: "ADD_TO_HAND",
                  target: { scope: "EVENT_TARGET" },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * OP01-074 — Bartholomew Kuma
 * [Blocker] [On K.O.] Play up to 1 [Pacifista] with a cost of 4 or less from your hand.
 */
export const OP01_074: Card = {
  id: "op01-074",
  code: "OP01-074",
  name: "Bartholomew Kuma",
  type: "CHARACTER",
  color: ["Blue"],
  attribute: "Strike",
  factions: ["Revolutionary Army", "The Seven Warlords of the Sea"],
  cost: 4,
  power: 5000,
  counter: 1000,
  keywords: ["BLOCKER"],
  rules: [
    {
      id: "kuma-on-ko",
      type: "TRIGGERED",
      timing: "ON_KO",
      effects: [
        {
          type: "PLAY_FROM_HAND",
          target: {
            scope: "SINGLE_FRIENDLY_CHARACTER",
            filter: [
              { fact: "target.name", operator: "EQUALS", value: "Pacifista" },
              { fact: "target.cost", operator: "LTE", value: 4 },
            ],
            maxTargets: 1,
          },
          optional: true,
        },
      ],
    },
  ],
};

/**
 * OP01-120 — Shanks
 * [Rush] [When Attacking] Your opponent cannot activate a [Blocker] Character that
 * has 2000 or less power during this battle.
 */
export const OP01_120: Card = {
  id: "op01-120",
  code: "OP01-120",
  name: "Shanks",
  type: "CHARACTER",
  color: ["Red"],
  attribute: "Slash",
  factions: ["The Four Emperors", "Red-Haired Pirates"],
  cost: 9,
  power: 10000,
  keywords: ["RUSH"],
  rules: [
    {
      id: "shanks-when-attacking",
      type: "TRIGGERED",
      timing: "WHEN_ATTACKING",
      effects: [
        {
          // amount = power threshold: blockers with power <= amount are restricted
          type: "RESTRICT_BLOCK",
          target: { scope: "OPPONENT" },
          amount: 2000,
        },
      ],
    },
  ],
};

/**
 * OP01-028 — Green Star Rafflesia (Event)
 * [Counter] Give up to 1 of your opponent's Leader or Character cards -2000 power this turn.
 * [Trigger] Activate this card's [Counter] effect.
 */
export const OP01_028: Card = {
  id: "op01-028",
  code: "OP01-028",
  name: "Green Star Rafflesia",
  type: "EVENT",
  color: ["Red"],
  factions: ["Straw Hat Crew"],
  cost: 1,
  keywords: ["COUNTER"],
  rules: [
    {
      id: "rafflesia-counter",
      type: "TRIGGERED",
      timing: "COUNTER_STEP",
      effects: [
        {
          type: "ADD_POWER",
          target: { scope: "ENEMY_LEADER_OR_CHARACTER", maxTargets: 1 },
          amount: -2000,
          duration: "END_OF_TURN",
          optional: true,
        },
      ],
    },
    {
      // "Activate this card's [Counter] effect" — modeled by duplicating the effect.
      id: "rafflesia-trigger",
      type: "TRIGGERED",
      timing: "TRIGGER",
      effects: [
        {
          type: "ADD_POWER",
          target: { scope: "ENEMY_LEADER_OR_CHARACTER", maxTargets: 1 },
          amount: -2000,
          duration: "END_OF_TURN",
          optional: true,
        },
      ],
    },
  ],
};

/**
 * OP01-079 — Ms. All Sunday
 * [Blocker]
 * [On K.O.] If your Leader has the "Baroque Works" type, add up to 1 Event from
 * your trash to your hand.
 */
export const OP01_079: Card = {
  id: "op01-079",
  code: "OP01-079",
  name: "Ms. All Sunday",
  type: "CHARACTER",
  color: ["Blue"],
  attribute: "Strike",
  factions: ["Baroque Works"],
  cost: 3,
  power: 1000,
  counter: 1000,
  keywords: ["BLOCKER"],
  rules: [
    {
      id: "ms-allsunday-on-ko",
      type: "TRIGGERED",
      timing: "ON_KO",
      conditions: [
        { fact: "self.leader.faction", operator: "CONTAINS", value: "Baroque Works" },
      ],
      effects: [
        {
          type: "ADD_TO_HAND",
          target: {
            scope: "SINGLE_FRIENDLY_CHARACTER",
            filter: [{ fact: "target.type", operator: "EQUALS", value: "EVENT" }],
            maxTargets: 1,
          },
          zones: ["TRASH"],
          optional: true,
        },
      ],
    },
  ],
};

/**
 * OP01-089 — Crescent Cutlass (Event)
 * [Counter] If your Leader has the "The Seven Warlords of the Sea" type, return up to 1
 * Character with a cost of 5 or less to the owner's hand.
 */
export const OP01_089: Card = {
  id: "op01-089",
  code: "OP01-089",
  name: "Crescent Cutlass",
  type: "EVENT",
  color: ["Blue"],
  factions: ["Baroque Works", "The Seven Warlords of the Sea"],
  cost: 3,
  keywords: ["COUNTER"],
  rules: [
    {
      id: "crescent-cutlass-counter",
      type: "TRIGGERED",
      timing: "COUNTER_STEP",
      conditions: [
        { fact: "self.leader.faction", operator: "CONTAINS", value: "The Seven Warlords of the Sea" },
      ],
      effects: [
        {
          type: "RETURN_TO_HAND",
          target: {
            scope: "SINGLE_ENEMY_CHARACTER",
            filter: [{ fact: "target.cost", operator: "LTE", value: 5 }],
            maxTargets: 1,
          },
          optional: true,
        },
      ],
    },
  ],
};

/**
 * OP01-121 — Yamato
 * Also treat this card's name as [Kouzuki Oden] according to the rules.
 * [Double Attack] [Banish]
 */
export const OP01_121: Card = {
  id: "op01-121",
  code: "OP01-121",
  name: "Yamato",
  type: "CHARACTER",
  color: ["Green"],
  attribute: "Strike",
  factions: ["Land of Wano"],
  cost: 5,
  power: 5000,
  counter: 1000,
  keywords: ["DOUBLE_ATTACK", "BANISH"],
  alternateNames: ["Kouzuki Oden"],
};
