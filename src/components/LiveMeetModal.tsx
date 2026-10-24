import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Hand, 
  MessageSquare, 
  Users, 
  PhoneOff, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Coins, 
  Radio, 
  Code2, 
  Share2, 
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveMeetModal: React.FC = () => {
  const { 
    activeLiveMeetSession, 
    setActiveLiveMeetSession, 
    currentUser, 
    confirmSessionCompletion,
    toggleLiveMeet
  } = useApp();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  // Timer for live duration
  const [secondsElapsed, setSecondsElapsed] = useState(1124); // starts ~18m into session

  // Live messages in the study circle
  const [messages, setMessages] = useState([
    { sender: 'Abiya Daniel', text: 'Can we inspect line 24 of the tensor loss calculation?', time: '6:14 PM' },
    { sender: 'Amal Dev A', text: 'Weights initialized properly on my local machine now!', time: '6:16 PM' },
    { sender: 'Anjali T Paul', text: 'The backpropagation step is so much clearer with this diagram.', time: '6:18 PM' }
  ]);

  useEffect(() => {
    if (!activeLiveMeetSession) return;
    const interval = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeLiveMeetSession]);

  if (!activeLiveMeetSession) return null;

  const session = activeLiveMeetSession;
  const isHost = session.mentorId === currentUser.id;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' && window.location.origin 
      ? window.location.origin 
      : 'https://nexathoncep.vercel.app';
    
    let slug = session.id;
    if (session.meetLink) {
      const parts = session.meetLink.split('/room/');
      if (parts.length > 1 && parts[1]) {
        slug = parts[1].replace(/[^a-z0-9-_]/gi, '');
      }
    }
    const link = `${origin}/room/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: currentUser.name,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleEndOrLeave = () => {
    if (isHost) {
      toggleLiveMeet(session.id, false);
    }
    setActiveLiveMeetSession(null);
  };

  // Compile participants list for video tiles (Host + enrolled peers)
  const peerList = [
    {
      id: session.mentorId,
      name: session.mentorName,
      avatar: session.mentorAvatar,
      isHost: true,
      speaking: true
    },
    ...(session.enrolledParticipants && session.enrolledParticipants.length > 0 
      ? session.enrolledParticipants.map(p => ({
          id: p.studentId,
          name: p.studentName,
          avatar: p.studentAvatar,
          isHost: false,
          speaking: false
        }))
      : [
          {
            id: session.learnerId,
            name: session.learnerName,
            avatar: session.learnerAvatar,
            isHost: false,
            speaking: false
          }
        ]
    )
  ];

  // If current user is not in the list, show them as active learner tile
  const isUserIncluded = peerList.some(p => p.id === currentUser.id);
  if (!isUserIncluded) {
    peerList.push({
      id: currentUser.id,
      name: `${currentUser.name} (You)`,
      avatar: currentUser.avatar,
      isHost: false,
      speaking: false
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ============================================================ */}
        {/* MEET HEADER */}
        {/* ============================================================ */}
        <div className="h-16 px-4 sm:px-6 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          
          {/* Left: Live Indicator & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE</span>
              <span className="text-slate-400 font-normal">| {formatTimer(secondsElapsed)}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                  {session.topic}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50 text-[10px] font-bold">
                  {session.skillName}
                </span>
                {session.sessionType === 'group' && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-[10px] font-bold">
                    Group Study (Max {session.maxParticipants || 4} Peers)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Host / Mentor: <strong className="text-slate-200">{session.mentorName}</strong> • {peerList.length} Connected
              </p>
            </div>
          </div>

          {/* Right: Copy Link & Quick Complete */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              title="Copy Live Room Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden md:inline">{copiedLink ? 'Link Copied!' : 'Share Room'}</span>
            </button>

            {/* Quick Mutual Complete within Live Meet */}
            <button
              onClick={() => {
                confirmSessionCompletion(session.id, isHost ? 'mentor' : 'learner');
                handleEndOrLeave();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              title="Confirm teaching session completed & release credits"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Confirm Completion & +5 Credits</span>
            </button>

            <button
              onClick={handleEndOrLeave}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Meet View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* ============================================================ */}
        {/* MAIN STAGE & SIDEBAR */}
        {/* ============================================================ */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main Video Stage / Screen Share */}
          <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto">
            
            {isScreenSharing ? (
              /* SCREEN SHARING VIEW: Code/Slide presentation + PiP tiles */
              <div className="flex-1 flex flex-col space-y-3 h-full">
                {/* Simulated Screen Share Display */}
                <div className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-inner">
                  <div className="h-9 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="font-mono text-[11px] text-slate-300 ml-2">
                        {session.mentorName}'s Screen — live_tutorial.py
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-purple-300 px-2 py-0.5 rounded font-mono">
                      PyTorch 2.4 / Jupyter Hub
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-300 space-y-2 overflow-y-auto leading-relaxed bg-slate-950/95">
                    <p className="text-emerald-400 font-semibold"># {session.topic}</p>
                    <p className="text-slate-500"># Interactive student study circle with 4 peers</p>
                    <p><span className="text-purple-400">import</span> torch</p>
                    <p><span className="text-purple-400">import</span> torch.nn <span className="text-purple-400">as</span> nn</p>
                    <p><span className="text-purple-400">from</span> torch.optim <span className="text-purple-400">import</span> Adam</p>
                    <br />
                    <p><span className="text-blue-400">class</span> <span className="text-amber-300 font-bold">StudyCircleModel</span>(nn.Module):</p>
                    <p className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-300">__init__</span>(self, input_dim=128, hidden=64):</p>
                    <p className="pl-8">super().<span className="text-blue-300">__init__</span>()</p>
                    <p className="pl-8">self.layer1 = nn.Linear(input_dim, hidden)</p>
                    <p className="pl-8">self.relu = nn.ReLU()</p>
                    <p className="pl-8">self.out = nn.Linear(hidden, 2)</p>
                    <br />
                    <p className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-300">forward</span>(self, x):</p>
                    <p className="pl-8"><span className="text-purple-400">return</span> self.out(self.relu(self.layer1(x)))</p>
                    <br />
                    <p className="text-amber-300/90 font-mono text-xs bg-amber-950/30 p-2 rounded border border-amber-900/40">
                      &gt;&gt; Live Model Training Epoch 4/10: loss = 0.142 | accuracy = 96.8% (Shared with study circle)
                    </p>
                  </div>
                </div>

                {/* Picture in Picture Horizontal Strip of Peers */}
                <div className="h-24 flex items-center gap-3 overflow-x-auto pb-1">
                  {peerList.map((peer, idx) => (
                    <div 
                      key={idx}
                      className="h-20 w-36 rounded-xl bg-slate-800/90 border border-slate-700/80 p-2 relative shrink-0 flex items-center justify-center overflow-hidden"
                    >
                      <img 
                        src={peer.avatar} 
                        alt={peer.name} 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/50"
                      />
                      <span className="absolute bottom-1 left-2 text-[9px] font-bold text-slate-300 bg-black/60 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                        {peer.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* STANDARD 4-PEER VIDEO GRID */
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full">
                {peerList.map((peer, idx) => {
                  const isCurrent = peer.id === currentUser.id;
                  const camActive = isCurrent ? isCamOn : true;

                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/70 p-4 relative flex flex-col justify-between overflow-hidden shadow-lg group hover:border-purple-500/50 transition-all"
                    >
                      {/* Video Camera Representation */}
                      {camActive ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs">
                          {/* Live Video Avatar & Audio Pulse Indicator */}
                          <div className="relative">
                            <img 
                              src={peer.avatar} 
                              alt={peer.name} 
                              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-2xl transition-all ${
                                peer.speaking ? 'ring-4 ring-emerald-400 scale-105' : 'ring-2 ring-slate-600'
                              }`}
                            />
                            {peer.speaking && (
                              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-500 space-y-2">
                          <VideoOff className="w-10 h-10" />
                          <span className="text-xs font-mono">Camera Paused</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-300">
                          {peer.isHost ? 'Mentor & Host' : 'Study Peer'}
                        </span>
                        {peer.speaking && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Speaking
                          </span>
                        )}
                      </div>

                      {/* Bottom Name Tag */}
                      <div className="relative z-10 flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                            {peer.name}
                            {isCurrent && <span className="text-[10px] text-purple-400">(You)</span>}
                          </span>
                        </div>
                        <div className="p-1 rounded-md bg-black/60 text-slate-300">
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* ============================================================ */}
          {/* CHAT / PARTICIPANTS SIDEBAR */}
          {/* ============================================================ */}
          {showChat && (
            <div className="w-80 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between shrink-0 animate-in slide-in-from-right duration-150">
              <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-extrabold text-xs text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    In-Call Study Chat
                  </span>
                  <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1">
                  {messages.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300 text-[11px]">{m.sender}</span>
                        <span className="text-[9px] text-slate-500">{m.time}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder="Ask question in study group..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button type="submit" className="p-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Participants Drawer */}
          {showParticipants && (
            <div className="w-72 bg-slate-950 border-l border-slate-800 p-4 space-y-3 shrink-0 animate-in slide-in-from-right duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-extrabold text-xs text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Participants ({peerList.length})
                </span>
                <button onClick={() => setShowParticipants(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {peerList.map((p, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-white block text-[11px]">{p.name}</span>
                        <span className="text-[9px] text-slate-400">{p.isHost ? 'Mentor Host' : 'Peer Learner'}</span>
                      </div>
                    </div>
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* BOTTOM CONTROLS BAR */}
        {/* ============================================================ */}
        <div className="h-20 bg-slate-950 border-t border-slate-800/80 px-4 sm:px-8 flex items-center justify-between shrink-0">
          
          {/* Left Session Details */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Interactive Campus Classroom Sandbox</span>
          </div>

          {/* Center Call Control Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsCamOn(!isCamOn)}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer ${
                isCamOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer ${
                isScreenSharing ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* Raise Hand Toggle */}
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer ${
                isHandRaised ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            >
              <Hand className="w-5 h-5" />
            </button>

            {/* Chat Drawer Toggle */}
            <button
              onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer relative ${
                showChat ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle Live Chat"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400" />
            </button>

            {/* Participants Toggle */}
            <button
              onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
              className={`p-3 rounded-2xl font-bold transition-all cursor-pointer ${
                showParticipants ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Participants List"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* Leave / End Call */}
            <button
              onClick={handleEndOrLeave}
              className="p-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md ml-2 cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>

          {/* Right Credit indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-900/40">
            <Coins className="w-4 h-4 fill-current" />
            <span>5 Credits per Completed Session</span>
          </div>

        </div>

      </div>
    </div>
  );
};
