
export type MissionStatus = 'locked' | 'available' | 'completed';

export interface Mission {
  id: number;
  title: string;
  category: '자기인식' | '자기관리' | '사회적인식' | '관계기술' | '의사결정';
  description: string;
  instruction: string;
  icon: string;
}

export interface UserState {
  completedMissions: number[];
  currentMissionId: number | null;
  nickname: string;
  initialMood: string | null;
}
