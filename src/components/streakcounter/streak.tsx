interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  const styles = {
    wrapper:
      'flex items-center gap-2 border border-[#f5e6c4] rounded-full px-4 py-1.5 bg-[#FBBF24]/15 shadow-sm hover:scale-105 transition-transform duration-300',
    fireIcon: 'w-5 h-5 text-[#85581A] stroke-[1.75] fill-none animate-pulse', // if want to add a subtle pulsing effect to the fire icon
    text: 'text-sm font-normal text-[#85581A] tracking-wide',
  };

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.fireIcon}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
      </svg>

      <span className={styles.text}>
        {days} {days > 1 ? 'days' : 'day'} streak
      </span>
    </div>
  );
}
