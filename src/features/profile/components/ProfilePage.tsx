import { Header } from '../../../components/ui/Header';
import { PageContainer } from '../../../components/ui/PageContainer';
import ActivityLog from './ActivityLog';
import ProfileCard from './userInfo';
import UserSkillMap from './userSkillmap';
import ContributionHeatmap from './ContributionHeatmap';
import { useAuthStore } from '../../auth/stores/authStore';

export default function ProfilePage() {
  const userId = useAuthStore((state) => state.user?.id);

  return (
    <PageContainer>
      <Header />
      <main className="w-full px-6 md:px-12 lg:px-20 py-6 md:py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <ProfileCard />
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-6 md:space-y-8">
            <ContributionHeatmap />
            <UserSkillMap />
            <ActivityLog userId={userId} />
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
