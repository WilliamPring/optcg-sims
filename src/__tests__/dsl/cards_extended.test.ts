import { describe, it, expect } from "vitest";
import { OP01_028, OP01_079, OP01_089 } from "../../cards/OP01.js";
import { OP02_001, OP02_070 } from "../../cards/OP02.js";
import { OP04_001 } from "../../cards/OP04.js";
import { OP06_001 } from "../../cards/OP06.js";

// ---------------------------------------------------------------------------
// OP01-028 — Green Star Rafflesia (Event)
// ---------------------------------------------------------------------------
describe("OP01-028 Green Star Rafflesia (Event)", () => {
  it("has exactly 2 rules: COUNTER_STEP and TRIGGER", () => {
    expect(OP01_028.rules).toHaveLength(2);
    expect(OP01_028.rules?.[0]?.timing).toBe("COUNTER_STEP");
    expect(OP01_028.rules?.[1]?.timing).toBe("TRIGGER");
  });

  it("COUNTER_STEP gives -2000 to an enemy leader or character (optional, 1 target)", () => {
    const effect = OP01_028.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("ADD_POWER");
    expect(effect?.target?.scope).toBe("ENEMY_LEADER_OR_CHARACTER");
    expect(effect?.amount).toBe(-2000);
    expect(effect?.duration).toBe("END_OF_TURN");
    expect(effect?.optional).toBe(true);
    expect(effect?.target?.maxTargets).toBe(1);
  });

  it("TRIGGER applies the same ADD_POWER effect", () => {
    const effect = OP01_028.rules?.[1]?.effects[0];
    expect(effect?.type).toBe("ADD_POWER");
    expect(effect?.amount).toBe(-2000);
    expect(effect?.target?.scope).toBe("ENEMY_LEADER_OR_CHARACTER");
  });
});

// ---------------------------------------------------------------------------
// OP01-079 — Ms. All Sunday
// ---------------------------------------------------------------------------
describe("OP01-079 Ms. All Sunday", () => {
  it("ON_KO is conditional on leader faction containing Baroque Works", () => {
    const rule = OP01_079.rules?.[0];
    expect(rule?.timing).toBe("ON_KO");
    const cond = rule?.conditions?.[0];
    expect(cond?.fact).toBe("self.leader.faction");
    expect(cond?.operator).toBe("CONTAINS");
    expect(cond?.value).toBe("Baroque Works");
  });

  it("ON_KO optionally adds 1 EVENT from TRASH to hand", () => {
    const effect = OP01_079.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("ADD_TO_HAND");
    expect(effect?.zones).toContain("TRASH");
    expect(effect?.optional).toBe(true);
    expect(effect?.target?.maxTargets).toBe(1);
    const filter = effect?.target?.filter?.[0];
    expect(filter?.fact).toBe("target.type");
    expect(filter?.value).toBe("EVENT");
  });
});

