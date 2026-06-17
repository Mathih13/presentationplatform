export interface ServerAuthLabels {
  /** Client → Server: the request (`try*` verb). */
  clientRequest: string;
  /** Server → all clients: the authoritative response to the request. */
  serverBroadcast: string;
  /** Server → all clients: server-initiated event with no client trigger. */
  serverInitiated: string;
  /** Server → DB: persist state. */
  serverPersist: string;
  /** DB → Server: read state. */
  serverRead: string;
}

export const WOW_LABELS: ServerAuthLabels = {
  clientRequest: 'tryMove(x,y,z)',
  serverBroadcast: 'movePlayer(x,y,z)',
  serverInitiated: 'createMonster(Tiger)',
  serverPersist: 'updatePlayerPos(x,y,z)',
  serverRead: 'getMonsterTimer(Tiger)',
};

export const SLACK_LABELS: ServerAuthLabels = {
  clientRequest: 'trySendMessage(text)',
  serverBroadcast: 'messageReceived(msg)',
  serverInitiated: 'userJoined(user)',
  serverPersist: 'persistMessage(msg)',
  serverRead: 'getMembers(channel)',
};

export const FIGMA_LABELS: ServerAuthLabels = {
  clientRequest: 'tryMoveNode(x,y)',
  serverBroadcast: 'nodeUpdated(props)',
  serverInitiated: 'userCursor(x,y)',
  serverPersist: 'persistOp(op)',
  serverRead: 'getDocACL(doc)',
};
