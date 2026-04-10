import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

// Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CreditsProvider } from './context/CreditsContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { CuEngineProvider } from './context/CuEngineContext';
import { MerchEngineProvider } from './context/MerchEngineContext';

// Services
import { initSimulation } from './services/simulationService';

// Layouts
import MainLayout from './layouts/MainLayout';
import ReelityLayout from './layouts/ReelityLayout';
import AIWriterLayout from './layouts/AIWriterLayout';
import AIProducerLayout from './layouts/AIProducerLayout';

// Pages
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ReelityFeedPage from './pages/ReelityFeedPage';
import ReelityStoriesPage from './pages/ReelityStoriesPage';
import ReelityPeoplePage from './pages/ReelityPeoplePage';
import ReelityClubsPage from './pages/ReelityClubsPage';
import RelicsPage from './pages/RelicsPage';
import RelicDetailPage from './pages/RelicDetailPage';
import CollectibleUnitsPage from './pages/CollectibleUnitsPage';
import CollectibleDetailPage from './pages/CollectibleDetailPage';
import FilmPage from './pages/FilmPage';
import MerchandisePage from './pages/MerchandisePage';
import MerchYoursPage from './pages/MerchYoursPage';
import MerchOursPage from './pages/MerchOursPage';
import MerchZywhPage from './pages/MerchZywhPage';
import MerchDesirePage from './pages/MerchDesirePage';
import MerchShelfPage from './pages/MerchShelfPage';
import MerchDetailPage from './pages/MerchDetailPage';
import ProductDetail from './pages/ProductDetail';
import StorySubmissionPage from './pages/StorySubmissionPage';
import TalentPipelinePage from './pages/TalentPipelinePage';
import CommunityGroupPage from './pages/CommunityGroupPage';
import CreatePostPage from './pages/CreatePostPage';
import AIWriterHubPage from './pages/AIWriterHubPage';
import AIWriterHistoryPage from './pages/AIWriterHistoryPage';
import AIWriterWorkflowPage from './pages/AIWriterWorkflowPage';
import AIProducerHubPage from './pages/AIProducerHubPage';
import AIProducerTopUpPage from './pages/AIProducerTopUpPage';
import AIProducerWorkflowPage from './pages/AIProducerWorkflowPage';
import AIAvatarsPage from './pages/AIAvatarsPage';
import AIAvatarAgentPage from './pages/AIAvatarAgentPage';
import LandWorldPage from './pages/LandWorldPage';
import LandMarketplacePage from './pages/LandMarketplacePage';
import SLCPage from './pages/SLCPage';
import SLCDetailPage from './pages/SLCDetailPage';
import SLCSecondaryMarket from './features/slc/SLCSecondaryMarket';
import VerseCardsPage from './features/verse-cards/VerseCardsPage';
import VerseCardMarketplace from './features/verse-cards/VerseCardMarketplace';

import SLLHub from './features/sll/SLLHub';
import SLLTournamentDashboard from './features/sll/SLLTournamentDashboard';
import SLLLeaderboard from './features/sll/SLLLeaderboard';
import SLLMatchDetail from './features/sll/SLLMatchDetail';
import SLLUserStats from './features/sll/SLLUserStats';
import SLLHeritageVault from './features/sll/SLLHeritageVault';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import SplashScreen from './components/SplashScreen';
import DemoMode from './components/DemoMode';

// Route Helpers
function KeyedProfilePage() {
  const { userId } = useParams();
  return <ProfilePage key={userId || 'own'} />;
}

