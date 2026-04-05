# optcg-sims

A headless simulator for the **One Piece Trading Card Game (OPTCG)**, written in TypeScript.

## Philosophy

**DSL-first.** Every card is modeled as a declarative data object before any engine logic is written. The type system is expressive enough to encode any card's rules faithfully, so a single generic engine can execute them all — no per-card special cases.

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | DSL type system | ✅ Complete |
| 2 | Testing infrastructure | ✅ Complete |
| 3 | Game state model | Pending |
| 4 | Effect resolution engine | Pending |
| 5 | Combat state machine | Pending |
| 6 | Turn loop & integration | Pending |

See [`.claude/PLAN.md`](.claude/PLAN.md) for the full implementation roadmap.

## Tech stack

- **Language:** TypeScript (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Runtime:** Node.js
- **Test runner:** Vitest
- **Package manager:** Yarn

## Commands

```bash
yarn build        # type-check (noEmit — no JS output)
yarn test         # run tests once
yarn test:watch   # run tests in watch mode
```

## Project structure

```
src/
  types/          # DSL type system
    core.ts         Color, CardType, Keyword, Zone, Operator, TriggerTiming, …
    condition.ts    Condition discriminated union (18 fact variants)
    effect.ts       EffectType, Effect, Target
    rule.ts         Rule, Cost
    card.ts         Card interface
    index.ts        barrel re-export
  cards/          # declarative card definitions by set
    OP01.ts  OP02.ts  OP04.ts  OP06.ts  OP07.ts  OP10.ts  EB03.ts
  __tests__/
    dsl/            shape assertions for modeled cards
  index.ts        public API barrel export
docs/
  dsl.md          DSL reference — how to model a card
```

## Card data source

Real card text is sourced from [optcgapi.com](https://optcgapi.com) — REST, no auth required.

```
GET https://optcgapi.com/api/sets/card/{code}/
```

## Modeled cards

| Code | Name | Type | Key mechanics |
|------|------|------|---------------|
| OP01-001 | Roronoa Zoro | LEADER | `donRequirement`, `turn.controller` condition |
| OP01-002 | Trafalgar Law | LEADER | `RETURN_TO_HAND` + `PLAY_FROM_HAND` chain, `characterCount` condition |
| OP01-016 | Nami | CHARACTER | `LOOK_AT_TOP_DECK`, multi-filter REVEAL |
| OP01-028 | Green Star Rafflesia | EVENT | `COUNTER_STEP`, `TRIGGER`, negative ADD_POWER |
| OP01-074 | Bartholomew Kuma | CHARACTER | `ON_KO`, `PLAY_FROM_HAND` with name + cost filter |
| OP01-079 | Ms. All Sunday | CHARACTER | `self.leader.faction` condition, ADD_TO_HAND from TRASH |
| OP01-089 | Crescent Cutlass | EVENT | Conditional COUNTER_STEP, RETURN_TO_HAND |
| OP01-120 | Shanks | CHARACTER | `RUSH`, `WHEN_ATTACKING`, `RESTRICT_BLOCK` |
| OP01-121 | Yamato | CHARACTER | `DOUBLE_ATTACK`, `BANISH`, `alternateNames` |
| OP02-001 | Edward Newgate | LEADER | `END_OF_YOUR_TURN`, ADD_TO_HAND from LIFE, 6 life |
| OP02-070 | New Kama Land | STAGE | `self.leader.name` condition, 3-level `then` chain |
| OP04-001 | Nefeltari Vivi | LEADER | `CONTINUOUS` + `RESTRICT_ATTACK`, `GRANT_KEYWORD RUSH` |
| OP06-001 | Uta | LEADER | `DISCARD` cost with faction filter, `ATTACH_DON` |
| OP07-117 | Egghead | STAGE | `END_OF_YOUR_TURN`, `self.lifeCount` condition, `SET_ACTIVE` |
| EB03-001 | Nefeltari Vivi | LEADER | `PREVENT_KO` replacement effect, `event.target.*` conditions |
| OP10-045 | Cavendish | CHARACTER | `WHEN_ATTACKING`, `oncePerTurn`, DRAW + TRASH_CARD chain |
