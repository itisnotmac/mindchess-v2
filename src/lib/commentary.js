/**
 * Offline canned commentary engine.
 * Reads the last SAN move + board state and returns a coaching tip.
 * No network calls — fully offline.
 */

// Pick a random item from an array
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Classify a SAN move string
function classifyMove(san) {
  if (!san) return 'generic';
  if (san.includes('#')) return 'checkmate';
  if (san.includes('+')) return 'check';
  if (san.startsWith('O-O-O')) return 'queenside-castle';
  if (san.startsWith('O-O')) return 'kingside-castle';
  if (san.includes('=')) return 'promotion';
  if (san.includes('x')) return 'capture';
  return 'quiet';
}

const TIPS = {
  checkmate: [
    "Checkmate! That's the game — well executed.",
    "Checkmate. The king had nowhere left to run.",
    "That's mate. Spotting that combination takes real pattern recognition.",
  ],
  check: [
    "Check! Keep the pressure on and look for follow-up threats.",
    "Check — now watch how the king responds, it may open new lines.",
    "Putting the king in check forces your opponent's hand. Use it wisely.",
    "Check forces a response. Look two moves ahead from here.",
  ],
  'queenside-castle': [
    "Queenside castling — your king is tucked away and your rook is centralized.",
    "O-O-O activates the a-rook and often signals an aggressive kingside attack.",
    "Long castling can be powerful but keep an eye on that exposed king.",
  ],
  'kingside-castle': [
    "King safety first. Castling kingside is usually the solid choice.",
    "Good — your king is safer behind those pawns now.",
    "Castled. Now think about connecting your rooks.",
  ],
  promotion: [
    "Promotion! Queening a pawn is often the decisive moment in an endgame.",
    "Pawn to queen — the ultimate reward for pushing that passer home.",
    "Promotion changes the balance completely. Use that queen actively.",
  ],
  capture: [
    "Material grabbed — make sure the recapture doesn't cost you something bigger.",
    "After a capture, ask yourself what your opponent can hit back.",
    "Exchanges can simplify the position. Are you trading into a better endgame?",
    "Recalculate after every capture. The position just shifted.",
    "Good trade — or was it? Check if you left any pieces hanging.",
  ],
  quiet: [
    "Solid move. Think about what your opponent's best response might be.",
    "Every pawn move is permanent — no take-backs on those.",
    "Look for ways to improve your worst-placed piece.",
    "Control the center and keep your pieces coordinated.",
    "Think about piece activity. Which of your pieces is doing the least work?",
    "Before you move, ask: does this create a threat?",
    "Patience. Good positions are built move by move.",
    "Rooks belong on open files. Any available?",
  ],
  opening: [
    "In the opening: develop pieces, control the center, castle early.",
    "Get your knights and bishops out before you start attacking.",
    "Try not to move the same piece twice in the opening unless you must.",
    "Central pawns give your pieces more space to operate.",
    "Develop with purpose — each move should improve your position.",
  ],
  middlegame: [
    "Look for undefended pieces — yours and your opponent's.",
    "Create threats that force your opponent to react rather than plan.",
    "Doubled pawns can be a weakness. Keep your pawn structure healthy.",
    "Knights are strong in closed positions, bishops shine in open ones.",
    "Look for tactics: forks, pins, skewers, discovered attacks.",
  ],
  endgame: [
    "Endgame rule #1: activate your king. It's a powerful piece now.",
    "King and pawn endgames are won by king activity — advance it.",
    "Passed pawns must be pushed. Give them an escort.",
    "In the endgame, every tempo counts. Don't waste moves.",
    "Rook endgames are tricky. Keep your rook active, not passive.",
  ],
  generic: [
    "Stay focused. Chess is won by making fewer mistakes than your opponent.",
    "Think before you move. What is your opponent threatening?",
    "Good chess is about understanding, not memorization.",
    "Every move should have a purpose.",
  ],
};

/**
 * Returns a canned commentary string for the given move and game state.
 *
 * @param {string} san         - SAN of the move just played (e.g. "Nf3", "exd5+")
 * @param {number} moveCount   - Total half-moves played so far (moves.length)
 * @param {boolean} isInCheck  - Is the side to move currently in check?
 * @returns {string}
 */
export function getCommentary(san, moveCount, isInCheck) {
  const type = classifyMove(san);

  // Specific move-type tips take priority
  if (type !== 'quiet' && type !== 'generic') {
    return pick(TIPS[type]);
  }

  // Phase-based tips for quiet moves
  if (moveCount <= 10) {
    // Opening phase — mix opening tips with quiet-move tips
    return pick([...TIPS.opening, ...TIPS.quiet]);
  }
  if (moveCount >= 50) {
    return pick([...TIPS.endgame, ...TIPS.quiet]);
  }

  return pick([...TIPS.middlegame, ...TIPS.quiet]);
}
