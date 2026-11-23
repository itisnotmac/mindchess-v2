import { useRoomBackground } from '@/hooks/useRoomBackground';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { getCommentary } from '@/lib/commentary';
import ChessBoard from '@/components/chess/ChessBoard';
import { createGame, makeMove, getFen, getTurn, isCheckmate, isDraw, isStalemate, isCheck, isGameOver, getAIMoveAsync } from '@/lib/chessEngine';
import { playSound } from '@/lib/sound';
import { storage } from '@/lib/storage';
import { getLevelForXP, canAccess } from '@/lib/progression';
import LevelGate from '@/components/LevelGate';
import { isPremium } from '@/lib/premium';
import { Gamepad2, RotateCcw, ArrowLeft, Bot, Loader2, Lock, Trophy, Skull, Handshake, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DIFFICULTIES = [
  { value: 'beginner',      label: 'Yellow Belt',      rating: 800,  desc: 'Random moves',  premium: false },
  { value: 'easy',          label: 'Tough Guy',         rating: 1000, desc: '1-ply search',  premium: false },
  { value: 'intermediate',  label: 'Getting Serious',   rating: 1200, desc: '2-ply search',  premium: true  },
  { value: 'advanced',      label: 'Brick Top',         rating: 1500, desc: '3-ply search',  premium: true  },
  { value: 'master',        label: 'Final Boss',        rating: 1800, desc: '4-ply search',  premium: true  },
];

function calcElo(playerElo, aiElo, result) {
  const expected = 1 / (1 + Math.pow(10, (aiElo - playerElo) / 400));
  const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  return Math.round(playerElo + 32 * (score - expected));
}

export default function PlayVsAI() {
  useRoomBackground('room-game-hall');
  const [phase, setPhase] = useState('setup');
  const [difficulty, setDifficulty] = useState(isPremium() ? 'intermediate' : 'easy');
  const [playerColor, setPlayerColor] = useState('white');
  const [fen, setFen] = useState(createGame().fen());
  const [lastMove, setLastMove] = useState(null);
  const [moves, setMoves] = useState([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [commentary, setCommentary] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [eloChange, setEloChange] = useState(0);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const commentaryRef = useRef(null);

  const game = useMemo(() => createGame(fen), [fen]);
  const orientation = playerColor;
  const movableColor = playerColor === 'white' ? 'w' : 'b';

  useEffect(() => {
    setProfile(storage.getProfile());
  }, []);

  useEffect(() => {
    if (commentaryRef.current) {
      commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
    }
  }, [commentary]);

  const fetchCommentary = useCallback((currentFen, moveList, lastMoveSan) => {
    const text = getCommentary(lastMoveSan, moveList.length);
    setCommentary(prev => [...prev, { moveNum: moveList.length, text }]);
  }, []);

  const startGame = (diff, color) => {
    // Guard: block premium difficulties if not unlocked
    const chosen = DIFFICULTIES.find(d => d.value === diff);
    if (chosen?.premium && !isPremium()) {
      navigate('/upgrade');
      return;
    }
    setDifficulty(diff);
    setPlayerColor(color);
    const g = createGame();
    setFen(g.fen());
    setMoves([]);
    setLastMove(null);
    setCommentary([]);
    setGameResult(null);
    setPhase('playing');
    if (color === 'black') {
      setTimeout(() => makeAIMove(g.fen(), diff, []), 500);
    }
  };

  const makeAIMove = async (currentFen, diff, currentMoves) => {
    setIsAIThinking(true);
    const g = createGame(currentFen);
    const aiMove = await getAIMoveAsync(g, diff);
    if (aiMove) {
      makeMove(g, aiMove.from, aiMove.to, aiMove.promotion);
      const newFen = g.fen();
      setFen(newFen);
      setLastMove({ from: aiMove.from, to: aiMove.to });
      setMoves(prev => [...prev, aiMove.san]);
      if (g.isCheckmate()) { playSound('checkmate'); handleGameOver(g, 'loss'); }
      else if (g.isDraw() || g.isStalemate()) { playSound('check'); handleGameOver(g, 'draw'); }
      else if (g.isCheck()) playSound('check');
      else if (aiMove.flags && (aiMove.flags.includes('c') || aiMove.flags.includes('e'))) playSound('capture');
      else playSound('move');
      fetchCommentary(newFen, [...currentMoves, aiMove.san], aiMove.san);
    }
    setIsAIThinking(false);
  };

  const handleGameOver = (g, result) => {
    setGameResult(result);
    setPhase('gameover');
    setEloChange(0);
    // Persist game stats
    const p = storage.getProfile();
    const updatedProfile = {
      ...p,
      total_games: (p.total_games || 0) + 1,
      games_won: (p.games_won || 0) + (result === 'win' ? 1 : 0),
    };
    storage.saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleMove = (from, to, promotion) => {
    if (phase !== 'playing' || isAIThinking) return false;
    const g = createGame(fen);
    const move = makeMove(g, from, to, promotion);
    if (!move) return false;
    const newFen = g.fen();
    setFen(newFen);
    setLastMove({ from, to });
    const newMoves = [...moves, move.san];
    setMoves(newMoves);
    if (g.isCheckmate()) { playSound('checkmate'); handleGameOver(g, 'win'); }
    else if (g.isDraw() || g.isStalemate()) { playSound('check'); handleGameOver(g, 'draw'); }
    else if (g.isCheck()) playSound('check');
    else if (move.captured) playSound('capture');
    else playSound('move');
    fetchCommentary(newFen, newMoves, move.san);
    if (!g.isGameOver()) {
      setTimeout(() => makeAIMove(newFen, difficulty, newMoves), 300);
    }
    return true;
  };

  const analyzeGame = () => {
    let resultStr = '1/2-1/2';
    if (gameResult === 'win') resultStr = playerColor === 'white' ? '1-0' : '0-1';
    else if (gameResult === 'loss') resultStr = playerColor === 'white' ? '0-1' : '1-0';
    let pgn = '';
    for (let i = 0; i < moves.length; i++) {
      if (i % 2 === 0) pgn += `${Math.floor(i / 2) + 1}. `;
      pgn += moves[i] + ' ';
    }
    pgn += resultStr;
    navigate('/analyze', { state: { pgn, side: playerColor } });
  };

  if (phase === 'setup') {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Play vs AI</h1>
        </div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide">Difficulty</h2>
        <div className="space-y-2 mb-8">
          {DIFFICULTIES.map(d => {
            const locked = d.premium && !isPremium();
            return locked ? (
              <button key={d.value} onClick={() => navigate('/upgrade')}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/40 text-muted-foreground opacity-70 cursor-pointer hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 shrink-0 text-primary/60" />
                  <div className="text-left">
                    <div className="font-bold">{d.label}</div>
                    <div className="text-xs">Unlock the Vault to play</div>
                  </div>
                </div>
                <span className="text-primary/50 font-mono text-sm">{d.rating}</span>
              </button>
            ) : (
              <button key={d.value} onClick={() => setDifficulty(d.value)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all
                  ${difficulty === d.value ? 'border-primary bg-primary/10 teal-glow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
                <div className="text-left">
                  <div className="font-bold">{d.label}</div>
                  <div className="text-xs text-muted-foreground">{d.desc}</div>
                </div>
                <span className="text-primary font-mono text-sm">{d.rating}</span>
              </button>
            );
          })}
        </div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide">Your Color</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {['white', 'black'].map(c => (
            <button key={c} onClick={() => setPlayerColor(c)}
              className={`p-6 rounded-lg border transition-all flex flex-col items-center gap-2
                ${playerColor === c ? 'border-primary bg-primary/10 teal-glow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
              <div className={`w-12 h-12 rounded-full border-2 ${c === 'white' ? 'bg-white border-gray-300' : 'bg-card border-gray-600'}`} />
              <span className="font-medium capitalize">{c}</span>
            </button>
          ))}
        </div>
        <button onClick={() => startGame(difficulty, playerColor)}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all teal-glow">
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI: {DIFFICULTIES.find(d => d.value === difficulty)?.label} ({DIFFICULTIES.find(d => d.value === difficulty)?.rating})
            </span>
            {isAIThinking && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          </div>
          <div className="w-full flex justify-center">
            <ChessBoard game={game} fen={fen} onMove={handleMove} orientation={orientation}
              interactive={phase === 'playing' && !isAIThinking} lastMove={lastMove} movableColor={movableColor} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Move History</h3>
            <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin text-sm font-mono">
              {moves.length === 0 ? <p className="text-muted-foreground text-xs">No moves yet</p> : 
                moves.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground w-6">{Math.floor(i / 2) + 1}.{i % 2 === 0 ? '' : '..'}</span>
                    <span>{m}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" /> Coach Commentary
            </h3>
            <div ref={commentaryRef} className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {commentary.length === 0 ? <p className="text-muted-foreground text-xs">Live commentary appears here as you play...</p> :
                commentary.map((c, i) => (
                  <p key={i} className="text-xs text-foreground/90 bg-secondary/50 rounded p-2">{c.text}</p>
                ))}
            </div>
          </div>

          {phase === 'playing' && (
            <button onClick={() => setPhase('setup')} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg">
              <RotateCcw className="w-4 h-4" /> Resign
            </button>
          )}
        </div>
      </div>

      {phase === 'gameover' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="bg-card border rounded-2xl max-w-sm w-full text-center overflow-hidden"
            style={{
              borderColor: gameResult === 'win' ? 'rgba(57,255,20,0.4)' : gameResult === 'loss' ? 'rgba(239,68,68,0.3)' : 'rgba(255,179,0,0.3)',
              boxShadow: gameResult === 'win' ? '0 0 40px rgba(57,255,20,0.15)' : gameResult === 'loss' ? '0 0 40px rgba(239,68,68,0.1)' : '0 0 40px rgba(255,179,0,0.12)',
            }}>

            {/* Result banner */}
            <div className="px-8 pt-8 pb-6"
              style={{
                background: gameResult === 'win'
                  ? 'linear-gradient(160deg, rgba(57,255,20,0.08) 0%, transparent 60%)'
                  : gameResult === 'loss'
                  ? 'linear-gradient(160deg, rgba(239,68,68,0.06) 0%, transparent 60%)'
                  : 'linear-gradient(160deg, rgba(255,179,0,0.07) 0%, transparent 60%)',
              }}>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {gameResult === 'win' ? (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(57,255,20,0.12)', border: '2px solid rgba(57,255,20,0.3)' }}>
                    <Trophy className="w-10 h-10" style={{ color: '#39FF14' }} />
                  </div>
                ) : gameResult === 'loss' ? (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.25)' }}>
                    <Skull className="w-10 h-10 text-destructive" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.25)' }}>
                    <Handshake className="w-10 h-10" style={{ color: '#FFB300' }} />
                  </div>
                )}
              </div>

              {/* Result text */}
              <h2 className="text-4xl font-black mb-1 tracking-tight"
                style={{
                  color: gameResult === 'win' ? '#39FF14' : gameResult === 'loss' ? 'hsl(var(--destructive))' : '#FFB300',
                }}>
                {gameResult === 'win' ? 'Victory!' : gameResult === 'loss' ? 'Defeated' : 'Draw'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {gameResult === 'win' ? 'You outplayed the AI.' : gameResult === 'loss' ? 'The AI got the better of you.' : 'A perfectly balanced game.'}
              </p>
            </div>

            {/* Stats row */}
            <div className="mx-6 mb-6 rounded-xl p-4 flex items-center justify-around"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

              {/* ELO change */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">ELO</div>
                {eloChange === 0 ? (
                  <div className="flex items-center justify-center gap-1 font-bold text-lg text-muted-foreground">
                    <Minus className="w-4 h-4" /> 0
                  </div>
                ) : eloChange > 0 ? (
                  <div className="flex items-center justify-center gap-1 font-bold text-lg" style={{ color: '#39FF14' }}>
                    <TrendingUp className="w-4 h-4" /> +{eloChange}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 font-bold text-lg text-destructive">
                    <TrendingDown className="w-4 h-4" /> {eloChange}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />

              {/* Moves played */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Moves</div>
                <div className="font-bold text-lg text-foreground">{Math.ceil(moves.length / 2)}</div>
              </div>

              {/* Divider */}
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />

              {/* Difficulty */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Opponent</div>
                <div className="font-bold text-sm text-foreground">
                  {DIFFICULTIES.find(d => d.value === difficulty)?.label ?? difficulty}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 px-6 pb-6">
              <button onClick={() => startGame(difficulty, playerColor)}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: gameResult === 'win' ? 'rgba(57,255,20,0.15)' : 'hsl(var(--primary))',
                  color: gameResult === 'win' ? '#39FF14' : 'hsl(var(--primary-foreground))',
                  border: gameResult === 'win' ? '1px solid rgba(57,255,20,0.35)' : 'none',
                }}>
                ⚔️ Rematch
              </button>

              {isPremium() && (
                <button onClick={analyzeGame}
                  className="w-full border border-primary/40 text-primary py-3 rounded-xl font-medium text-sm hover:bg-primary/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Analyze Game <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button onClick={() => setPhase('setup')}
                className="w-full border border-border py-3 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95">
                Return to Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}