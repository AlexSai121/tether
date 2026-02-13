import React, { useState, useEffect } from 'react';
import { Clock, Check, Loader2 } from 'lucide-react';

const PreSessionView = ({ onReady, partner }) => {
      const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
      const [myTasks, setMyTasks] = useState([]);
      const [newTask, setNewTask] = useState('');
      const [partnerTasks, setPartnerTasks] = useState([]);
      const [isReady, setIsReady] = useState(false);
      const [partnerIndication, setPartnerIndication] = useState('connecting'); // connecting, typing, ready

      // Timer countdown
      useEffect(() => {
            const timer = setInterval(() => {
                  setTimeLeft((prev) => {
                        if (prev <= 0) {
                              clearInterval(timer);
                              onReady(myTasks); // Auto-start if time runs out
                              return 0;
                        }
                        return prev - 1;
                  });
            }, 1000);
            return () => clearInterval(timer);
      }, [onReady, myTasks]);

      // Simulate Partner Behavior
      useEffect(() => {
            // 1. Initial "Connecting" state
            const connectTimer = setTimeout(() => {
                  setPartnerIndication('typing');
            }, 2000);

            // 2. Partner adding tasks (simulated)
            const taskTimers = [
                  setTimeout(() => setPartnerTasks(['Review lecture notes']), 5000),
                  setTimeout(() => setPartnerTasks(['Review lecture notes', 'Draft outline']), 12000),
                  setTimeout(() => setPartnerTasks(['Review lecture notes', 'Draft outline', 'Research citations']), 25000),
            ];

            // 3. Partner becoming ready (random time between 30s and 60s)
            const readyDelay = Math.random() * 30000 + 30000;
            const readyTimer = setTimeout(() => {
                  setPartnerIndication('ready');
                  // If user is also ready, we could trigger start, but usually we wait for user to click ready
            }, readyDelay);

            return () => {
                  clearTimeout(connectTimer);
                  taskTimers.forEach(clearTimeout);
                  clearTimeout(readyTimer);
            };
      }, []);

      // Use effect to trigger start if both are ready
      useEffect(() => {
            if (isReady && partnerIndication === 'ready') {
                  const startDelay = setTimeout(() => {
                        onReady(myTasks, partnerTasks);
                  }, 1000);
                  return () => clearTimeout(startDelay);
            }
      }, [isReady, partnerIndication, onReady, myTasks, partnerTasks]);

      const addTask = (e) => {
            e.preventDefault();
            if (newTask.trim()) {
                  setMyTasks([...myTasks, newTask.trim()]);
                  setNewTask('');
            }
      };

      const removeTask = (index) => {
            setMyTasks(myTasks.filter((_, i) => i !== index));
      };

      const formatTime = (seconds) => {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      return (
            <div className="min-h-screen bg-[#141413] text-[#e0e0dc] flex flex-col items-center justify-center relative overflow-hidden font-sans">
                  <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

                  {/* Header / Timer */}
                  <div className="absolute top-8 left-0 right-0 text-center z-10">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#5c5c58] mb-2">Intent Phase</p>
                        <h2 className="text-4xl font-serif text-[#88a090] tabular-nums">{formatTime(timeLeft)}</h2>
                  </div>

                  <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-8 z-10">

                        {/* User Side */}
                        <div className="flex flex-col h-[500px]">
                              <h3 className="text-xl font-serif mb-6 text-[#e0e0dc] italic">Your Intentions</h3>

                              <div className="flex-grow bg-[#1c1c1b] border border-[#2a2a28] rounded-3xl p-6 flex flex-col relative overflow-hidden">
                                    <div className="space-y-3 mb-4 flex-grow overflow-y-auto pr-2">
                                          {myTasks.length === 0 && (
                                                <p className="text-[#5c5c58] text-sm italic text-center mt-10">What will you focus on?</p>
                                          )}
                                          {myTasks.map((task, i) => (
                                                <div key={i} className="flex items-center justify-between group">
                                                      <span className="text-sm font-light">{task}</span>
                                                      <button onClick={() => removeTask(i)} className="text-[#5c5c58] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-xs uppercase tracking-widest">
                                                            Remove
                                                      </button>
                                                </div>
                                          ))}
                                    </div>

                                    <form onSubmit={addTask} className="mt-auto pt-4 border-t border-[#2a2a28]">
                                          <input
                                                type="text"
                                                value={newTask}
                                                onChange={(e) => setNewTask(e.target.value)}
                                                placeholder="Add a task..."
                                                className="w-full bg-transparent text-sm text-[#e0e0dc] placeholder-[#5c5c58] focus:outline-none font-light"
                                          />
                                    </form>
                              </div>

                              <button
                                    onClick={() => setIsReady(!isReady)}
                                    className={`mt-6 w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 ${isReady ? 'bg-[#88a090] text-[#141413]' : 'bg-[#1c1c1b] border border-[#2a2a28] text-[#e0e0dc] hover:border-[#88a090]'}`}
                              >
                                    {isReady ? 'Ready & Waiting' : 'Mark as Ready'}
                              </button>
                        </div>

                        {/* Partner Side */}
                        <div className="flex flex-col h-[500px] opacity-70">
                              <div className="flex justify-between items-baseline mb-6">
                                    <h3 className="text-xl font-serif text-[#e0e0dc] italic">{partner?.name}'s Intentions</h3>
                                    <span className="text-[10px] uppercase tracking-widest text-[#88a090]">
                                          {partnerIndication === 'typing' && 'Typing...'}
                                          {partnerIndication === 'ready' && 'Ready'}
                                          {partnerIndication === 'connecting' && 'Connecting...'}
                                    </span>
                              </div>

                              <div className="flex-grow bg-[#1c1c1b] border border-[#2a2a28] rounded-3xl p-6 flex flex-col relative overflow-hidden">
                                    <div className="space-y-3">
                                          {partnerTasks.length === 0 && partnerIndication === 'typing' && (
                                                <div className="flex space-x-1 items-center justify-center mt-10 opacity-30">
                                                      <div className="w-1 h-1 bg-[#e0e0dc] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                      <div className="w-1 h-1 bg-[#e0e0dc] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                      <div className="w-1 h-1 bg-[#e0e0dc] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                                </div>
                                          )}
                                          {partnerTasks.map((task, i) => (
                                                <div key={i} className="flex items-center space-x-3 text-[#e0e0dc]/60">
                                                      <div className="w-1 h-1 rounded-full bg-[#5c5c58]" />
                                                      <span className="text-sm font-light">{task}</span>
                                                </div>
                                          ))}
                                    </div>
                              </div>

                              <div className={`mt-6 w-full py-4 rounded-xl border border-transparent flex items-center justify-center ${partnerIndication === 'ready' ? 'text-[#88a090]' : 'text-[#5c5c58]'}`}>
                                    {partnerIndication === 'ready' ? (
                                          <div className="flex items-center space-x-2">
                                                <Check className="w-4 h-4" />
                                                <span className="text-[10px] uppercase tracking-widest font-bold">Partner Ready</span>
                                          </div>
                                    ) : (
                                          <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-[10px] uppercase tracking-widest font-bold">Waiting...</span>
                                          </div>
                                    )}
                              </div>
                        </div>

                  </div>
            </div>
      );
};

export default PreSessionView;
