
import React, { useState, useEffect, useRef } from 'react';
import { MISSIONS } from './constants';
import { Mission, UserState } from './types';
import MissionView from './components/MissionView';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('sel-user-state-v3');
    return saved ? JSON.parse(saved) : {
      completedMissions: [],
      currentMissionId: null,
      nickname: "",
      initialMood: null
    };
  });

  const [introStep, setIntroStep] = useState(1); // 1: Nickname, 2: Mood Check
  const [showCertificate, setShowCertificate] = useState(false);
  const nicknameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('sel-user-state-v3', JSON.stringify(userState));
  }, [userState]);

  const handleNicknameSubmit = () => {
    const name = nicknameRef.current?.value.trim();
    if (!name) return;
    setUserState(prev => ({ ...prev, nickname: name }));
    setIntroStep(2);
  };

  const handleMoodSelect = (mood: string) => {
    setUserState(prev => ({ ...prev, initialMood: mood }));
    // 1번 미션(오늘의 마음 날씨)을 자동으로 완료 처리하거나 안내할 수 있음
    // 여기서는 단순히 상태 저장 후 메인으로 진입
  };

  const startMission = (id: number) => {
    setUserState(prev => ({ ...prev, currentMissionId: id }));
  };

  const completeMission = () => {
    if (userState.currentMissionId === null) return;
    const newCompleted = Array.from(new Set([...userState.completedMissions, userState.currentMissionId]));
    setUserState(prev => ({
      ...prev,
      completedMissions: newCompleted,
      currentMissionId: null
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentMission = MISSIONS.find(m => m.id === userState.currentMissionId);
  const isAllCompleted = userState.completedMissions.length === 10;

  // --- Certificate View ---
  if (showCertificate) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div id="certificate" className="relative w-full max-w-4xl aspect-[1.414/1] bg-white border-[16px] border-double border-yellow-400 p-8 md:p-16 text-center shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-yellow-600 rounded-tl-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-yellow-600 rounded-br-3xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.03] pointer-events-none">🏆</div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-gaegu font-bold text-yellow-600 tracking-tighter">수 료 증</h1>
            <p className="text-xl text-gray-400 font-bold uppercase tracking-[0.5em]">Certificate of Completion</p>
          </div>

          <div className="space-y-8">
            <p className="text-3xl md:text-4xl font-gaegu">
              이름: <span className="underline decoration-yellow-300 decoration-4 underline-offset-8 px-4 font-bold">{userState.nickname}</span>
            </p>
            <div className="text-xl md:text-2xl leading-relaxed text-gray-700 px-10">
              위 대원은 <span className="font-bold text-blue-600">‘마음 튼튼 사회정서학습 탐험대’</span>의<br/>
              모든 과정(10가지 마음 미션)을 우수한 성적으로 수료하였으며,<br/>
              자신의 감정을 소중히 하고 타인을 배려하는 따뜻한 마음 근육을<br/>
              가졌음을 증명합니다.
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-2xl text-gray-500 font-gaegu">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div className="flex justify-center items-center gap-4">
               <span className="text-4xl">🌟</span>
               <p className="text-3xl font-bold font-gaegu text-gray-800">마음 튼튼 탐험 본부</p>
               <span className="text-4xl">🌟</span>
            </div>
          </div>

          {/* Golden Seal */}
          <div className="absolute bottom-16 right-16 w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center border-8 border-yellow-200 shadow-lg transform rotate-12">
            <span className="text-white font-bold text-xl text-center leading-tight">OFFICIAL<br/>SEAL</span>
          </div>
        </div>

        <div className="mt-10 flex gap-4 no-print">
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            출력 및 다운로드 🖨️
          </button>
          <button 
            onClick={() => setShowCertificate(false)}
            className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl text-xl font-bold shadow-md hover:bg-gray-200 transition-all"
          >
            지도로 돌아가기
          </button>
        </div>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #certificate, #certificate * { visibility: visible; }
            #certificate { position: absolute; left: 0; top: 0; width: 100% !important; border-width: 10px !important; }
            .no-print { display: none !important; }
          }
        `}</style>
      </div>
    );
  }

  // --- Intro / Setup Screen ---
  if (!userState.nickname || !userState.initialMood) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-100 rounded-full blur-[120px] opacity-40"></div>
        
        <div className="glass-panel p-10 md:p-16 rounded-[4rem] max-w-2xl w-full text-center relative z-10 border-4 border-white shadow-2xl">
          {introStep === 1 ? (
            <div className="animate-in slide-in-from-bottom-8 duration-500">
              <span className="text-8xl mb-6 block animate-float">🧭</span>
              <h1 className="text-5xl font-gaegu font-bold text-gray-800 mb-4 tracking-tight">반가워요, 대원님!</h1>
              <p className="text-gray-500 text-xl mb-10 font-medium">탐험을 시작하기 전에 이름을 알려주세요.</p>
              <div className="space-y-6">
                <input 
                  ref={nicknameRef}
                  type="text" 
                  autoFocus
                  placeholder="닉네임을 입력하세요" 
                  className="w-full px-8 py-6 rounded-[2.5rem] border-4 border-blue-50 focus:border-blue-200 outline-none text-center text-2xl font-bold bg-white/70 transition-all placeholder:text-gray-200 shadow-inner"
                  onKeyDown={(e) => e.key === 'Enter' && handleNicknameSubmit()}
                />
                <button 
                  onClick={handleNicknameSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 rounded-[2.5rem] text-2xl font-gaegu font-bold shadow-xl hover:shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  다음으로 가기! 👉
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-12 duration-500">
              <h2 className="text-4xl font-gaegu font-bold text-gray-800 mb-2">{userState.nickname} 대원님,</h2>
              <p className="text-gray-500 text-xl mb-8">지금 이 순간, 당신의 마음 날씨는 어떤가요?</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'happy', label: '행복해요', icon: '☀️' },
                  { id: 'calm', label: '평온해요', icon: '☁️' },
                  { id: 'angry', label: '화가 나요', icon: '⚡' },
                  { id: 'sad', label: '슬퍼요', icon: '🌧️' }
                ].map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.label)}
                    className="p-6 bg-white border-4 border-transparent hover:border-blue-200 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group"
                  >
                    <span className="text-5xl block mb-2 group-hover:scale-125 transition-transform">{mood.icon}</span>
                    <span className="text-lg font-bold text-gray-700">{mood.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-8 text-sm text-gray-400">마음의 소리에 귀를 기울여보세요.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden selection:bg-blue-100">
      <header className="glass-panel sticky top-0 z-50 px-8 py-4 flex justify-between items-center border-b-2 border-white/50">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setUserState(prev => ({...prev, currentMissionId: null}))}>
          <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <span className="text-xl">🌟</span>
          </div>
          <h1 className="text-2xl font-gaegu font-bold text-gray-800">마음 튼튼 탐험대</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-white/90 px-5 py-2 rounded-2xl border border-white shadow-sm flex items-center gap-3">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Welcome</span>
              <span className="text-gray-700 font-bold">{userState.nickname} 대원</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg shadow-inner">
               {userState.initialMood?.includes('행복') ? '☀️' : 
                userState.initialMood?.includes('평온') ? '☁️' : 
                userState.initialMood?.includes('화') ? '⚡' : '🌧️'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 relative z-10">
        {currentMission ? (
          <MissionView 
            mission={currentMission} 
            onComplete={completeMission}
            onBack={() => setUserState(prev => ({ ...prev, currentMissionId: null }))}
          />
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="mb-14 text-center">
              <h2 className="text-5xl font-gaegu font-bold text-gray-800 mb-4 tracking-tight">오늘의 마음 모험 지도 🗺️</h2>
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between text-xs font-bold text-blue-500 mb-1 px-1">
                  <span>진행 상황</span>
                  <span>{userState.completedMissions.length} / 10 미션 완료</span>
                </div>
                <div className="w-full h-4 bg-gray-100 border-2 border-white shadow-inner rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000" style={{ width: `${(userState.completedMissions.length / 10) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {MISSIONS.map((mission) => {
                const isCompleted = userState.completedMissions.includes(mission.id);
                return (
                  <button
                    key={mission.id}
                    onClick={() => startMission(mission.id)}
                    className={`group relative p-8 rounded-[3.5rem] text-left transition-all duration-500 transform hover:-translate-y-4 flex flex-col items-center text-center glass-panel border-4
                      ${isCompleted 
                        ? 'opacity-90 border-green-200 bg-green-50/50' 
                        : 'border-white hover:shadow-blue-100'
                      }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-4 right-6 text-3xl animate-bounce">✨</div>
                    )}
                    <div className={`mb-6 p-4 rounded-3xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${isCompleted ? 'bg-green-100 shadow-inner' : 'bg-white shadow-sm'}`}>
                        <span className="text-6xl">{mission.icon}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{mission.category}</span>
                    <h3 className="text-xl font-bold text-gray-800 leading-tight mb-4 min-h-[3rem] flex items-center">{mission.title}</h3>
                    
                    <div className={`mt-auto w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                        isCompleted 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'bg-white text-gray-600 border border-gray-100 group-hover:bg-blue-500 group-hover:text-white'
                    }`}>
                      {isCompleted ? '멋지게 완료!' : '미션 시작'}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAllCompleted && (
              <div className="mt-24 p-16 glass-panel rounded-[5rem] text-center border-4 border-yellow-200 shadow-2xl animate-soft-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50 opacity-60 -z-10"></div>
                <h2 className="text-6xl font-gaegu font-bold text-orange-600 mb-6 tracking-tighter">🏆 대단해요! 탐험 성공!</h2>
                <p className="text-gray-600 text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
                  모든 마음 미션을 완료하신 {userState.nickname} 대원님,<br/>
                  이제 당신의 수료증을 확인하고 소중히 간직하세요!
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <button 
                    onClick={() => setShowCertificate(true)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-6 rounded-[2.5rem] text-3xl font-gaegu font-bold shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3"
                  >
                    수료증 받기 📜
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm("모든 기록을 지우고 새로운 모험을 시작할까요?")) {
                        localStorage.removeItem('sel-user-state-v3');
                        window.location.reload();
                      }
                    }}
                    className="bg-white text-gray-400 px-10 py-6 rounded-[2.5rem] text-xl font-gaegu font-bold hover:text-red-400 transition-all border border-gray-100"
                  >
                    모험 초기화
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-32 text-center text-gray-400 text-sm pb-16 font-medium">
        <div className="flex justify-center gap-6 mb-4 grayscale opacity-50">
            <span>☁️</span><span>🌈</span><span>🌱</span><span>✨</span>
        </div>
        © 2025 마음 튼튼 사회정서학습 탐험대<br/>
        <span className="text-blue-300">당신의 마음은 언제나 반짝입니다.</span>
      </footer>
    </div>
  );
};

export default App;
