import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskSeverity, User, Team, AppView, AppConfig, POINTS_SYSTEM, Forfeit, TeamSummary } from '../types';
import { notifyNewTask, notifyJudgement, notifyResolution, notifyJudgementCandidates, notifyScoreChange, getTelegramPhotoUrl, getTelegramUpdates, notifyInvalidSelection } from '../services/telegramService';
import { fbApi } from '../services/firebaseService';
import { uploadToImgBB } from '../services/imageService';

interface AppContextType {
  appView: AppView;
  currentUser: User | null;
  userTeams: TeamSummary[]; // List of teams the user belongs to
  
  // Active Team Data
  appConfig: AppConfig | null;
  team: Team;
  tasks: Task[];
  
  // Flow Actions
  completeOnboarding: () => void;
  registerUser: (name: string, handle: string, chatId: string) => Promise<void>;
  createTeam: (token: string, channelId: string, name: string, image: string) => Promise<void>;
  joinTeamById: (channelId: string) => Promise<boolean>;
  selectTeam: (channelId: string) => Promise<void>;
  exitTeam: () => void;
  signOut: () => void;
  openAbout: () => void; // Added
  goBack: () => void; // Added for navigating back from About
  
  // App Actions
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  assignForfeits: (taskId: string, forfeits: Forfeit[]) => void;
  selectForfeit: (taskId: string, forfeitId: string) => void;
  submitProof: (taskId: string, proofUrl: string) => void;
  deleteTask: (taskId: string) => void;
  addMember: (name: string, handle: string, chatId: string) => Promise<void>;
  updateUserProfile: (name: string, avatarFile?: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_TEAM: Team = {
  id: 'init',
  name: 'جاري التحميل...',
  members: []
};

// Simple helper matching the service one for local state updates
const sanitizeId = (id: string) => id ? id.toString().trim().replace(/[.#$[\]]/g, '_') : 'unknown';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appView, setAppView] = useState<AppView>('ONBOARDING');
  const [previousView, setPreviousView] = useState<AppView | null>(null); // Track history for back button
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTeams, setUserTeams] = useState<TeamSummary[]>([]);
  
  // Active Team State
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<Team>(MOCK_TEAM);
  
  const telegramOffsetRef = useRef<number>(0);

  // 1. INITIAL CHECK
  useEffect(() => {
    const onb = localStorage.getItem('nazir_onboarding_done');
    const cachedChatId = localStorage.getItem('nazir_chat_id');

    if (onb) {
      if (cachedChatId) {
        // Attempt Auto-Login
        fbApi.getUser(cachedChatId).then(async (user) => {
          if (user && user.id) {
            setCurrentUser(user);
            await fetchUserTeamsList(user);
            setAppView('TEAM_SELECTION');
          } else {
            setAppView('AUTH');
          }
        }).catch(() => setAppView('AUTH'));
      } else {
        setAppView('AUTH');
      }
    } else {
      setAppView('ONBOARDING');
    }
  }, []);

  // Helper: Fetch the grid of teams for a user
  const fetchUserTeamsList = async (user: User) => {
    // Initialize empty if undefined
    if (!user.joinedTeams) {
      setUserTeams([]);
      return;
    }
    const teamIds = Object.keys(user.joinedTeams);
    if (teamIds.length === 0) {
      setUserTeams([]);
      return;
    }
    const summaries = await fbApi.getUserTeams(teamIds);
    setUserTeams(summaries);
  };

  // --- DATA POLLING (Active Team) ---
  const refreshTeamData = async (channelId: string) => {
    if (!channelId) return;
    const data = await fbApi.getTeamData(channelId);
    if (data) {
      setTasks(data.tasks);
      setAppConfig(data.config);
      setTeam(prev => ({
        ...prev,
        id: channelId,
        members: data.members,
        name: data.info.name || prev.name,
        image: data.info.image || prev.image
      }));
      
      // Update local user from this team's context (for score)
      if (currentUser) {
        const freshUser = data.members.find(m => m.telegramChatId === currentUser.telegramChatId);
        if (freshUser) setCurrentUser(prev => ({...prev!, reputationScore: freshUser.reputationScore}));
      }
    }
  };

  useEffect(() => {
    if (appView === 'MAIN_APP' && appConfig?.channelId) {
      const interval = setInterval(() => refreshTeamData(appConfig.channelId), 5000); 
      return () => clearInterval(interval);
    }
  }, [appView, appConfig]);


  // --- ACTIONS ---

  const completeOnboarding = () => {
    localStorage.setItem('nazir_onboarding_done', 'true');
    setAppView('AUTH');
  };

  const signOut = () => {
    localStorage.removeItem('nazir_chat_id');
    setCurrentUser(null);
    setUserTeams([]);
    setAppConfig(null);
    setTeam(MOCK_TEAM);
    setTasks([]);
    setAppView('AUTH');
  };

  const openAbout = () => {
    if (appView !== 'ABOUT') {
      setPreviousView(appView);
      setAppView('ABOUT');
    }
  };

  const goBack = () => {
    if (previousView) {
      setAppView(previousView);
      setPreviousView(null);
    } else {
      // Fallback default
      setAppView(currentUser ? 'TEAM_SELECTION' : 'AUTH');
    }
  };

  const registerUser = async (name: string, handle: string, chatId: string) => {
    // 1. Check if exists in Global DB
    const existingUser = await fbApi.getUser(chatId);
    
    let userToLogin: User;

    // LOGIC FIX: If user exists, prioritize DATABASE data over FORM data.
    if (existingUser) {
      userToLogin = { 
        ...existingUser, 
        id: chatId, 
        telegramChatId: chatId,
        name: existingUser.name || name, 
        telegramHandle: existingUser.telegramHandle || handle,
        avatar: existingUser.avatar || `https://ui-avatars.com/api/?name=${name}&background=d69e2e&color=1a1a1a`,
        role: existingUser.role || 'MEMBER',
        reputationScore: existingUser.reputationScore !== undefined ? existingUser.reputationScore : 50,
        joinedTeams: existingUser.joinedTeams || {}
      }; 
    } else {
       // New User Registration
       userToLogin = {
        id: chatId,
        name,
        telegramHandle: handle,
        telegramChatId: chatId,
        role: 'MEMBER', // Default
        avatar: `https://ui-avatars.com/api/?name=${name}&background=d69e2e&color=1a1a1a`,
        reputationScore: 50,
        joinedTeams: {}
      };
    }

    // Save/Update to Global Users
    await fbApi.registerUser(userToLogin);
    
    setCurrentUser(userToLogin);
    localStorage.setItem('nazir_chat_id', chatId);
    
    await fetchUserTeamsList(userToLogin);
    setAppView('TEAM_SELECTION');
  };

  const updateUserProfile = async (name: string, avatarFile?: File) => {
    if (!currentUser || !currentUser.id) return;

    let finalAvatar = currentUser.avatar;
    
    // 1. Upload Image if provided
    if (avatarFile) {
        const hostedUrl = await uploadToImgBB(avatarFile);
        if (hostedUrl) finalAvatar = hostedUrl;
    }

    // 2. Update Local State Immediately
    const updatedUser = { ...currentUser, name, avatar: finalAvatar };
    setCurrentUser(updatedUser);

    // Update Current Team Members list locally
    setTeam(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === currentUser.id ? { ...m, name, avatar: finalAvatar } : m)
    }));

