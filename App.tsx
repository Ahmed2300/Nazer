
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

function AppContent() {
  const { appView, completeOnboarding, registerUser, createTeam, exitTeam } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Router Logic
  if (appView === 'ONBOARDING') {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  if (appView === 'AUTH') {
    return <Auth onRegister={registerUser} />;
  }

  if (appView === 'TEAM_SELECTION') {
      return <TeamSelection onCreateNew={() => { /* Trigger state change in child but context handles it differently usually, but here let's pass a prop or update view locally? Actually AppContext createTeam is for SETUP view. */ 
        // We need to force view to Setup manually? Or add a helper in context?
        // Simplest: Add a state to toggle locally if 'createTeam' is clicked, or add 'SETUP' to AppView flow explicitly.
        // In context I added createTeam which takes params.
        // I need to switch view to SETUP.
        // Let's allow AppContext to expose a setAppView or add a 'startTeamCreation' method.
        // Actually, I can just import setAppView if I exported it, but I didn't.
        // Let's cast context or fix logic. 
        // FIX: I will use a dirty hack here by rendering Setup if a local state says so, OR better:
        // Update AppContext to expose "goToSetup".
        // Wait, I see 'SETUP' is an AppView. I need a way to trigger it.
        // I will modify AppContext to export setAppView logic wrapped in a function "startCreateTeam"
      }} />; 
      // WAIT: The TeamSelection component calls 'createTeam' which is the actual API call. It needs to go to the FORM first.
      // Let's look at AppContext again.
  }

  // RETHINKING ROUTING: 
  // Since I can't easily change Context interface without re-outputting file, I will handle the view switching inside AppContent if I can, 
  // OR I will handle the "Create New" button in TeamSelection by passing a prop to a "SetupWrapper".
  
  // Correct Approach:
  // TeamSelection has a button. When clicked, we need to show Setup.
  // But AppView only has ONBOARDING, AUTH, TEAM_SELECTION, SETUP, MAIN_APP.
  // So I need to transition from TEAM_SELECTION -> SETUP.
  // I will use a local wrapper to achieve this cleanly or rely on the fact that I updated AppContext to handle flows. 
  
  // Let's look at my AppContext update. I didn't expose "setAppView". 
  // I will cheat slightly and use a local state to override view if needed, 
  // OR better: I will assume `TeamSelection` component handles the UI state? No.
  
  // LET'S FIX THIS PROPERLY.
  // I will render based on AppView.
  // But how do I trigger setAppView('SETUP') from TeamSelection?
  // I didn't expose it.
  // I will render Setup INSIDE TeamSelection? No.
  
  // I will make `TeamSelection` take `onCreateNew` prop which triggers a local state in AppContent to show Setup?
  // No, AppView drives everything.
  
  // OK, I will add `startTeamCreation` to AppContext in the file update above? 
  // Too late, I already generated the XML for AppContext.
  // Wait, I haven't sent the XML yet. I can edit the AppContext content in the block above before final output?
  // YES. I will add `goToSetup` to AppContext in the previous XML block.
  
  // ... Edited AppContext above to include logic? No, I'll just handle it here via a workaround or edit AppContext now.
  // Actually, I can just pass a specific prop to TeamSelection to tell it what to do.
}

// REAL IMPLEMENTATION:
// I will modify the AppContext content in the XML above to include `goToSetup` before I finalize.
// (Simulated: I added `setAppView` implicitly or I can add `goToSetup` to the interface in the XML block).
// Let's assumes I added `goToSetup: () => setAppView('SETUP')` in AppContext. 
// But I didn't. 

// ALTERNATIVE:
// I will manage the transition logic here in App.tsx by hacking context? No.
// I will use a local state `isCreatingTeam` here.
// If `appView === 'TEAM_SELECTION'` and `isCreatingTeam` is true, show Setup.

function AppContentFixed() {
   const { appView, completeOnboarding, registerUser, createTeam, exitTeam } = useApp();
   const [activeTab, setActiveTab] = useState('dashboard');
   const [isCreatingTeam, setIsCreatingTeam] = useState(false);

   if (appView === 'ONBOARDING') return <Onboarding onComplete={completeOnboarding} />;
   if (appView === 'AUTH') return <Auth onRegister={registerUser} />;
   
   if (appView === 'TEAM_SELECTION') {
       if (isCreatingTeam) {
           return <Setup onSaveConfig={createTeam} onCancel={() => setIsCreatingTeam(false)} />;
       }
       return <TeamSelection onCreateNew={() => setIsCreatingTeam(true)} />;
   }
   
   // appView === 'MAIN_APP' or 'SETUP' (if triggered by context, but we handle setup locally now for creation)
   // Wait, createTeam in context calls selectTeam which sets view to MAIN_APP. So that works.

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
      <AppContentFixed />
    </AppProvider>
  );
};

export default App;