function LegacyFcuFilmRedirect() {
  const { id } = useParams();
  return <Navigate to={`/collectible-units/film/${id}`} replace />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize fake background activity loop
initSimulation();

export default function App({ demoModeOverride = false }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <CartProvider>
              <CreditsProvider>
                <CuEngineProvider>
                  <MerchEngineProvider>
                    <AnimatePresence mode="wait">
                      {showSplash && <SplashScreen key="splash" />}
                    </AnimatePresence>

                    <Router>
                      <Routes>
                        <Route element={<MainLayout />}>
                          <Route path="/" element={<Navigate to="/reelity" replace />} />

                          {/* Reelity Sub-Routes */}
                          <Route path="reelity" element={<ReelityLayout />}>
                            <Route index element={<ReelityFeedPage />} />
                            <Route path="stories" element={<ReelityStoriesPage />} />
                            <Route path="people" element={<ReelityPeoplePage />} />
                            <Route path="clubs" element={<ReelityClubsPage />} />
                            <Route path="clubs/:id" element={<CommunityGroupPage />} />
                          </Route>

                          {/* Legacy & New Pillar Routes */}
                          <Route path="relics" element={<RelicsPage />} />
                          <Route path="relics/:id" element={<RelicDetailPage />} />
                          <Route path="slc" element={<SLCPage />} />
                          <Route path="slc/:id" element={<SLCDetailPage />} />
                          <Route path="slc/marketplace" element={<SLCSecondaryMarket />} />
                          <Route path="verse-cards" element={<VerseCardsPage />} />
                          <Route path="verse-cards/marketplace" element={<VerseCardMarketplace />} />

                          <Route path="sll" element={<SLLHub />} />
                          <Route path="sll/tournament/:tournamentId" element={<SLLTournamentDashboard />} />
                          <Route path="sll/match/:matchId" element={<SLLMatchDetail />} />
                          <Route path="sll/leaderboard" element={<SLLLeaderboard />} />
                          <Route path="sll/stats" element={<SLLUserStats />} />
                          <Route path="sll/vault" element={<SLLHeritageVault />} />
                          
                          {/* Collectible Units */}
                          <Route path="collectible-units" element={<CollectibleUnitsPage />} />
                          <Route path="collectible-units/explore" element={<CollectibleUnitsPage />} />
                          <Route
                            path="collectible-units/create-post"
                            element={
                              <ProtectedRoute>
                                <RoleGuard allowedRoles={['creator', 'professional', 'fan']} fallbackRoute="/collectible-units">
                                  <CreatePostPage />
                                </RoleGuard>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="collectible-units/submit-story"
                            element={
                              <ProtectedRoute>
                                <RoleGuard allowedRoles={['creator', 'professional']} fallbackRoute="/collectible-units">
                                  <StorySubmissionPage />
                                </RoleGuard>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="collectible-units/pipeline"
                            element={
                              <ProtectedRoute>
                                <RoleGuard allowedRoles={['professional']} fallbackRoute="/collectible-units">
                                  <TalentPipelinePage />
                                </RoleGuard>
                              </ProtectedRoute>
                            }
                          />
                          <Route path="collectible-units/drop/:dropId" element={<CollectibleDetailPage />} />
                          <Route path="collectible-units/:category/:id" element={<FilmPage />} />

                          {/* Merchandise */}
                          <Route path="merchandise" element={<MerchandisePage />} />
                          <Route path="merchandise/yours" element={<MerchYoursPage />} />
                          <Route path="merchandise/ours" element={<MerchOursPage />} />
                          <Route path="merchandise/zywh" element={<MerchZywhPage />} />
                          <Route path="merchandise/desire" element={<MerchDesirePage />} />
                          <Route path="merchandise/shelf" element={<MerchShelfPage />} />
                          <Route path="merchandise/detail/:pillar/:id" element={<MerchDetailPage />} />
                          <Route path="merchandise/:id" element={<ProductDetail />} />

                          {/* Profile & Community */}
                          <Route
                            path="profile"
                            element={
                              <ProtectedRoute>
                                <RoleGuard allowedRoles={['fan', 'creator', 'professional']} fallbackRoute="/">
                                  <ProfilePage />
                                </RoleGuard>
                              </ProtectedRoute>
                            }
                          />
                          <Route path="profile/:userId" element={<KeyedProfilePage />} />
                          <Route path="leaderboard" element={<LeaderboardPage />} />

                          {/* Land & Metaverse */}
                          <Route path="land" element={<LandMarketplacePage />} />
                          <Route
                            path="land-world"
                            element={
                              <ProtectedRoute>
                                <LandWorldPage />
                              </ProtectedRoute>
                            }
                          />

                          {/* AI Ecosystem */}
                          <Route path="ai-avatars" element={<AIAvatarsPage />} />
                          <Route path="ai-avatars/agent/:agentId" element={<AIAvatarAgentPage />} />
                          <Route path="ai-writer" element={<AIWriterLayout />}>
                            <Route index element={<AIWriterHubPage />} />
                            <Route path="history" element={<AIWriterHistoryPage />} />
                            <Route path="tool/:toolId" element={<AIWriterWorkflowPage />} />
                          </Route>
                          <Route path="ai-producer" element={<AIProducerLayout />}>
                            <Route index element={<AIProducerHubPage />} />
                            <Route
                              path="top-up"
                              element={
                                <ProtectedRoute>
                                  <AIProducerTopUpPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="tool/:toolId"
                              element={
                                <ProtectedRoute>
                                  <AIProducerWorkflowPage />
                                </ProtectedRoute>
                              }
                            />
                          </Route>

                          {/* Legacy Redirects */}
                          <Route path="fcu" element={<Navigate to="/collectible-units" replace />} />
                          <Route path="fcu/explore" element={<Navigate to="/collectible-units/explore" replace />} />
                          <Route path="fcu/film/:id" element={<LegacyFcuFilmRedirect />} />
                          <Route path="fcu/create-post" element={<Navigate to="/collectible-units/create-post" replace />} />
                          <Route path="fcu/submit-story" element={<Navigate to="/collectible-units/submit-story" replace />} />
                          <Route path="fcu/pipeline" element={<Navigate to="/collectible-units/pipeline" replace />} />
                        </Route>
                      </Routes>
                      {demoModeOverride && <DemoMode autostart={true} />}
                    </Router>
                  </MerchEngineProvider>
                </CuEngineProvider>
              </CreditsProvider>
            </CartProvider>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
