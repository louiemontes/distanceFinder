export interface Connection {
  user_id: number;
  friend_id: number;
}

export interface Distance extends Connection {
  distance: number;
}
