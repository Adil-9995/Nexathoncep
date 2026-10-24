import React from 'react';
import { 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  BookOpen, 
  Coins, 
  Users, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-purple-900/40 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-sm">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                Nexa<span className="text-purple-400">thon</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>“Learn One Skill. Teach Another. Grow Together.”</strong> A student-powered circular learning economy & second-hand book marketplace.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-amber-300 font-bold bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/60 inline-flex">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>National Hackathon MVP Submission</span>
            </div>
          </div>

          {/* Peer Learning */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Peer Learning
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Skill Discovery Directory</li>
              <li>3-Way Circular Matching</li>
              <li>100% Free Peer Tuition</li>
              <li>Teach Skills & Earn 5 Credits</li>
              <li>₹10 Match Pass (5 Credits)</li>
            </ul>
          </div>

          {/* Book Marketplace */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Book Marketplace
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Second-Hand Educational Books</li>
              <li>Transparent 2% Platform Commission</li>
              <li>Simulated Escrow Sandbox</li>
              <li>Sell Your College Books</li>
              <li>Academic Material Verification</li>
            </ul>
          </div>

          {/* Student Trust & Governance */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Safety & Governance
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Institutional Domain Auth</li>
              <li>Dual Session Mutual Confirmation</li>
              <li>Faculty Moderator Escalation</li>
              <li>Non-Cash Credit Isolation</li>
              <li>Zero Piracy & Exam Leak Moderation</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} Nexathon Education Platform. Built for Student Knowledge Exchange.</span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Verified Campus Community</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-amber-400 font-bold">SDG 4: Quality Education</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
