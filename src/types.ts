export type DisplayMode = 'circle' | 'bars' | 'text';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: 'sm' | 'md' | 'lg';
  baseColor: string;
  mode: DisplayMode;
  enableInsight: boolean;
}
