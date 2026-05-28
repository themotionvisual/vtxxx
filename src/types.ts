export interface VideoStats {
  id: string;
  title: string;
  publishedAt: string;
  views: number;
  ctr: number;
  avd: string;
  revenue: number;
  format: 'shorts' | 'long';
}

export interface MetricSummary {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}
