import { Header } from '../../../components/ui/Header';
import { PageContainer } from '../../../components/ui/PageContainer';
import ActivityLog from './ActivityLog';
import UserSkillMap from './userSkillmap';

export default function ProfilePage() {
  return (
    <PageContainer>
      <Header />
      <main className="w-full px-6 md:px-12 lg:px-20 py-6 md:py-10 space-y-6 md:space-y-8">
        <UserSkillMap />
        <ActivityLog />
      </main>
    </PageContainer>
  );
}