// ---------------------------------------------------------------------------
// OP01-089 — Crescent Cutlass (Event)
// ---------------------------------------------------------------------------
describe("OP01-089 Crescent Cutlass (Event)", () => {
  it("COUNTER_STEP is conditional on leader faction containing The Seven Warlords", () => {
    const rule = OP01_089.rules?.[0];
    expect(rule?.timing).toBe("COUNTER_STEP");
    const cond = rule?.conditions?.[0];
    expect(cond?.fact).toBe("self.leader.faction");
    expect(cond?.operator).toBe("CONTAINS");
    expect(cond?.value).toBe("The Seven Warlords of the Sea");
  });

  it("COUNTER_STEP optionally returns an enemy character costing ≤ 5 to hand", () => {
    const effect = OP01_089.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("RETURN_TO_HAND");
    expect(effect?.optional).toBe(true);
    expect(effect?.target?.scope).toBe("SINGLE_ENEMY_CHARACTER");
    const costFilter = effect?.target?.filter?.[0];
    expect(costFilter?.fact).toBe("target.cost");
    expect(costFilter?.operator).toBe("LTE");
    expect(costFilter?.value).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// OP02-001 — Edward Newgate (Leader)
// ---------------------------------------------------------------------------
describe("OP02-001 Edward Newgate (Leader)", () => {
  it("END_OF_YOUR_TURN triggered rule adds top life card to hand", () => {
    const rule = OP02_001.rules?.[0];
    expect(rule?.type).toBe("TRIGGERED");
    expect(rule?.timing).toBe("END_OF_YOUR_TURN");
    const effect = rule?.effects[0];
    expect(effect?.type).toBe("ADD_TO_HAND");
    expect(effect?.zones).toContain("LIFE");
    expect(effect?.amount).toBe(1);
    expect(effect?.target?.scope).toBe("SELF");
  });
});

// ---------------------------------------------------------------------------
// OP02-070 — New Kama Land (Stage)
// ---------------------------------------------------------------------------
describe("OP02-070 New Kama Land (Stage)", () => {
  it("ACTIVATE_MAIN costs REST, is optional, and requires Emporio.Ivankov as leader", () => {
    const rule = OP02_070.rules?.[0];
    expect(rule?.type).toBe("ACTIVATED");
    expect(rule?.timing).toBe("ACTIVATE_MAIN");
    expect(rule?.optional).toBe(true);
    expect(rule?.cost?.[0]?.type).toBe("REST");
    const cond = rule?.conditions?.[0];
    expect(cond?.fact).toBe("self.leader.name");
    expect(cond?.operator).toBe("EQUALS");
    expect(cond?.value).toBe("Emporio.Ivankov");
  });

  it("draws 1, then trashes 1, then optionally trashes up to 3", () => {
    const draw = OP02_070.rules?.[0]?.effects[0];
    expect(draw?.type).toBe("DRAW");
    expect(draw?.amount).toBe(1);

    const trash1 = draw?.then?.[0];
    expect(trash1?.type).toBe("TRASH_CARD");
    expect(trash1?.amount).toBe(1);

    const trash3 = trash1?.then?.[0];
    expect(trash3?.type).toBe("TRASH_CARD");
    expect(trash3?.amount).toBe(3);
    expect(trash3?.optional).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// OP04-001 — Nefeltari Vivi (Leader)
// ---------------------------------------------------------------------------
describe("OP04-001 Nefeltari Vivi (Leader)", () => {
  it("CONTINUOUS rule restricts this leader from attacking", () => {
    const rule = OP04_001.rules?.[0];
    expect(rule?.type).toBe("CONTINUOUS");
    const effect = rule?.effects[0];
    expect(effect?.type).toBe("RESTRICT_ATTACK");
    expect(effect?.target?.scope).toBe("SELF");
  });

  it("ACTIVATE_MAIN is once per turn and costs 2 RETURN_DON", () => {
    const rule = OP04_001.rules?.[1];
    expect(rule?.type).toBe("ACTIVATED");
    expect(rule?.timing).toBe("ACTIVATE_MAIN");
    expect(rule?.oncePerTurn).toBe(true);
    expect(rule?.cost?.[0]?.type).toBe("RETURN_DON");
    expect(rule?.cost?.[0]?.amount).toBe(2);
  });

  it("draws 1 then optionally grants RUSH to a friendly character until end of turn", () => {
    const draw = OP04_001.rules?.[1]?.effects[0];
    expect(draw?.type).toBe("DRAW");
    expect(draw?.amount).toBe(1);

    const grant = draw?.then?.[0];
    expect(grant?.type).toBe("GRANT_KEYWORD");
    expect(grant?.keyword).toBe("RUSH");
    expect(grant?.duration).toBe("END_OF_TURN");
    expect(grant?.optional).toBe(true);
    expect(grant?.target?.scope).toBe("SINGLE_FRIENDLY_CHARACTER");
  });
});

// ---------------------------------------------------------------------------
// OP06-001 — Uta (Leader)
// ---------------------------------------------------------------------------
describe("OP06-001 Uta (Leader)", () => {
  it("WHEN_ATTACKING is optional and costs discarding 1 FILM faction card", () => {
    const rule = OP06_001.rules?.[0];
    expect(rule?.timing).toBe("WHEN_ATTACKING");
    expect(rule?.optional).toBe(true);
    const cost = rule?.cost?.[0];
    expect(cost?.type).toBe("DISCARD");
    expect(cost?.amount).toBe(1);
    const filter = cost?.target?.filter?.[0];
    expect(filter?.fact).toBe("target.faction");
    expect(filter?.operator).toBe("CONTAINS");
    expect(filter?.value).toBe("FILM");
  });

  it("optionally gives -2000 to an enemy character this turn, then adds 1 rested DON!! from deck", () => {
    const effect = OP06_001.rules?.[0]?.effects[0];
    expect(effect?.type).toBe("ADD_POWER");
    expect(effect?.amount).toBe(-2000);
    expect(effect?.target?.scope).toBe("SINGLE_ENEMY_CHARACTER");
    expect(effect?.duration).toBe("END_OF_TURN");
    expect(effect?.optional).toBe(true);

    const attach = effect?.then?.[0];
    expect(attach?.type).toBe("ATTACH_DON");
    expect(attach?.amount).toBe(1);
    expect(attach?.zones).toContain("DECK");
    expect(attach?.optional).toBe(true);
  });
});
