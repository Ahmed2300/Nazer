import { Task, Team, User, AppConfig, TeamSummary } from '../types';

const DB_URL = "https://posts-a6aaf-default-rtdb.firebaseio.com";

// Helper to sanitize keys (Firebase keys can't contain ., #, $, [, ])
const sanitizeId = (id: string) => id ? id.toString().trim().replace(/[.#$[\]]/g, '_') : 'unknown';

export const fbApi = {
  // --- USERS (Global) ---
  getUser: async (chatId: string): Promise<any | null> => {
    const res = await fetch(`${DB_URL}/users/${sanitizeId(chatId)}.json`);
    if (!res.ok) return null;
    return res.json();
  },

  registerUser: async (user: User) => {
    if (!user.telegramChatId) return;
    await fetch(`${DB_URL}/users/${sanitizeId(user.telegramChatId)}.json`, {
      method: 'PATCH', // PATCH to update fields but keep joinedTeams if exists
      body: JSON.stringify(user)
    });
  },

  linkUserToTeam: async (chatId: string, channelId: string) => {
    const cleanChatId = sanitizeId(chatId);
    const cleanChannelId = sanitizeId(channelId);

    // 1. Add Team ID to User's joinedTeams
    await fetch(`${DB_URL}/users/${cleanChatId}/joinedTeams/${cleanChannelId}.json`, {
      method: 'PUT',
      body: 'true'
    });
  },

  getUserTeams: async (teamIds: string[]): Promise<TeamSummary[]> => {
    const summaries: TeamSummary[] = [];
    
    for (const id of teamIds) {
       const res = await fetch(`${DB_URL}/teams/${id}/info.json`);
       if (res.ok) {
         const info = await res.json();
         if (info) {
            // Get member count roughly
            const memRes = await fetch(`${DB_URL}/teams/${id}/members.json?shallow=true`);
            const memCount = memRes.ok ? Object.keys(await memRes.json() || {}).length : 0;

            summaries.push({
              id: id,
              name: info.name || 'Unknown Squad',
              image: info.image,
              memberCount: memCount,
              role: 'MEMBER' // Default
            });
         }
       }
    }
    return summaries;
  },

  // --- TEAMS ---
  getTeamData: async (channelId: string) => {
    const cleanId = sanitizeId(channelId);
    const res = await fetch(`${DB_URL}/teams/${cleanId}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    
    if (!data) return null;

    // Convert Maps to Arrays for UI
    const members = data.members ? Object.values(data.members) as User[] : [];
    const tasks = data.tasks ? Object.values(data.tasks) as Task[] : [];
    
    // Sort tasks by date descending
    tasks.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());

    return {
      info: data.info || { id: cleanId, name: 'New Team', members: [] },
      config: data.config as AppConfig,
      members,
      tasks
    };
  },

  // --- WRITE ---
  saveConfig: async (channelId: string, config: AppConfig) => {
    const cleanId = sanitizeId(channelId);
    await fetch(`${DB_URL}/teams/${cleanId}/config.json`, {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  },

  saveTeamInfo: async (channelId: string, teamInfo: Partial<Team>) => {
    const cleanId = sanitizeId(channelId);
    await fetch(`${DB_URL}/teams/${cleanId}/info.json`, {
      method: 'PATCH',
      body: JSON.stringify(teamInfo)
    });
  },

  saveMember: async (channelId: string, user: User) => {
    const cleanId = sanitizeId(channelId);
    if (!user.telegramChatId) return;
    // CRITICAL: Sanitize the user ID in the URL to match how it's stored in 'users'
    await fetch(`${DB_URL}/teams/${cleanId}/members/${sanitizeId(user.telegramChatId)}.json`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  },

  updateMemberScore: async (channelId: string, userId: string, score: number) => {
    const cleanId = sanitizeId(channelId);
    const cleanUserId = sanitizeId(userId);
    await fetch(`${DB_URL}/teams/${cleanId}/members/${cleanUserId}/reputationScore.json`, {
      method: 'PUT',
      body: JSON.stringify(score)
    });
  },

  saveTask: async (channelId: string, task: Task) => {
    const cleanId = sanitizeId(channelId);
    await fetch(`${DB_URL}/teams/${cleanId}/tasks/${task.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(task)
    });
  },

  deleteTask: async (channelId: string, taskId: string) => {
    const cleanId = sanitizeId(channelId);
    await fetch(`${DB_URL}/teams/${cleanId}/tasks/${taskId}.json`, {
      method: 'DELETE'
    });
  }
};