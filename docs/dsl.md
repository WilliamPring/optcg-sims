# DSL Reference

Every card in the simulator is a plain TypeScript object conforming to the `Card` interface. No classes, no methods — just data. The engine reads these objects and executes their rules generically.

---

## Card

```ts
interface Card {
  id: string;              // lowercase slug: "op01-001"
  code: string;            // official code: "OP01-001"
  name: string;
  type: CardType;          // "LEADER" | "CHARACTER" | "EVENT" | "STAGE"
  color: Color[];          // array — dual-color leaders have 2
  attribute?: Attribute;   // "Slash" | "Strike" | "Ranged" | "Wisdom" | "Special"
  factions: string[];      // e.g. ["Straw Hat Crew", "Supernovas"]
  cost?: number;           // absent on LEADERs
  power?: number;
  counter?: number;        // absent on LEADERs and EVENTs
  life?: number;           // LEADERs only
  keywords: Keyword[];
  rules?: Rule[];
  alternateNames?: string[]; // "Also treat this card's name as [X]"
}
```

### Example — minimal character

```ts
const OP01_016: Card = {
  id: "op01-016",
  code: "OP01-016",
  name: "Nami",
  type: "CHARACTER",
  color: ["Green"],
  factions: ["Straw Hat Crew"],
  cost: 1,
  power: 2000,
  counter: 2000,
  keywords: [],
  rules: [ /* ... */ ],
};
```

---

## Rule

A rule is a discrete ability on a card. Every rule has a `type` and an array of `effects`.

```ts
interface Rule {
  id: string;
  type: RuleType;          // "TRIGGERED" | "ACTIVATED" | "CONTINUOUS"
  timing?: TriggerTiming;  // when it fires (omit for CONTINUOUS)
  conditions?: Condition[]; // all must pass for the rule to fire
  cost?: Cost[];           // paid before effects resolve (ACTIVATED only)
  effects: Effect[];
  optional?: boolean;      // "you may" — player can decline
  priority?: number;       // for replacement effects (higher = checked first)
  duration?: Duration;
  oncePerTurn?: boolean;
  donRequirement?: number; // [DON!! x1] prefix — min attached DON!! on this card
}
```

### Rule types

| Type | Description |
|------|-------------|
| `TRIGGERED` | Fires automatically at a `TriggerTiming` |
| `ACTIVATED` | Player manually pays `cost[]` during their main phase |
| `CONTINUOUS` | Always-on while the card is in play |

### Trigger timings

| Timing | When it fires |
|--------|---------------|
| `ON_PLAY` | When this card enters the board |
| `ON_KO` | When this card is KO'd |
| `WHEN_ATTACKING` | When this card declares an attack |
| `WHEN_ATTACKED` | When this card is the attack target |
| `ON_BLOCK` | When this card is used as a blocker |
| `AFTER_DAMAGE` | After a damage step resolves |
| `COUNTER_STEP` | During the counter step (EVENT cards with COUNTER keyword) |
| `ACTIVATE_MAIN` | Player activates during main phase (ACTIVATED rules) |
| `END_OF_YOUR_TURN` | At the end of the controller's turn |
| `TRIGGER` | Life card trigger mechanic |
| `ON_OPPONENT_ATTACK` | When the opponent declares an attack |

### Example — triggered ON_KO

```ts
{
  id: "kuma-on-ko",
  type: "TRIGGERED",
  timing: "ON_KO",
  effects: [{
    type: "PLAY_FROM_HAND",
    optional: true,
    target: {
      scope: "SINGLE_FRIENDLY_CHARACTER",
      filter: [
        { fact: "target.name", operator: "EQUALS", value: "Pacifista" },
        { fact: "target.cost", operator: "LTE",    value: 4 },
      ],
    },
  }],
}
```

### Example — CONTINUOUS with donRequirement

