interface ProgressBarProps {
  label: string;
  value: number;
}

export default function ProgressBar({ label, value }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  // Styles grouped into a clear object
  const progressStyle = {
    wrapper: 'w-full mb-5',
    labelContainer: 'flex justify-between items-center mb-2',
    labelName: 'text-sm font-semibold text-gray-700',
    labelValue: 'text-sm text-gray-400',
    track:
      'w-full h-2.5 bg-[var(--color-primary-soft)] rounded-full overflow-hidden',
    // Fill bar with smooth animation
    fill: {
      width: `${percentage}%`,
      height: '100%',
      background: 'var(--color-purple)',
      borderRadius: '999px',
      transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  return (
    <div className={progressStyle.wrapper}>
      <div className={progressStyle.labelContainer}>
        <span className={progressStyle.labelName}>{label}</span>
        <span className={progressStyle.labelValue}>{value}%</span>
      </div>

      <div className={progressStyle.track}>
        <div style={progressStyle.fill} />
      </div>
    </div>
  );
}
