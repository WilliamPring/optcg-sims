# OPTCG Simulator

A headless simulator for the **One Piece Trading Card Game (OPTCG)** written in TypeScript.

The goal is a simulator you can run programmatically — no UI, no browser — to test deck strategies, resolve edge-case interactions, and eventually run automated game simulations.

---

## Quick start

```bash
yarn            # install deps
yarn build      # type-check (no JS emitted)
yarn test       # run all tests
yarn test:watch # run tests in watch mode
```

---

## Project structure

```
src/
  types/      The DSL — what every card concept means in TypeScript
  cards/      Real card definitions, modelled as data
  state/      A game in progress — snapshot of everything mid-match
  __tests__/  Tests for each layer
```

The project is built in layers. Each layer only depends on the ones below it:

```
  cards/    ──uses──▶  types/
  state/    ──uses──▶  types/
  engine/   ──uses──▶  types/ + state/    (Phase 4, not built yet)
```

---

## Build status

| Phase | What | Status |
|-------|------|--------|
| 1 | DSL type system (`src/types/`) | Done |
| 2 | Cards modelled + test infrastructure | Done |
| 3 | Game state model (`src/state/`) | Done |
| 4 | Effect resolution engine | Not started |
| 5 | Combat state machine | Not started |
| 6 | Turn loop + headless game runner | Not started |

**61 tests, all passing.**

---

## Layer 1 — The DSL (`src/types/`)

> "What does every card concept mean?"

Before writing any game logic, every concept in the card game is defined as a TypeScript type. This is the foundation everything else rests on.

### The core building block: `Rule`

Every card ability is a `Rule`. There are three kinds:

| Type | When it fires | Example |
|------|--------------|---------|
| `TRIGGERED` | Automatically when a game event happens | "When this character is KO'd..." |
| `ACTIVATED` | Player manually activates it and pays a cost | "[Activate: Main] REST this leader:" |
| `CONTINUOUS` | Always-on while the card is in play | "Your characters get +1000 power" |

A rule has three parts that evaluate in order:

```
1. conditions  — does the rule fire at all?      (e.g. "only on your turn")
2. cost        — what does the player pay?       (rest, discard, return DON!!)
3. effects     — what actually happens           (draw, KO, grant keyword, etc.)
```

### Effects chain with `then`

Effects can chain. The `then` field on an `Effect` lets you sequence multiple things:

```
Draw 2 cards
  └─ then: Trash 1 card from hand        (mandatory)
             └─ then: Trash 3 more cards (optional)
```

This directly models how card text reads: "Draw 2. Then, trash 1 card."

### Conditions are a discriminated union — not loose strings

Instead of `fact: "target.cost"` as a plain unchecked string, every condition is typed precisely:

```ts
// Valid — target.cost can use LTE
{ fact: "target.cost", operator: "LTE", value: 5 }

// Compile error — target.cost cannot use CONTAINS
{ fact: "target.cost", operator: "CONTAINS", value: 5 }
```

If you write a condition that doesn't make sense for that fact, **TypeScript catches it before the code ever runs.** There are 18 fact variants covering target properties, event context, player state, and turn state.

### Files in `src/types/`

| File | What it defines |
|------|----------------|
| `core.ts` | `Color`, `CardType`, `Keyword`, `Zone`, `TargetScope`, `TurnPhase`, `TriggerTiming`, `Operator` |
| `condition.ts` | Every valid game-state fact as a discriminated union (18 variants) |
| `effect.ts` | `EffectType` (32 types), `Effect`, `Target` |
| `rule.ts` | `Rule`, `Cost`, `CostType` |
| `card.ts` | `Card` — the top-level card interface |

---

## Layer 2 — Cards (`src/cards/`)

> "Here are real cards, modelled as data."

Each file corresponds to a set. Cards are plain `const` objects — no methods, no classes, just data conforming to the `Card` type.

### Example — Nefeltari Vivi (EB03-001)