```ts
// [DON!! x1] Your Characters get +1000 power during your turn.
{
  id: "zoro-continuous",
  type: "CONTINUOUS",
  donRequirement: 1,
  conditions: [{ fact: "turn.controller", operator: "EQUALS", value: "SELF" }],
  effects: [{
    type: "ADD_POWER",
    target: { scope: "ALL_FRIENDLY_CHARACTERS" },
    amount: 1000,
  }],
}
```

### Example — ACTIVATED with cost

```ts
// [Activate:Main] [Once Per Turn] ② (Return 2 DON!! to deck): …
{
  id: "vivi-activate",
  type: "ACTIVATED",
  timing: "ACTIVATE_MAIN",
  oncePerTurn: true,
  cost: [{ type: "RETURN_DON", amount: 2 }],
  effects: [ /* ... */ ],
}
```

---

## Condition

Conditions are predicates on game state, used in `Rule.conditions` and `Target.filter`. Each variant is fully typed — invalid fact/operator/value combinations are caught at compile time.

```ts
type Condition =
  // Target card properties
  | { fact: "target.cost";       operator: Operator;                  value: number }
  | { fact: "target.power";      operator: Operator;                  value: number }
  | { fact: "target.type";       operator: "EQUALS" | "NOT_EQUALS";  value: CardType }
  | { fact: "target.faction";    operator: "CONTAINS";                value: string }
  | { fact: "target.name";       operator: "EQUALS" | "NOT_EQUALS";  value: string }
  | { fact: "target.hasKeyword"; operator: "EQUALS" | "NOT_EQUALS";  value: Keyword }
  | { fact: "target.hasRule";    operator: "EQUALS" | "NOT_EQUALS";  value: TriggerTiming }
  | { fact: "target.isRested";   operator: "EQUALS";                  value: boolean }
  | { fact: "target.color";      operator: "CONTAINS" | "NOT_EQUALS";value: Color }
  // Event context (what triggered this rule)
  | { fact: "event.target.controller"; operator: "EQUALS"; value: "SELF" | "OPPONENT" }
  | { fact: "event.target.baseCost";   operator: Operator; value: number }
  // Self / board state
  | { fact: "self.lifeCount";      operator: Operator; value: number }
  | { fact: "self.donAttached";    operator: Operator; value: number }
  | { fact: "self.characterCount"; operator: Operator; value: number }
  | { fact: "self.trashCount";     operator: Operator; value: number }
  | { fact: "self.leader.faction"; operator: "CONTAINS";              value: string }
  | { fact: "self.leader.name";    operator: "EQUALS" | "NOT_EQUALS"; value: string }
  // Turn state
  | { fact: "turn.controller"; operator: "EQUALS"; value: "SELF" | "OPPONENT" }
```

### Operators

| Operator | Meaning |
|----------|---------|
| `EQUALS` | strict equality |
| `NOT_EQUALS` | strict inequality |
| `LTE` | less than or equal |
| `GTE` | greater than or equal |
| `CONTAINS` | array/string contains |

### `target.*` vs `self.*`

- `target.*` — properties of the card being targeted by an effect
- `self.*` — properties of the controller's own board/state (life count, leader, etc.)
- `event.target.*` — context of the event that triggered this rule (e.g. what card was attacked)

---

## Effect

```ts
interface Effect {
  type: EffectType;
  target?: Target;
  amount?: number;          // draw N, add N power, etc.
  keyword?: Keyword;        // for GRANT_KEYWORD
  condition?: Condition;    // additional guard on this specific effect
  zones?: Zone[];           // source zone (e.g. ADD_TO_HAND from LIFE or TRASH)
  replacementEffect?: boolean; // replaces the triggering event (e.g. PREVENT_KO)
  banish?: boolean;         // DEAL_DAMAGE: send life cards to trash, suppress Trigger
  then?: Effect[];          // chained effects — resolve in sequence after this one
  optional?: boolean;       // "up to" / "you may"
  duration?: Duration;      // INSTANT | END_OF_TURN | PERMANENT
  grantedRules?: Rule[];    // for GRANT_EFFECT
  branches?: Effect[][];    // for CHOOSE_ONE — player picks exactly one branch
}
```

