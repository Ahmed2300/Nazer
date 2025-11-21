import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { JudgementHall } from './components/JudgementHall';
import { TeamList } from './components/TeamList';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { Setup } from './components/Setup';
import { TeamSelection } from './components/TeamSelection';
import { AboutShadWdan } from './components/AboutShadWdan';

function AppContent() {
   const { appView, completeOnboarding, registerUser, createTeam, exitTeam } = useApp();
   const [activeTab, setActiveTab] = useState('dashboard');
   const [isCreatingTeam, setIsCreatingTeam] = useState(false);

   if (appView === 'ABOUT') return <AboutShadWdan />;
   if (appView === 'ONBOARDING') return <Onboarding onComplete={completeOnboarding} />;
   if (appView === 'AUTH') return <Auth onRegister={registerUser} />;
   
   if (appView === 'TEAM_SELECTION') {
       if (isCreatingTeam) {
           return <Setup onSaveConfig={createTeam} onCancel={() => setIsCreatingTeam(false)} />;
       }
       return <TeamSelection onCreateNew={() => setIsCreatingTeam(true)} />;
   }

   return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onExitTeam={exitTeam}>
      {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'tasks': return <TaskList />;
            case 'judgement': return <JudgementHall />;
            case 'team': return <TeamList />;
            default: return <Dashboard />;
          }
      })()}
    </Layout>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;