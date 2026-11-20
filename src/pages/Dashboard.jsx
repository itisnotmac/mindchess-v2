import { useRoomBackground } from '@/hooks/useRoomBackground';
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Brain, Target, Gamepad2, BookOpen } from 'lucide-react';

export default function Dashboard() {
  useRoomBackground('room-throne');

  const modules = [
    { to: '/play', icon: Gamepad2, title: 'Play vs AI', desc: '5 difficulty levels with live coaching', color: 'text-primary' },
    { to: '/tactics', icon: Brain, title: 'Tactics Trainer', desc: 'Solve puzzles, build streaks', color: 'text-[#39FF14]' },
    { to: '/openings', icon: BookOpen, title: 'Opening Explorer', desc: 'Study & drill major openings', color: 'text-[#FFB300]' },
    { to: '/endgames', icon: Target, title: 'Endgame Lab', desc: 'Master critical endgame techniques', color: 'text-destructive' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow flex items-center gap-3 mb-2">MIND <Crown className="w-8 h-8 text-primary teal-text-glow" /> CHESS</h1>
        <p className="text-sm text-primary teal-text-glow">From the team that brought you Reel Chess — Let's Chess!</p>
      </div>

      <h2 className="text-xl font-bold mb-4 text-primary teal-text-glow text-center">Training Modules</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {modules.map((m, i) => (
          <Link key={i} to={m.to} className="group relative flex flex-col items-center gap-2 p-2 transition-all z-0 hover:z-10">
            <div className="group-hover:scale-[2] transition-transform duration-150">
              <m.icon className={`w-14 h-14 md:w-16 md:h-16 ${m.color} group-hover:animate-shake group-hover:teal-text-glow`} />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-center">{m.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