### Effect types

| Type | Description |
|------|-------------|
| `DRAW` | Draw `amount` cards |
| `KO` | Move target card to trash |
| `PREVENT_KO` | Replacement effect — card survives |
| `ADD_POWER` | Add `amount` to target's power (negative = reduce) |
| `REST` | Rest the target card |
| `SET_ACTIVE` | Unrest the target card |
| `ATTACH_DON` | Add `amount` DON!! from `zones` to target |
| `DEAL_DAMAGE` | Deal `amount` damage to opponent's leader |
| `TRASH_CARD` | Trash `amount` cards from target's hand/board |
| `PLAY_FROM_HAND` | Play a card matching `target.filter` from hand for free |
| `RETURN_TO_HAND` | Return target card to hand |
| `ADD_TO_HAND` | Take the top card from `zones` and add to hand |
| `LOOK_AT_TOP_DECK` | Look at the top `amount` cards |
| `SEARCH_DECK` | Search deck for a card matching filter |
| `MILL` | Put top `amount` cards of deck to trash |
| `SHUFFLE_DECK` | Shuffle the deck |
| `REVEAL` | Reveal a card from the top `amount` |
| `RESTRICT_PLAY` | Prevent target from being played |
| `RESTRICT_ATTACK` | Prevent target from attacking |
| `RESTRICT_BLOCK` | Prevent blockers with power ≤ `amount` from blocking |
| `RESTRICT_COUNTER` | Prevent use of counter cards |
| `GRANT_KEYWORD` | Give `keyword` to target for `duration` |
| `GRANT_EFFECT` | Give `grantedRules` to target for `duration` |
| `CHOOSE_ONE` | Player chooses one `branches` array to resolve |
| `ADD_TO_LIFE` | Add a card to the bottom of life |
| `KO_STAGE` | KO the opponent's active Stage |

### Target

```ts
interface Target {
  scope: TargetScope;       // who/what can be targeted
  filter?: Condition[];     // all conditions must pass — AND semantics
  maxTargets?: number;      // "up to N" targets
}
```

### Target scopes

| Scope | Who is targeted |
|-------|----------------|
| `SELF` | The card's controller (or the card itself for self-referential effects) |
| `OPPONENT` | The opponent |
| `EVENT_TARGET` | The card that triggered this rule |
| `SINGLE_FRIENDLY_CHARACTER` | One character you control |
| `ALL_FRIENDLY_CHARACTERS` | All characters you control |
| `SINGLE_ENEMY_CHARACTER` | One character the opponent controls |
| `ALL_ENEMY_CHARACTERS` | All characters the opponent controls |
| `ALL_ENEMY_RESTED_CHARACTERS` | All rested characters the opponent controls |
| `SELF_LEADER` | Your leader |
| `OPPONENT_LEADER` | The opponent's leader |
| `FRIENDLY_LEADER_OR_CHARACTER` | Any card you control |
| `ENEMY_LEADER_OR_CHARACTER` | Any card the opponent controls |
| `ATTACKING_CARD` | The card currently declaring an attack |
| `ANY_CHARACTER` | Any character on either side |

### Effect chaining with `then`

`then` resolves effects in sequence. Each step can itself have a `then`, forming an arbitrarily deep chain:

```ts
// Draw 1, then trash 1, then optionally trash up to 3
{
  type: "DRAW",
  amount: 1,
  then: [{
    type: "TRASH_CARD",
    amount: 1,
    then: [{
      type: "TRASH_CARD",
      amount: 3,
      optional: true,
    }],
  }],
}
```

### CHOOSE_ONE branching

