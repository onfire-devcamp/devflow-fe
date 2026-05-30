interface ContinueLearningCardProps {
  data: {
    id: string;
    title: string;
    moduleName: string;
    moduleHint: string;
    progressPercent: number;
    thumbnailEmoji: string;
  };
}

export const ContinueLearningCard = ({ data }: ContinueLearningCardProps) => {
  return (
    <div>
      <h3>{data.title}</h3>
      <p>{data.moduleName}</p>
      <p>Progress: {data.progressPercent}%</p>
    </div>
  );
};
