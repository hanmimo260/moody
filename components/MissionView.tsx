
import React, { useState, useEffect } from 'react';
import { Mission } from '../types';

interface MissionViewProps {
  mission: Mission;
  onComplete: () => void;
  onBack: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  '자기인식': 'bg-rose-100 text-rose-600 border-rose-200',
  '자기관리': 'bg-blue-100 text-blue-600 border-blue-200',
  '사회적인식': 'bg-purple-100 text-purple-600 border-purple-200',
  '관계기술': 'bg-emerald-100 text-emerald-600 border-emerald-200',
  '의사결정': 'bg-amber-100 text-amber-600 border-amber-200',
};

const MissionView: React.FC<MissionViewProps> = ({ mission, onComplete, onBack }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [breathingScale, setBreathingScale] = useState(1);

  useEffect(() => {
    if (mission.id === 2) {
      const interval = setInterval(() => {
        setBreathingScale(prev => (prev === 1 ? 1.5 : 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mission.id]);

  const renderContent = () => {
    switch (mission.id) {
      case 1: // 오늘의 마음 날씨
        return (
          <div className="grid grid-cols-2 gap-6 mt-8">
            {[
              { label: '☀️ 맑음(행복)', color: 'hover:bg-yellow-50 active:bg-yellow-100' },
              { label: '☁️ 흐림(평온)', color: 'hover:bg-slate-50 active:bg-slate-100' },
              { label: '⛈️ 번개(화남)', color: 'hover:bg-orange-50 active:bg-orange-100' },
              { label: '🌧️ 비(슬픔)', color: 'hover:bg-indigo-50 active:bg-indigo-100' }
            ].map((mood, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`p-8 rounded-[2.5rem] border-4 transition-all duration-300 transform hover:scale-105 ${
                  selectedOption === idx 
                  ? 'border-blue-400 bg-blue-50 shadow-inner' 
                  : `border-transparent bg-white shadow-md ${mood.color}`
                }`}
              >
                <span className="text-xl font-bold text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        );
      case 2: // 풍선 호흡법
        return (
          <div className="flex flex-col items-center justify-center space-y-12 mt-10">
            <div 
              className="relative w-48 h-48 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center text-white transition-all duration-[3000ms] ease-in-out shadow-2xl"
              style={{ transform: `scale(${breathingScale})` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl scale-90"></div>
              <span className="text-6xl relative z-10">🎈</span>
            </div>
            <div className="text-center">
              <p className="text-3xl font-gaegu font-bold text-gray-800 mb-2">
                {breathingScale === 1.5 ? "천천히 들이마셔요..." : "편안하게 내뱉어요..."}
              </p>
              <p className="text-gray-400">눈을 감고 풍선의 움직임에 집중해보세요.</p>
            </div>
          </div>
        );
      case 5: // 감사 보물찾기
        return (
          <div className="space-y-6 mt-8">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-700 text-sm">
              💡 예: "오늘 점심 메뉴가 맛있어서 감사했다.", "친구가 웃어줘서 기뻤다."
            </div>
            <textarea
              className="w-full p-6 text-lg border-4 border-blue-50 rounded-3xl focus:border-blue-300 focus:ring-0 outline-none transition-all shadow-inner bg-white/50"
              placeholder="여기에 감사한 마음을 적어보세요..."
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        );
      case 9: // 나의 장점 나무
        const traits = ["착해요", "운동을 잘해요", "인사를 잘해요", "그림을 잘 그려요", "노래를 잘해요", "정직해요", "용감해요"];
        return (
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            {traits.map((trait, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`px-8 py-4 rounded-full border-2 text-lg font-bold transition-all duration-300 shadow-sm ${
                  selectedOption === idx 
                  ? 'bg-green-500 text-white border-green-600 scale-110 shadow-lg' 
                  : 'bg-white border-green-100 text-green-700 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                {trait}
              </button>
            ))}
          </div>
        );
      default:
        return (
          <div className="mt-8 p-12 bg-white/40 rounded-[3rem] border-4 border-dashed border-white flex flex-col items-center shadow-inner">
            <div className="bg-white px-8 py-6 rounded-3xl shadow-sm text-center">
              <p className="text-xl text-gray-600 mb-4 font-gaegu">{mission.instruction}</p>
              <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-bold">
                생각하고 실천해볼까요?
              </div>
            </div>
          </div>
        );
    }
  };

  const isCompleteButtonDisabled = () => {
    if (mission.id === 1 || mission.id === 9) return selectedOption === null;
    if (mission.id === 5) return inputValue.length < 5;
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto glass-panel rounded-[4rem] p-10 relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 rounded-bl-full ${CATEGORY_COLORS[mission.category].split(' ')[0]}`}></div>
      
      <div className="flex justify-between items-center mb-10 relative z-10">
        <button 
          onClick={onBack} 
          className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 font-bold"
        >
          <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">←</span>
          돌아가기
        </button>
        <span className={`px-5 py-2 rounded-full text-sm font-extrabold border shadow-sm ${CATEGORY_COLORS[mission.category]}`}>
          {mission.category}
        </span>
      </div>

      <div className="text-center mb-10 relative z-10">
        <div className="inline-block bg-white p-6 rounded-[2.5rem] shadow-xl mb-6 animate-soft-pulse">
            <span className="text-7xl block">{mission.icon}</span>
        </div>
        <h2 className="text-4xl font-gaegu font-bold text-gray-800 mb-3">{mission.title}</h2>
        <p className="text-lg text-gray-500 max-w-md mx-auto">{mission.description}</p>
      </div>

      <div className="min-h-[350px] relative z-10">
        {renderContent()}
      </div>

      <div className="mt-12 flex justify-center relative z-10">
        <button
          onClick={onComplete}
          disabled={isCompleteButtonDisabled()}
          className={`px-16 py-5 rounded-[2rem] text-2xl font-gaegu font-bold shadow-2xl transition-all duration-300 ${
            isCompleteButtonDisabled() 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed scale-95 opacity-50' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-110 active:scale-95 hover:shadow-blue-200'
          }`}
        >
          미션 완료하기! ✨
        </button>
      </div>
    </div>
  );
};

export default MissionView;