```ts
// • Return 1 character to hand  OR  • Play 1 character costing ≤ 5 for free
{
  type: "CHOOSE_ONE",
  branches: [
    [{ type: "RETURN_TO_HAND", target: { scope: "SINGLE_ENEMY_CHARACTER" } }],
    [{ type: "PLAY_FROM_HAND",  target: { scope: "SINGLE_FRIENDLY_CHARACTER", filter: [{ fact: "target.cost", operator: "LTE", value: 5 }] } }],
  ],
}
```

---

## Cost

Costs are paid before an ACTIVATED rule's effects resolve.

```ts
interface Cost {
  type: CostType;
  target?: Target;
  amount?: number;
}
```

| CostType | Description |
|----------|-------------|
| `REST` | Rest this card |
| `TRASH_CARD` | Trash `amount` cards from hand |
| `RETURN_DON` | Return `amount` DON!! to the deck |
| `DISCARD` | Discard `amount` cards matching `target.filter` |
| `PAY` | Pay `amount` DON!! |

### Example — conditional DISCARD cost

```ts
// "You may trash 1 FILM-type card from your hand:"
{
  type: "DISCARD",
  amount: 1,
  target: {
    scope: "SELF",
    filter: [{ fact: "target.faction", operator: "CONTAINS", value: "FILM" }],
  },
}
```

---

## Keywords

Keywords are declared in `Card.keywords` and drive engine behavior directly — no rules needed.

| Keyword | Effect |
|---------|--------|
| `BLOCKER` | Can intercept attacks targeting other cards |
| `RUSH` | Can attack the turn it is played |
| `DOUBLE_ATTACK` | Deals 2 damage when attacking the leader |
| `BANISH` | Life cards from damage go to trash (Trigger suppressed) |
| `UNBLOCKABLE` | Cannot be blocked |
| `TRIGGER` | Life card activates an effect when revealed from damage |
| `COUNTER` | Card can be discarded during counter step to add its counter value |

---

## Full card example — EB03-001 Nefeltari Vivi

This card demonstrates replacement effects, conditional triggers, cost filtering, and keyword granting.

```ts
export const EB03_001: Card = {
  id: "eb03-001",
  code: "EB03-001",
  name: "Nefeltari Vivi",
  type: "LEADER",
  color: ["Blue", "Red"],
  factions: ["Alabasta"],
  power: 5000,
  life: 4,
  keywords: [],
  rules: [
    {
      // [When one of your Characters with a cost of 4 or more would be KO'd]
      // [Once Per Turn] You may trash 1 card from your hand: It is not KO'd.
      id: "vivi-protect",
      type: "TRIGGERED",
      timing: "ON_KO",
      oncePerTurn: true,
      optional: true,
      priority: 100,
      conditions: [
        { fact: "event.target.controller", operator: "EQUALS", value: "SELF" },
        { fact: "event.target.baseCost",   operator: "GTE",    value: 4 },
      ],
      cost: [{ type: "TRASH_CARD", amount: 1 }],
      effects: [{
        type: "PREVENT_KO",
        target: { scope: "EVENT_TARGET" },
        replacementEffect: true,
      }],
    },
    {
      // [Activate:Main] (Rest this Leader): Give up to 1 of your opponent's Characters
      // +2000 power during this turn. Then, up to 1 of your Characters without
      // [When Attacking] gains [Rush] during this turn.
      id: "vivi-main",
      type: "ACTIVATED",
      timing: "ACTIVATE_MAIN",
      cost: [{ type: "REST" }],
      effects: [{
        type: "ADD_POWER",
        target: { scope: "SINGLE_ENEMY_CHARACTER", maxTargets: 1 },
        amount: 2000,
        duration: "END_OF_TURN",
        optional: true,
        then: [{
          type: "GRANT_KEYWORD",
          keyword: "RUSH",
          duration: "END_OF_TURN",
          optional: true,
          target: {
            scope: "SINGLE_FRIENDLY_CHARACTER",
            maxTargets: 1,
            filter: [{ fact: "target.hasRule", operator: "NOT_EQUALS", value: "WHEN_ATTACKING" }],
          },
        }],
      }],
    },
  ],
};
```
