interface ActivityProps {
  category: string;
  task: string;
  isLast?: boolean;
}

export default function ActivityItem({
  category,
  task,
  isLast,
}: ActivityProps) {
  const styles = {
    itemWrapper: 'flex gap-4 relative',
    timeline: 'flex flex-col items-center',
    dot: 'w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center z-10',
    line: 'w-[2px] bg-gray-100 flex-grow absolute top-5 left-[9px] h-full', // Đường kẻ nối các task
    content: 'pb-8',
    categoryText:
      'text-[10px] font-bold text-gray-400 uppercase tracking-widest',
    taskText: 'text-sm text-gray-700 font-medium mt-1',
  };

  return (
    <div className={styles.itemWrapper}>
      {/* Cột mốc thời gian (Timeline) */}
      <div className={styles.timeline}>
        <div className={styles.dot}>
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {!isLast && <div className={styles.line} />}
      </div>

      {/* Nội dung text */}
      <div className={styles.content}>
        <p className={styles.categoryText}>{category}</p>
        <h4 className={styles.taskText}>{task}</h4>
      </div>
    </div>
  );
}
