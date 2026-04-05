import { describe, it, expect } from "vitest";
import { OP01_001, OP01_002, OP01_016, OP01_074, OP01_120, OP01_121 } from "../../cards/OP01.js";
import { OP07_117 } from "../../cards/OP07.js";
import { EB03_001 } from "../../cards/EB03.js";
import { OP10_045 } from "../../cards/OP10.js";

// ---------------------------------------------------------------------------
// OP01-001 Roronoa Zoro (Leader)
// ---------------------------------------------------------------------------
describe("OP01-001 Roronoa Zoro (Leader)", () => {
  it("CONTINUOUS rule requires 1 attached DON!!", () => {
    const rule = OP01_001.rules?.[0];
    expect(rule?.type).toBe("CONTINUOUS");
    expect(rule?.donRequirement).toBe(1);
  });

  it("CONTINUOUS fires only on your own turn", () => {
    const cond = OP01_001.rules?.[0]?.conditions?.[0];
    expect(cond?.fact).toBe("turn.controller");
    expect(cond?.operator).toBe("EQUALS");
    expect(cond?.value).toBe("SELF");
  });

  it("CONTINUOUS adds +1000 to all friendly characters", () => {
    const effect = OP01_001.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("ADD_POWER");
    expect(effect?.target?.scope).toBe("ALL_FRIENDLY_CHARACTERS");
    expect(effect?.amount).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// OP01-002 Trafalgar Law (Leader)
// ---------------------------------------------------------------------------
describe("OP01-002 Trafalgar Law (Leader)", () => {
  it("has an ACTIVATED ACTIVATE_MAIN rule, once per turn, costing 2 RETURN_DON", () => {
    const rule = OP01_002.rules?.[0];
    expect(rule?.type).toBe("ACTIVATED");
    expect(rule?.timing).toBe("ACTIVATE_MAIN");
    expect(rule?.oncePerTurn).toBe(true);
    expect(rule?.cost?.[0]?.type).toBe("RETURN_DON");
    expect(rule?.cost?.[0]?.amount).toBe(2);
  });

  it("requires 5+ characters on board to activate", () => {
    const cond = OP01_002.rules?.[0]?.conditions?.[0];
    expect(cond?.fact).toBe("self.characterCount");
    expect(cond?.operator).toBe("GTE");
    expect(cond?.value).toBe(5);
  });

  it("RETURN_TO_HAND a friendly character then PLAY_FROM_HAND cost ≤ 5", () => {
    const effect = OP01_002.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("RETURN_TO_HAND");
    expect(effect?.target?.scope).toBe("SINGLE_FRIENDLY_CHARACTER");

    const thenEffect = effect?.then?.[0];
    expect(thenEffect?.type).toBe("PLAY_FROM_HAND");
    const costFilter = thenEffect?.target?.filter?.find(f => f.fact === "target.cost");
    expect(costFilter?.operator).toBe("LTE");
    expect(costFilter?.value).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// OP01-016 Nami
// ---------------------------------------------------------------------------
describe("OP01-016 Nami", () => {
  it("has an ON_PLAY triggered rule that looks at top 5", () => {
    const rule = OP01_016.rules?.[0];
    expect(rule?.type).toBe("TRIGGERED");
    expect(rule?.timing).toBe("ON_PLAY");
    const effect = rule?.effects[0];
    expect(effect?.type).toBe("LOOK_AT_TOP_DECK");
    expect(effect?.amount).toBe(5);
  });

  it("optionally reveals 1 Straw Hat Crew Character that is not named Nami", () => {
    const revealEffect = OP01_016.rules?.[0]?.effects[0]?.then?.[0];
    expect(revealEffect?.type).toBe("REVEAL");
    expect(revealEffect?.optional).toBe(true);
    expect(revealEffect?.target?.maxTargets).toBe(1);
    const filter = revealEffect?.target?.filter ?? [];
    expect(filter.some(c => c.fact === "target.faction" && c.value === "Straw Hat Crew")).toBe(true);
    const nameFilter = filter.find(c => c.fact === "target.name");
    expect(nameFilter?.operator).toBe("NOT_EQUALS");
    expect(nameFilter?.value).toBe("Nami");
  });
});

// ---------------------------------------------------------------------------
// OP01-074 Bartholomew Kuma
// ---------------------------------------------------------------------------
describe("OP01-074 Bartholomew Kuma", () => {
  it("has an ON_KO triggered rule", () => {
    const rule = OP01_074.rules?.[0];
    expect(rule?.type).toBe("TRIGGERED");
    expect(rule?.timing).toBe("ON_KO");
  });

  it("ON_KO optionally plays a Pacifista costing ≤ 4 from hand", () => {
    const effect = OP01_074.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("PLAY_FROM_HAND");
    expect(effect?.optional).toBe(true);
    const nameFilter = effect?.target?.filter?.find(f => f.fact === "target.name");
    const costFilter = effect?.target?.filter?.find(f => f.fact === "target.cost");
    expect(nameFilter?.value).toBe("Pacifista");
    expect(costFilter?.operator).toBe("LTE");
    expect(costFilter?.value).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// OP01-120 Shanks
// ---------------------------------------------------------------------------
describe("OP01-120 Shanks", () => {
  it("WHEN_ATTACKING restricts blockers with power ≤ 2000", () => {
    const rule = OP01_120.rules?.[0];
    expect(rule?.type).toBe("TRIGGERED");
    expect(rule?.timing).toBe("WHEN_ATTACKING");
    const effect = rule?.effects[0];
    expect(effect?.type).toBe("RESTRICT_BLOCK");
    expect(effect?.amount).toBe(2000);
  });
});

// ---------------------------------------------------------------------------
// OP01-121 Yamato
// ---------------------------------------------------------------------------
describe("OP01-121 Yamato", () => {
  it("has alternate name Kouzuki Oden", () => {
    expect(OP01_121.alternateNames).toContain("Kouzuki Oden");
  });

  it("is a keywords-only card with no rules", () => {
    expect(OP01_121.rules).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// OP07-117 Egghead (Stage)
// ---------------------------------------------------------------------------
describe("OP07-117 Egghead (Stage)", () => {
  it("END_OF_YOUR_TURN rule fires only when life ≤ 3", () => {
    const rule = OP07_117.rules?.[0];
    expect(rule?.timing).toBe("END_OF_YOUR_TURN");
    const cond = rule?.conditions?.[0];
    expect(cond?.fact).toBe("self.lifeCount");
    expect(cond?.operator).toBe("LTE");
    expect(cond?.value).toBe(3);
  });

  it("END_OF_YOUR_TURN optionally unrests an Egghead character costing ≤ 5", () => {
    const effect = OP07_117.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("SET_ACTIVE");
    expect(effect?.optional).toBe(true);
    const filter = effect?.target?.filter ?? [];
    expect(filter.some(c => c.fact === "target.faction" && c.value === "Egghead")).toBe(true);
    expect(filter.some(c => c.fact === "target.cost" && c.operator === "LTE" && c.value === 5)).toBe(true);
  });

  it("TRIGGER rule plays this card from life", () => {
    const rule = OP07_117.rules?.[1];
    expect(rule?.timing).toBe("TRIGGER");
    expect(rule?.effects[0]?.type).toBe("PLAY_FROM_HAND");
  });
});

// ---------------------------------------------------------------------------
// EB03-001 Nefeltari Vivi (Leader)
// ---------------------------------------------------------------------------
describe("EB03-001 Nefeltari Vivi (Leader)", () => {
  it("vivi-protect: ON_KO replacement, once per turn, optional, priority 100", () => {
    const rule = EB03_001.rules?.[0];
    expect(rule?.id).toBe("vivi-protect");
    expect(rule?.timing).toBe("ON_KO");
    expect(rule?.oncePerTurn).toBe(true);
    expect(rule?.optional).toBe(true);
    expect(rule?.priority).toBe(100);
  });

  it("vivi-protect triggers when controller attacks with a card costing ≥ 4", () => {
    const conditions = EB03_001.rules?.[0]?.conditions ?? [];
    const ctrlCond = conditions.find(c => c.fact === "event.target.controller");
    const costCond = conditions.find(c => c.fact === "event.target.baseCost");
    expect(ctrlCond?.value).toBe("SELF");
    expect(costCond?.operator).toBe("GTE");
    expect(costCond?.value).toBe(4);
  });

  it("vivi-protect costs TRASH_CARD 1 and replaces the KO", () => {
    const cost = EB03_001.rules?.[0]?.cost?.[0];
    expect(cost?.type).toBe("TRASH_CARD");
    expect(cost?.amount).toBe(1);
    const effect = EB03_001.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("PREVENT_KO");
    expect(effect?.target?.scope).toBe("EVENT_TARGET");
    expect(effect?.replacementEffect).toBe(true);
  });

  it("vivi-main: ACTIVATED REST cost, gives +2000 (not -2000) to enemy character", () => {
    const rule = EB03_001.rules?.[1];
    expect(rule?.type).toBe("ACTIVATED");
    expect(rule?.timing).toBe("ACTIVATE_MAIN");
    expect(rule?.cost?.[0]?.type).toBe("REST");
    const effect = rule?.effects[0];
    expect(effect?.type).toBe("ADD_POWER");
    expect(effect?.target?.scope).toBe("SINGLE_ENEMY_CHARACTER");
    expect(effect?.amount).toBe(2000); // buff opponent's character, per card text
    expect(effect?.duration).toBe("END_OF_TURN");
    expect(effect?.optional).toBe(true);
  });

  it("vivi-main chains GRANT_KEYWORD RUSH to character without WHEN_ATTACKING", () => {
    const grantEffect = EB03_001.rules?.[1]?.effects[0]?.then?.[0];
    expect(grantEffect?.type).toBe("GRANT_KEYWORD");
    expect(grantEffect?.keyword).toBe("RUSH");
    expect(grantEffect?.duration).toBe("END_OF_TURN");
    expect(grantEffect?.optional).toBe(true);
    const filter = grantEffect?.target?.filter?.[0];
    expect(filter?.fact).toBe("target.hasRule");
    expect(filter?.operator).toBe("NOT_EQUALS");
    expect(filter?.value).toBe("WHEN_ATTACKING");
  });
});

// ---------------------------------------------------------------------------
// OP10-045 Cavendish
// ---------------------------------------------------------------------------
describe("OP10-045 Cavendish", () => {
  it("has a WHEN_ATTACKING once-per-turn rule", () => {
    const rule = OP10_045.rules?.[0];
    expect(rule?.timing).toBe("WHEN_ATTACKING");
    expect(rule?.oncePerTurn).toBe(true);
  });

  it("draws 2 then trashes 1 from hand", () => {
    const draw = OP10_045.rules?.[0]?.effects[0];
    expect(draw?.type).toBe("DRAW");
    expect(draw?.amount).toBe(2);
    const trash = draw?.then?.[0];
    expect(trash?.type).toBe("TRASH_CARD");
    expect(trash?.amount).toBe(1);
    expect(trash?.target?.scope).toBe("SELF");
  });
});
