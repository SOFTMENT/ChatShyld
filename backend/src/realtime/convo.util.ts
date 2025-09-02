/** Deterministic 1:1 conversation id */
export const convoIdFor = (a: string, b: string) => [a, b].sort().join("#");
