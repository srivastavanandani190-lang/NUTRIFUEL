import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { FoodExplorer } from '@/components/dashboard/FoodExplorer';
import { Planner } from '@/components/dashboard/Planner';
import { Profile } from '@/components/dashboard/Profile';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('explorer');
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const username = profile?.username ?? 'User';

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} username={username}>
      {activeTab === 'explorer' && <FoodExplorer />}
      {activeTab === 'planner' && <Planner />}
      {activeTab === 'exercise' && <Planner initialMode="exercise" />}
      {activeTab === 'profile' && <Profile />}
    </DashboardLayout>
  );
};

export default Dashboard;