```ts
export const EB03_001: Card = {
  id: "eb03-001",
  name: "Nefeltari Vivi",
  type: "LEADER",
  color: ["Blue", "Red"],   // dual-color → starts with 4 life cards
  power: 5000,
  life: 4,
  rules: [
    {
      // Once per turn: if your cost 4+ character would be KO'd,
      // trash 1 card instead to save it.
      id: "vivi-protect",
      type: "TRIGGERED",
      timing: "ON_KO",
      oncePerTurn: true,
      optional: true,
      conditions: [
        { fact: "event.target.controller", operator: "EQUALS", value: "SELF" },
        { fact: "event.target.baseCost",   operator: "GTE",    value: 4 }
      ],
      cost: [{ type: "TRASH_CARD", amount: 1 }],
      effects: [{
        type: "PREVENT_KO",
        target: { scope: "EVENT_TARGET" },
        replacementEffect: true   // replaces the KO event, not stacked on it
      }]
    },
    {
      // Rest this leader: give an enemy -2000 power, then optionally
      // grant RUSH to one of your characters until end of turn.
      id: "vivi-main",
      type: "ACTIVATED",
      timing: "ACTIVATE_MAIN",
      cost: [{ type: "REST", target: { scope: "SELF" } }],
      effects: [{
        type: "MINUS_POWER",
        target: { scope: "SINGLE_ENEMY_CHARACTER", maxTargets: 1 },
        amount: 2000,
        duration: "END_OF_TURN",
        then: [{
          type: "GRANT_KEYWORD",
          keyword: "RUSH",
          target: { scope: "SINGLE_FRIENDLY_CHARACTER", maxTargets: 1 },
          duration: "END_OF_TURN",
          optional: true
        }]
      }]
    }
  ]
};
```

The engine (Phase 4) will read objects like this and execute them generically. **No card ever needs special-cased engine code.**

### Cards modelled so far

| Code | Name | Key mechanics tested |
|------|------|----------------------|
| OP01-001 | Roronoa Zoro | `CONTINUOUS`, `donRequirement`, `turn.controller` condition |
| OP01-002 | Trafalgar Law | `CHOOSE_ONE`, `RETURN_TO_HAND` + `PLAY_FROM_HAND` chain |
| OP01-016 | Nami | `LOOK_AT_TOP_DECK`, multi-filter `REVEAL` |
| OP01-028 | Green Star Rafflesia | `COUNTER_STEP`, `TRIGGER`, negative power |
| OP01-074 | Bartholomew Kuma | `ON_KO`, `PLAY_FROM_HAND` with name + cost filter |
| OP01-079 | Ms. All Sunday | `self.leader.faction` condition, `ADD_TO_HAND` from `TRASH` |
| OP01-089 | Crescent Cutlass | Conditional `COUNTER_STEP`, `RETURN_TO_HAND` |
| OP01-120 | Shanks | `RUSH`, `WHEN_ATTACKING`, `RESTRICT_BLOCK` |
| OP01-121 | Yamato | `DOUBLE_ATTACK`, `BANISH`, `alternateNames` |
| OP02-001 | Edward Newgate | `END_OF_YOUR_TURN`, `ADD_TO_HAND` from `LIFE` |
| OP02-070 | New Kama Land | Stage type, `self.leader.name` condition, 3-level `then` chain |
| OP04-001 | Nefeltari Vivi | `CONTINUOUS` + `RESTRICT_ATTACK`, `GRANT_KEYWORD` |
| OP06-001 | Uta | `DISCARD` cost with faction filter, `ATTACH_DON` |
| OP07-117 | Egghead | Stage type, `END_OF_YOUR_TURN`, `self.lifeCount`, `SET_ACTIVE` |
| EB03-001 | Nefeltari Vivi | `PREVENT_KO` replacement effect, `event.target.*` conditions |
| OP10-045 | Cavendish | `WHEN_ATTACKING`, `oncePerTurn`, `DRAW` + `TRASH_CARD` chain |

---

## Layer 3 — Game State (`src/state/`)

> "What does a game in progress look like?"

A snapshot of a game at any point in time. No logic — just data.

### Files in `src/state/`

| File | What it holds |
|------|--------------|
| `CardInstance.ts` | One live copy of a card: its zone, rested state, DON!! attached, temporary power buffs, granted keywords/rules |
| `DonState.ts` | A player's DON!! counts — deck / active / rested |
| `PlayerState.ts` | Everything a player owns: hand, deck, life, trash, board, leader, stage, DON!! |
| `TurnState.ts` | Whose turn, current phase, turn number, first-player flag |
| `CombatState.ts` | Mid-attack snapshot: attacker, defender, counter value, block/counter restrictions |
| `EffectStack.ts` | Effects queued but not yet resolved |
| `GameState.ts` | The root — combines everything above + winner + event log |
| `index.ts` | Barrel re-exports + `createGameState` factory |

