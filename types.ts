
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  JUDGEMENT_PENDING = 'JUDGEMENT_PENDING', // Waiting for AI to generate forfeit
  FORFEIT_ASSIGNED = 'FORFEIT_ASSIGNED',   // User needs to submit proof
  RESOLVED = 'RESOLVED'                    // Proof accepted
}

export enum TaskSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export const POINTS_SYSTEM = {
  COMPLETION: {
    [TaskSeverity.LOW]: 10,
    [TaskSeverity.MEDIUM]: 20,
    [TaskSeverity.HIGH]: 30,
    [TaskSeverity.CRITICAL]: 50
  },
  PENALTY: {
    [TaskSeverity.LOW]: -15,
    [TaskSeverity.MEDIUM]: -30,
    [TaskSeverity.HIGH]: -50,
    [TaskSeverity.CRITICAL]: -100
  },
  REDEMPTION: 15 // Points gained back after doing the forfeit
};

export type AppView = 'ONBOARDING' | 'AUTH' | 'TEAM_SELECTION' | 'SETUP' | 'MAIN_APP' | 'ABOUT';

export interface AppConfig {
  botToken: string;
  channelId: string;
}

export interface Forfeit {
  id: string;
  title: string;
  description: string;
  wittiness: string;
}

export interface User {
  id: string;
  name: string;
  telegramHandle: string;
  telegramChatId?: string; 
  role: 'ADMIN' | 'MEMBER';
  avatar: string;
  reputationScore: number;
  joinedTeams?: Record<string, boolean>; // Map of Channel IDs
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  deadline: string; // ISO Date string
  severity: TaskSeverity;
  status: TaskStatus;
  generatedForfeits?: Forfeit[];
  selectedForfeit?: Forfeit;
  proofUrl?: string;
  judgementPublished?: boolean; 
}

export interface Team {
  id: string;
  name: string;
  image?: string; // Custom Room Image URL
  members: User[];
}

export interface TeamSummary {
  id: string;
  name: string;
  image?: string; // Custom Room Image URL
  memberCount: number;
  role: 'ADMIN' | 'MEMBER';
}