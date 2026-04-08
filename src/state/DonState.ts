export interface DonState {
  readonly deck: number;   // remaining in DON!! deck (starts at 10)
  readonly active: number; // available to pay costs this turn
  readonly rested: number; // paid for costs; returns to active at Refresh
  // DON!! attached to characters lives on CardInstance.donAttached, not here
}