### `Card` vs `CardInstance` — the key distinction

`Card` is a **definition** — what the card is. It never changes.

`CardInstance` is a **live copy** during a game. Two copies of the same card are two independent instances with different IDs and independent state.

```
Card (immutable definition)          CardInstance (live game state)
────────────────────────────         ──────────────────────────────
name: "Shanks"                       instanceId: "f47ac10b-..."
power: 7000                          card: ──────────────────────▶ (points to Card)
keywords: ["RUSH"]                   owner: "P1"
rules: [...]                         zone: "BOARD"
                                     rested: true
                                     donAttached: 2
                                     temporaryPower: 1000
                                     playedThisTurn: false
```

### Life cards

Life is an ordered array — index 0 is the top of the pile (same convention as the deck). Life cards start `faceUp: false`. When damage is dealt:
- Pop `life[0]` → move to hand with `faceUp: true`
- If the card has the `TRIGGER` keyword → queue its effect before moving
- If the attack has `BANISH` → move to trash instead, skip TRIGGER entirely
- If `life.length === 0` after damage → `state.winner` is set

### Starting a game

```ts
import { createGameState } from "./state/index.js";

const state = createGameState(viviCard, p1Deck50Cards, zoroCard, p2Deck50Cards);
```

The factory:
1. Shuffles both 50-card decks
2. Places life face-down from the top (count comes from `leader.life` — can be 3, 4, or 5)
3. Deals 5-card opening hands
4. Inits DON!! at `{ deck: 10, active: 0, rested: 0 }`
5. Sets P1 as active player in `REFRESH` phase, turn 1

---

## High-level design decisions

### Immutable state

Every field in `GameState` and all its nested types is `readonly`. The engine never modifies state in place — it always produces a new state:

```ts
// Every engine function follows this signature:
function payDon(state: GameState, player: PlayerId, amount: number): GameState {
  // clone what changed, return new state
}
```

**Why:** You can snapshot state before an effect resolves and roll back if a replacement effect (like `PREVENT_KO`) fires. Debugging is easier because every transition is explicit and traceable.

### Discriminated `Condition` union

```ts
type Condition =
  | { fact: "target.cost";   operator: Operator;   value: number   }
  | { fact: "target.type";   operator: "EQUALS";   value: CardType }
  | { fact: "target.color";  operator: "CONTAINS"; value: Color    }
  // 15 more...
```

Each fact has exactly the operators and value types that make sense for it. The engine can `switch` on `condition.fact` and TypeScript narrows the type in each branch — no runtime `if (typeof value === "number")` guards needed.

### Effects are data, not functions

Card abilities are declarative objects. An ability that draws 2 then lets you trash 1:

```ts
{ type: "DRAW", amount: 2, then: [{ type: "TRASH_CARD", amount: 1 }] }
```

The engine walks the `then` chain recursively. Adding a new card with a never-before-seen combination of effects requires **zero new engine code** — just a new data object.

### `oncePerTurnUsed` is a `string[]`, not a `Set`

Rule IDs that have fired this turn are tracked as a string array. A `Set` would be more semantically correct, but `structuredClone()` — which the engine uses to copy state — cannot clone a `Set`. String arrays clone correctly.

### DON!! as counts, not objects

`DonState` is three numbers: `deck`, `active`, `rested`. There's no concept of individual DON!! token identity — it never matters. Attached DON!! lives as a number on `CardInstance.donAttached`. This simplifies every state operation involving DON!!.

### Players as a fixed-length tuple

```ts
readonly players: readonly [PlayerState, PlayerState]
```

TypeScript knows there are exactly two players. `state.players[0]` is always `PlayerState` — never `PlayerState | undefined`. With `noUncheckedIndexedAccess` on, a regular array would force an undefined check on every access.

---

## Card data source

Real card text: [optcgapi.com](https://optcgapi.com) — REST, no auth.

```
GET https://optcgapi.com/api/sets/card/{code}/
```

Note: the API returns `card_type: "Leader"` — map to `"LEADER"` on import. `attribute: "NULL"` maps to `undefined`.
