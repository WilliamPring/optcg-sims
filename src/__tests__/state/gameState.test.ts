import { describe, it, expect } from "vitest";
import { createGameState } from "../../state/index.js";
import { EB03_001 } from "../../cards/EB03.js"; // leader with life: 4
import { OP01_001 } from "../../cards/OP01.js"; // leader with life: 5
import type { Card } from "../../types/index.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Minimal 50-card CHARACTER deck — just needs to be valid Card objects. */
function makeDeck(size = 50): Card[] {
  return Array.from({ length: size }, (_, i) => ({
    id: `test-${i}`,
    code: `TEST-${String(i).padStart(3, "0")}`,
    name: `Test Card ${i}`,
    type: "CHARACTER" as const,
    color: ["Red"] as const,
    factions: [] as string[],
    keywords: [] as never[],
    cost: 2,
    power: 3000,
    counter: 1000,
  }));
}

const p1Deck = makeDeck();
const p2Deck = makeDeck();

// P1 = Vivi (life: 4), P2 = Zoro (life: 5)
const state = createGameState(EB03_001, p1Deck, OP01_001, p2Deck);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("createGameState — life cards", () => {
  it("Vivi (card.life = 4) gets 4 life cards", () => {
    expect(state.players[0].life).toHaveLength(4);
  });

  it("Zoro (card.life = 5) gets 5 life cards", () => {
    expect(state.players[1].life).toHaveLength(5);
  });

  it("life cards are face-down", () => {
    const allFaceDown = state.players[0].life.every(c => !c.faceUp);
    expect(allFaceDown).toBe(true);
  });

  it("life cards have zone LIFE", () => {
    const allLife = state.players[0].life.every(c => c.zone === "LIFE");
    expect(allLife).toBe(true);
  });
});

describe("createGameState — hand and deck", () => {
  it("each player starts with 5 cards in hand", () => {
    expect(state.players[0].hand).toHaveLength(5);
    expect(state.players[1].hand).toHaveLength(5);
  });

  it("50-card deck minus life and hand leaves 40 remaining", () => {
    // P1: 50 - 4 life - 5 hand = 41; P2: 50 - 5 life - 5 hand = 40
    expect(state.players[0].deck).toHaveLength(41);
    expect(state.players[1].deck).toHaveLength(40);
  });

  it("hand cards have zone HAND", () => {
    const allHand = state.players[0].hand.every(c => c.zone === "HAND");
    expect(allHand).toBe(true);
  });

  it("deck cards have zone DECK", () => {
    const allDeck = state.players[0].deck.every(c => c.zone === "DECK");
    expect(allDeck).toBe(true);
  });
});

describe("createGameState — DON!!", () => {
  it("DON!! deck starts at 10", () => {
    expect(state.players[0].don.deck).toBe(10);
    expect(state.players[1].don.deck).toBe(10);
  });

  it("no DON!! active or rested at start", () => {
    expect(state.players[0].don.active).toBe(0);
    expect(state.players[0].don.rested).toBe(0);
  });
});

describe("createGameState — leaders and board", () => {
  it("leader has zone BOARD and is not rested", () => {
    expect(state.players[0].leader.zone).toBe("BOARD");
    expect(state.players[0].leader.rested).toBe(false);
  });

  it("leader card reference matches input", () => {
    expect(state.players[0].leader.card.id).toBe(EB03_001.id);
    expect(state.players[1].leader.card.id).toBe(OP01_001.id);
  });

  it("no characters on board at start", () => {
    expect(state.players[0].characters).toHaveLength(0);
    expect(state.players[1].characters).toHaveLength(0);
  });

  it("no stage at start", () => {
    expect(state.players[0].stage).toBeNull();
    expect(state.players[1].stage).toBeNull();
  });

  it("trash is empty at start", () => {
    expect(state.players[0].trash).toHaveLength(0);
    expect(state.players[1].trash).toHaveLength(0);
  });
});

describe("createGameState — instance IDs", () => {
  it("every CardInstance has a unique instanceId", () => {
    const ids: string[] = [];
    for (const player of state.players) {
      ids.push(player.leader.instanceId);
      ids.push(...player.hand.map(c => c.instanceId));
      ids.push(...player.deck.map(c => c.instanceId));
      ids.push(...player.life.map(c => c.instanceId));
    }
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("createGameState — initial game state", () => {
  it("P1 goes first", () => {
    expect(state.turn.activePlayer).toBe("P1");
  });

  it("starts in REFRESH phase", () => {
    expect(state.turn.phase).toBe("REFRESH");
  });

  it("turn 1, first player flag set", () => {
    expect(state.turn.turnNumber).toBe(1);
    expect(state.turn.isFirstPlayerFirstTurn).toBe(true);
  });

  it("combat is null at start", () => {
    expect(state.combat).toBeNull();
  });

  it("winner is null at start", () => {
    expect(state.winner).toBeNull();
  });

  it("effect stack is empty", () => {
    expect(state.effectStack.pending).toHaveLength(0);
  });

  it("log is empty", () => {
    expect(state.log).toHaveLength(0);
  });
});