    // 3. Update Global DB
    await fbApi.updateGlobalProfile(currentUser.id, { name, avatar: finalAvatar });

    // 4. Update All Teams (So other teams see new profile)
    if (currentUser.joinedTeams) {
        const teamIds = Object.keys(currentUser.joinedTeams);
        for (const teamId of teamIds) {
            await fbApi.updateMemberProfile(teamId, currentUser.id, { name, avatar: finalAvatar });
        }
    }
  };

  const createTeam = async (token: string, channelId: string, name: string, image: string) => {
    if (!currentUser || !currentUser.telegramChatId) return;

    const config: AppConfig = { botToken: token, channelId };
    
    // 1. Check if User has Real Avatar via this new token
    let finalUser = { ...currentUser, role: 'ADMIN' as const }; // Creator is Admin
    // Note: We just use the direct URL here as the token is part of this new team config
    const photoUrl = await getTelegramPhotoUrl(token, currentUser.telegramChatId);
    if (photoUrl) finalUser.avatar = photoUrl;

    // 2. Save Team Info
    await fbApi.saveConfig(channelId, config);
    await fbApi.saveTeamInfo(channelId, { id: channelId, name: name, image: image });
    
    // 3. Add User to Team Members
    await fbApi.saveMember(channelId, finalUser);

    // 4. Link User to Team (Global)
    await fbApi.linkUserToTeam(currentUser.telegramChatId, channelId);
    
    // Update local user state immediately so exit works
    const updatedUser = { 
        ...currentUser, 
        joinedTeams: { ...(currentUser.joinedTeams || {}), [sanitizeId(channelId)]: true } 
    };
    setCurrentUser(updatedUser);

    // 5. Update Context and Enter
    await selectTeam(channelId);
  };

  const joinTeamById = async (channelId: string): Promise<boolean> => {
     if (!currentUser || !currentUser.telegramChatId) return false;
     
     // Check if team exists
     const data = await fbApi.getTeamData(channelId);
     if (!data) return false;

     // Add user to team members
     const newUserMember = { ...currentUser, role: 'MEMBER' as const, reputationScore: 50 };
     await fbApi.saveMember(channelId, newUserMember);
     
     // Link globally
     await fbApi.linkUserToTeam(currentUser.telegramChatId, channelId);
     
     // Update local user state immediately
     const updatedUser = { 
        ...currentUser, 
        joinedTeams: { ...(currentUser.joinedTeams || {}), [sanitizeId(channelId)]: true } 
     };
     setCurrentUser(updatedUser);

     await selectTeam(channelId);
     return true;
  };

  const selectTeam = async (channelId: string) => {
    // Load Data
    const data = await fbApi.getTeamData(channelId);
    if (data) {
      setAppConfig(data.config);
      setTeam({ id: channelId, name: data.info.name, members: data.members, image: data.info.image });
      setTasks(data.tasks);
      
      // Sync current user score from this team
      if (currentUser) {
        const me = data.members.find(m => m.telegramChatId === currentUser.telegramChatId);
        if (me) setCurrentUser(me);
      }

      setAppView('MAIN_APP');
    }
  };

  const exitTeam = () => {
    setAppConfig(null);
    setTasks([]);
    // Refresh team list in case user was added to new teams while inside
    if (currentUser) fetchUserTeamsList(currentUser);
    setAppView('TEAM_SELECTION');
  };

  // --- TASK MANAGEMENT ---
  
  const updateUserScore = async (userId: string, points: number, reason: string) => {
    if (!appConfig?.channelId) return;
    
    // Local Optimistic
    setTeam(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === userId ? { ...m, reputationScore: m.reputationScore + points } : m)
    }));
    
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, reputationScore: prev.reputationScore + points } : null);
    }

    const member = team.members.find(m => m.id === userId);
    if (member) {
       const newScore = member.reputationScore + points;
       await fbApi.updateMemberScore(appConfig.channelId, userId, newScore);
       if (appConfig.botToken) {
         notifyScoreChange(appConfig.botToken, appConfig.channelId, member, points, reason);
       }
    }
  };

  const addTask = async (task: Task) => {
    // GUARD: Only Admin can add tasks
    if (currentUser?.role !== 'ADMIN') {
        alert('يا ناصح! "شد ودان" بس هو اللي بيحط الواجبات.');
        return;
    }

    if (!appConfig?.channelId) {
        console.error("Cannot add task: Missing Channel ID");
        return;
    }

    // Check for Past Deadline Immediately
    const now = new Date();
    const deadline = new Date(task.deadline);
    const isLate = deadline.getTime() < now.getTime();

    const finalTask: Task = {
        ...task,
        status: isLate ? TaskStatus.OVERDUE : TaskStatus.PENDING
    };

    setTasks(prev => [finalTask, ...prev]);
    
    await fbApi.saveTask(appConfig.channelId, finalTask);

    if (appConfig.botToken) {
        const assignee = team.members.find(m => m.id === task.assigneeId);
        notifyNewTask(appConfig.botToken, appConfig.channelId, finalTask, assignee);
        if (assignee && assignee.telegramChatId) {
          notifyNewTask(appConfig.botToken, assignee.telegramChatId, finalTask, assignee, true);
        }
    }
    
    // Apply Penalty Immediately if created with past date (outside of bot token check to be safe)
    if (isLate) {
       const penalty = POINTS_SYSTEM.PENALTY[finalTask.severity];
       if (finalTask.assigneeId) {
           updateUserScore(finalTask.assigneeId, penalty, `بداية متعثرة (ديدلاين قديم): ${finalTask.title}`);
       }
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!appConfig?.channelId) return;
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;
    const updatedTask = { ...targetTask, status };
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    await fbApi.saveTask(appConfig.channelId, updatedTask);

    if (status === TaskStatus.COMPLETED || status === TaskStatus.RESOLVED) {
       const points = POINTS_SYSTEM.COMPLETION[updatedTask.severity] || 10;
       updateUserScore(updatedTask.assigneeId, points, `إنجاز مهمة: ${updatedTask.title}`);
    }
  };

  const assignForfeits = async (taskId: string, forfeits: Forfeit[]) => {
    if (!appConfig?.channelId) return;
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const updatedTask = { 
      ...targetTask, 
      generatedForfeits: forfeits, 
      status: TaskStatus.JUDGEMENT_PENDING,
      judgementPublished: true 
    };

    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    await fbApi.saveTask(appConfig.channelId, updatedTask);

    // Immediate Notification (Automatic Publish)
    const assignee = team.members.find(m => m.id === updatedTask.assigneeId);
    notifyJudgementCandidates(appConfig.botToken, appConfig.channelId, updatedTask, forfeits, assignee);
    if (assignee && assignee.telegramChatId) {
       notifyJudgementCandidates(appConfig.botToken, assignee.telegramChatId, updatedTask, forfeits, assignee);
    }
  };

  const selectForfeit = async (taskId: string, forfeitId: string) => {
    if (!appConfig?.channelId) return;
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask || !targetTask.generatedForfeits) return;
    const selected = targetTask.generatedForfeits.find(f => f.id === forfeitId);
    if (!selected) return;

    const updatedTask = { ...targetTask, selectedForfeit: selected, status: TaskStatus.FORFEIT_ASSIGNED };
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    await fbApi.saveTask(appConfig.channelId, updatedTask);
    
    const assignee = team.members.find(m => m.id === updatedTask.assigneeId);
    notifyJudgement(appConfig.botToken, appConfig.channelId, updatedTask, selected, assignee);
    if (assignee && assignee.telegramChatId) {
      notifyJudgement(appConfig.botToken, assignee.telegramChatId, updatedTask, selected, assignee);
    }
  };

  const submitProof = async (taskId: string, proofUrl: string) => {
    if (!appConfig?.channelId) return;
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;
    const updatedTask = { ...targetTask, proofUrl, status: TaskStatus.RESOLVED };
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    await fbApi.saveTask(appConfig.channelId, updatedTask);
    
    updateUserScore(targetTask.assigneeId, POINTS_SYSTEM.REDEMPTION, `تكفير عن الذنب: ${targetTask.title}`);
    
    const assignee = team.members.find(m => m.id === targetTask.assigneeId);
    notifyResolution(appConfig.botToken, appConfig.channelId, updatedTask, assignee);
    if (assignee && assignee.telegramChatId) {
      notifyResolution(appConfig.botToken, assignee.telegramChatId, updatedTask, assignee);
    }
  };

  const deleteTask = async (taskId: string) => {
    // GUARD: Only Admin can delete tasks
    if (currentUser?.role !== 'ADMIN') {
        alert('عايز تزور في الدفاتر؟ "شد ودان" بس اللي بيمسح.');
        return;
    }
    if (!appConfig?.channelId) return;

    const taskToDelete = tasks.find(t => t.id === taskId);

    // 1. OPTIMISTIC UPDATE: Remove from Local State immediately
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    // 2. Handle Side Effects (DB & Scoring) asynchronously
    try {
        // A. Delete from Firebase
        await fbApi.deleteTask(appConfig.channelId, taskId);

        // B. Revert Points (Fully Cleaned)
        if (taskToDelete) {
            let pointsToRevert = 0;
            let reason = '';

            // Case A: Bad Task (Overdue/Judgement/Forfeit) -> User lost points -> Give them back
            if (taskToDelete.status === TaskStatus.OVERDUE || 
                taskToDelete.status === TaskStatus.JUDGEMENT_PENDING || 
                taskToDelete.status === TaskStatus.FORFEIT_ASSIGNED) {
                
                const penalty = POINTS_SYSTEM.PENALTY[taskToDelete.severity] || -15;
                pointsToRevert = Math.abs(penalty);
                reason = `رفع ظلم (مسح مهمة): ${taskToDelete.title}`;
            }
            // Case B: Resolved Task (Penalty + Redemption) -> Revert Both
            else if (taskToDelete.status === TaskStatus.RESOLVED) {
                const penalty = POINTS_SYSTEM.PENALTY[taskToDelete.severity] || -15;
                const redemption = POINTS_SYSTEM.REDEMPTION || 15;
                pointsToRevert = Math.abs(penalty) - redemption;
                reason = `إلغاء مهمة (تسوية شاملة): ${taskToDelete.title}`;
            }
            // Case C: Completed Task (Positive Reward) -> Revert Reward
            else if (taskToDelete.status === TaskStatus.COMPLETED) {
                const reward = POINTS_SYSTEM.COMPLETION[taskToDelete.severity] || 10;
                pointsToRevert = -reward;
                reason = `إلغاء مهمة (سحب نقاط): ${taskToDelete.title}`;
            }

            // Only update if there is a score change
            if (pointsToRevert !== 0) {
                await updateUserScore(taskToDelete.assigneeId, pointsToRevert, reason);
            }
        }
    } catch (err) {
        console.error("Failed to delete task cleanly from DB/Score:", err);
    }
  };

  const addMember = async (name: string, handle: string, chatId: string) => {
    let avatar = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    
    if (appConfig?.botToken && chatId) {
      try {
        // 1. Fetch Telegram URL (Attempt multiple methods via service)
        const telegramUrl = await getTelegramPhotoUrl(appConfig.botToken, chatId);
        
        if (telegramUrl) {
            // 2. Attempt to upload to ImgBB for permanent storage
            try {
                // Fetch the blob through proxy
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(telegramUrl)}&disableCache=true`;
                const res = await fetch(proxyUrl);
                
                if (res.ok) {
                  const blob = await res.blob();
                  const file = new File([blob], `avatar_${chatId}.jpg`, { type: "image/jpeg" });
                  
                  const hostedUrl = await uploadToImgBB(file);
                  if (hostedUrl) {
                      avatar = hostedUrl;
                  } else {
                      avatar = telegramUrl; 
                  }
                } else {
                   avatar = telegramUrl; 
                }
            } catch (e) {
                avatar = telegramUrl;
            }
        }
      } catch (e) {
        console.error("Error fetching telegram avatar", e);
      }
    }

    const newMember: User = {
      id: chatId,
      name,
      telegramHandle: handle.startsWith('@') ? handle : `@${handle}`,
      telegramChatId: chatId,
      role: 'MEMBER',
      avatar,
      reputationScore: 50
    };
    
    setTeam(prev => ({ ...prev, members: [...prev.members, newMember] }));
    if (appConfig?.channelId) {
       await fbApi.saveMember(appConfig.channelId, newMember);
       await fbApi.linkUserToTeam(chatId, appConfig.channelId);
    }
  };

  // --- WATCHERS ---
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        const deadline = new Date(task.deadline);
        const isOverdue = deadline < now;
        const isActiveStatus = task.status === TaskStatus.PENDING || task.status === TaskStatus.IN_PROGRESS;
        
        if (isOverdue && isActiveStatus && appConfig?.channelId) {
            // Logic for tasks that become overdue AFTER creation
            const updatedTask = { ...task, status: TaskStatus.OVERDUE };
            updateTaskStatus(task.id, TaskStatus.OVERDUE);
            const penaltyPoints = POINTS_SYSTEM.PENALTY[task.severity];
            updateUserScore(task.assigneeId, penaltyPoints, `تأخير تسليم مهمة: ${task.title}`);
        }
      });
    };
    if (appView === 'MAIN_APP') {
       checkOverdueTasks();
       const intervalId = setInterval(checkOverdueTasks, 30000); 
       return () => clearInterval(intervalId);
    }
  }, [tasks, appConfig, appView]); 

  useEffect(() => {
    const pollTelegram = async () => {
      const judgementPendingTasks = tasks.filter(t => t.status === TaskStatus.JUDGEMENT_PENDING && t.judgementPublished);
      if (judgementPendingTasks.length === 0 || !appConfig) return;

      const updates = await getTelegramUpdates(appConfig.botToken, telegramOffsetRef.current + 1);
      
      if (updates.length > 0) {
        updates.forEach((update: any) => {
          telegramOffsetRef.current = update.update_id;
          if (update.message && update.message.text) {
            const text = update.message.text.trim();
            const senderHandle = update.message.from.username ? `@${update.message.from.username}` : null;
            const senderChatId = update.message.chat.id;

            const userTask = judgementPendingTasks.find(t => {
               const assignee = team.members.find(m => m.id === t.assigneeId);
               return assignee && (assignee.telegramHandle === senderHandle || assignee.telegramChatId === String(senderChatId));
            });

            if (userTask && userTask.generatedForfeits) {
              if (text === '1') selectForfeit(userTask.id, userTask.generatedForfeits[0].id);
              else if (text === '2') selectForfeit(userTask.id, userTask.generatedForfeits[1].id);
              else notifyInvalidSelection(appConfig.botToken, String(senderChatId));
            }
          }
        });
      }
    };
    if (appView === 'MAIN_APP') {
      const intervalId = setInterval(pollTelegram, 3000);
      return () => clearInterval(intervalId);
    }
  }, [tasks, appConfig, team.members, appView]);


  return (
    <AppContext.Provider value={{
      appView, currentUser, userTeams, appConfig, team, tasks,
      completeOnboarding, registerUser, createTeam, joinTeamById, selectTeam, exitTeam, signOut, openAbout, goBack,
      addTask, updateTaskStatus, assignForfeits, selectForfeit, submitProof, deleteTask, addMember, updateUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};