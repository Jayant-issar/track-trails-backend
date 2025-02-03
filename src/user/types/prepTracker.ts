export type PreparationMetricUnit = {
    value: number;
    label: string;
};
  
  export type PreparationMetric = {
    id: string;
    name: string;
    targetPerDay: PreparationMetricUnit;
    progress: {
      date: string;
      achieved: number;
    }[];
    createdAt: string;
};