import { Chess } from 'chess.js';

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PAWN_TABLE = [
  0,0,0,0,0,0,0,0,
  50,50,50,50,50,50,50,50,
  10,10,20,30,30,20,10,10,
  5,5,10,25,25,10,5,5,
  0,0,0,20,20,0,0,0,
  5,-5,-10,0,0,-10,-5,5,
  5,10,10,-20,-20,10,10,5,
  0,0,0,0,0,0,0,0
];
const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,0,0,0,0,-20,-40,
  -30,0,10,15,15,10,0,-30,
  -30,5,15,20,20,15,5,-30,
  -30,0,15,20,20,15,0,-30,
  -30,5,10,15,15,10,5,-30,
  -40,-20,0,5,5,0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];
const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,0,0,0,0,0,0,-10,
  -10,0,5,10,10,5,0,-10,
  -10,5,5,10,10,5,5,-10,
  -10,0,10,10,10,10,0,-10,
  -10,10,10,10,10,10,10,-10,
  -10,5,0,0,0,0,5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];
const ROOK_TABLE = [
  0,0,0,0,0,0,0,0,
  5,10,10,10,10,10,10,5,
  -5,0,0,0,0,0,0,-5,
  -5,0,0,0,0,0,0,-5,
  -5,0,0,0,0,0,0,-5,
  -5,0,0,0,0,0,0,-5,
  -5,0,0,0,0,0,0,-5,
  0,0,0,5,5,0,0,0
];
const QUEEN_TABLE = [
  -20,-10,-10,-5,-5,-10,-10,-20,
  -10,0,0,0,0,0,0,-10,
  -10,0,5,5,5,5,0,-10,
  -5,0,5,5,5,5,0,-5,
  0,0,5,5,5,5,0,-5,
  -10,5,5,5,5,5,0,-10,
  -10,0,5,0,0,0,0,-10,
  -20,-10,-10,-5,-5,-10,-10,-20
];
const KING_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20,20,0,0,0,0,20,20,
  20,30,10,0,0,10,30,20
];

const PIECE_TABLES = { p: PAWN_TABLE, n: KNIGHT_TABLE, b: BISHOP_TABLE, r: ROOK_TABLE, q: QUEEN_TABLE, k: KING_TABLE };

export function createGame(fen) {
  try {
    return fen ? new Chess(fen) : new Chess();
  } catch {
    return new Chess();
  }
}

export function getBoard(game) {
  return game.board();
}

export function getLegalMoves(game, square) {
  try {
    return game.moves({ square, verbose: true });
  } catch {
    return [];
  }
}

export function makeMove(game, from, to, promotion) {
  try {
    const move = game.move({ from, to, promotion: promotion || 'q' });
    return move;
  } catch {
    return null;
  }
}

export function makeSanMove(game, san) {
  try {
    return game.move(san);
  } catch {
    return null;
  }
}

export function undoMove(game) {
  return game.undo();
}

export function getFen(game) {
  return game.fen();
}

export function getTurn(game) {
  return game.turn();
}

export function isCheck(game) {
  return game.isCheck();
}

export function isCheckmate(game) {
  return game.isCheckmate();
}

export function isDraw(game) {
  return game.isDraw();
}

export function isStalemate(game) {
  return game.isStalemate();
}

export function isGameOver(game) {
  return game.isGameOver();
}

export function getHistory(game) {
  return game.history();
}

export function getStatus(game) {
  if (game.isCheckmate()) return 'checkmate';
  if (game.isStalemate()) return 'stalemate';
  if (game.isInsufficientMaterial()) return 'insufficient';
  if (game.isThreefoldRepetition()) return 'threefold';
  if (game.isDraw()) return 'draw';
  return 'playing';
}

export function getCheckSquare(game) {
  if (!game.isCheck()) return null;
  const board = game.board();
  const turn = game.turn();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === turn) {
        return piece.square;
      }
    }
  }
  return null;
}

function evaluateBoard(game) {
  if (game.isCheckmate()) return game.turn() === 'w' ? -100000 : 100000;
  if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) return 0;
  const board = game.board();
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] || 0;
      const table = PIECE_TABLES[piece.type];
      const idx = piece.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;
      const tableScore = table ? table[idx] : 0;
      score += piece.color === 'w' ? (value + tableScore) : -(value + tableScore);
    }
  }
  return score;
}

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }
  const moves = game.moves();
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// depth: how many plies the engine searches
// noise: random centipawn noise added to scores — higher = more "human" mistakes
const DIFFICULTY_CONFIG = {
  beginner:     { depth: 0, noise: 0    },  // pure random (handled separately)
  easy:         { depth: 1, noise: 300  },  // 1-ply + heavy noise → occasional blunders
  intermediate: { depth: 2, noise: 150  },  // 2-ply + moderate noise → solid but imperfect
  advanced:     { depth: 3, noise: 50   },  // 3-ply + light noise → strong, rare slip-ups
  master:       { depth: 4, noise: 0    },  // 4-ply, no noise → plays best move
};

export function getAIMove(game, difficulty) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Beginner: fully random, mild capture preference
  if (difficulty === 'beginner') {
    const captures = moves.filter(m => m.flags.includes('c') || m.flags.includes('e'));
    if (captures.length > 0 && Math.random() > 0.6) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const { depth, noise } = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.intermediate;
  const isMaximizing = game.turn() === 'w';
  let bestMove = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Shuffle to break ties randomly (avoids always picking first legal move)
  const shuffled = [...moves].sort(() => Math.random() - 0.5);

  for (const move of shuffled) {
    game.move(move);
    let score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    // Add random noise to simulate imperfect play at lower difficulties.
    // Noise is symmetric so the AI can both over- and under-estimate a move.
    if (noise > 0) {
      score += (Math.random() * 2 - 1) * noise;
    }

    if (isMaximizing) {
      if (score > bestScore) { bestScore = score; bestMove = move; }
    } else {
      if (score < bestScore) { bestScore = score; bestMove = move; }
    }
  }
  return bestMove || moves[0];
}

export function getAIMoveAsync(game, difficulty) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const gameCopy = createGame(getFen(game));
      resolve(getAIMove(gameCopy, difficulty));
    }, 50);
  });
}

export function getMoveQuality(game, move) {
  const before = evaluateBoard(game);
  game.move(move);
  const after = evaluateBoard(game);
  game.undo();
  const turn = game.turn();
  const delta = turn === 'w' ? after - before : before - after;
  if (delta > 300) return 'brilliant';
  if (delta > 100) return 'good';
  if (delta > 0) return 'ok';
  if (delta > -100) return 'inaccuracy';
  if (delta > -300) return 'mistake';
  return 'blunder';
}

export function evaluatePosition(game, depth) {
  if (game.isGameOver()) return evaluateBoard(game);
  return minimax(game, depth, -Infinity, Infinity, game.turn() === 'w');
}

export function getBestMove(game, depth) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  const isMax = game.turn() === 'w';
  let best = moves[0], bestScore = isMax ? -Infinity : Infinity;
  for (const m of moves) {
    game.move(m);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isMax);
    game.undo();
    if (isMax ? score > bestScore : score < bestScore) { bestScore = score; best = m; }
  }
  return { move: best, score: bestScore };
}

export function loadPgnGame(pgn) {
  try {
    const g = new Chess();
    g.loadPgn(pgn);
    return g.history().length > 0 ? g : null;
  } catch {
    return null;
  }
}

export const PIECE_UNICODE = {
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];