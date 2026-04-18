import { gql } from 'apollo-angular';

/** One-shot read: current session graph (Query root field). */
export const CURRENT_MIX_SESSION = gql`
  query CurrentMixSession {
    currentMixSession {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

/** Write: domain event → new aggregate state (Mutation root field). */
export const CROWD_CHEERED = gql`
  mutation CrowdCheered($id: ID!) {
    crowdCheered(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const CROWD_ENERGY_DROPPED = gql`
  mutation CrowdEnergyDropped($id: ID!) {
    crowdEnergyDropped(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const DANCEFLOOR_EMPTIED = gql`
  mutation DancefloorEmptied($id: ID!) {
    dancefloorEmptied(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const DANCEFLOOR_FILLED_UP = gql`
  mutation DancefloorFilledUp($id: ID!) {
    dancefloorFilledUp(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const REQUEST_FROM_AUDIENCE = gql`
  mutation RequestFromAudience($id: ID!, $trackName: String!) {
    requestFromAudience(id: $id, trackName: $trackName) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const APPLY_RECOVERY = gql`
  mutation ApplyRecovery($id: ID!) {
    applyRecovery(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

/**
 * Long-lived stream over WebSocket (Subscription root field).
 * Server sends current snapshot first, then each persisted update.
 */
export const MIX_SESSION_UPDATED = gql`
  subscription MixSessionUpdated($id: ID!) {
    mixSessionUpdated(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const VOTE_TALLY = gql`
  query VoteTally($id: ID!) {
    voteTally(id: $id) {
      sessionId
      totalVotes
      choices {
        slot
        label
        votes
      }
    }
  }
`;

export const CAST_CROWD_VOTE = gql`
  mutation CastCrowdVote($id: ID!, $slot: Int!) {
    castCrowdVote(id: $id, slot: $slot) {
      sessionId
      totalVotes
      choices {
        slot
        label
        votes
      }
    }
  }
`;

export const RESET_CROWD_VOTE = gql`
  mutation ResetCrowdVote($id: ID!) {
    resetCrowdVote(id: $id) {
      sessionId
      totalVotes
      choices {
        slot
        label
        votes
      }
    }
  }
`;

export const APPLY_CROWD_VOTE_WINNER = gql`
  mutation ApplyCrowdVoteWinner($id: ID!) {
    applyCrowdVoteWinner(id: $id) {
      id
      status
      tracks {
        id
        energyLevel
        song {
          title
          audioFile
          artist {
            name
          }
        }
      }
    }
  }
`;

export const CROWD_VOTE_TALLY_UPDATED = gql`
  subscription CrowdVoteTallyUpdated($id: ID!) {
    crowdVoteTallyUpdated(id: $id) {
      sessionId
      totalVotes
      choices {
        slot
        label
        votes
      }
    }
  }
`;
