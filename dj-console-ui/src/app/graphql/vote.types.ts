export interface VoteChoice {
  slot: number;
  label: string;
  votes: number;
}

export interface VoteTally {
  sessionId: string;
  choices: VoteChoice[];
  totalVotes: number;
}
