import ActivityItem from '../activities/activitiesItem';

interface Activity {
  id: number;
  category: string;
  task: string;
  status: string;
}
interface ThemeConfig {
  activitySection: string;
  activityHeader: string;
  openProjectBtn: string;
  [key: string]: string;
}
interface ActivitySectionProps {
  activities: Activity[];
  theme: ThemeConfig;
}

export default function ActivitySection({
  activities,
  theme,
}: ActivitySectionProps) {
  return (
    <section className={theme.activitySection}>
      <div className={theme.activityHeader}>
        <h3 className="text-xl font-bold text-gray-800">Recent activity</h3>
        <button className={theme.openProjectBtn}>Open project</button>
      </div>

      <div className="flex flex-col gap-2">
        {activities.map((item, index) => (
          <ActivityItem
            key={item.id}
            category={item.category}
            task={item.task}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
