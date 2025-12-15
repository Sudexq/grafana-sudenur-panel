import React, { useMemo, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import { SimpleOptions } from '../types';

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => ({
  wrapper: css`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    font-family: Open Sans, system-ui, sans-serif;
  `,
  content: css`
    width: 100%;
    height: 100%;
    padding: 12px;
  `,
  card: css`
    position: absolute;
    left: 12px;
    bottom: 12px;
    padding: 12px;
    border-radius: 10px;
    max-width: calc(100% - 24px);
    font-size: 13px;
  `,
  pill: css`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
  `,
});

function extractNumericValues(data: Props['data']): number[] {
  const values: number[] = [];
  for (const frame of data.series ?? []) {
    for (const field of frame.fields) {
      if (field.type === 'number') {
        for (const v of field.values as unknown as number[]) {
          if (Number.isFinite(v)) values.push(v);
        }
        break;
      }
    }
  }
  return values;
}

export const SimplePanel: React.FC<Props> = ({
  options,
  data,
  width,
  height,
  fieldConfig,
  id,
}) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const [active, setActive] = useState(false);

  const numericValues = useMemo(() => extractNumericValues(data), [data]);
  const total = useMemo(() => numericValues.reduce((a, b) => a + b, 0), [numericValues]);
  const avg = useMemo(
    () => (numericValues.length ? total / numericValues.length : 0),
    [numericValues, total]
  );

  const insight = useMemo(() => {
    if (!options.enableInsight) return null;
    if (!numericValues.length) return 'Insight: Veri yok';
    if (avg >= 75) return 'Insight: Yüksek seviye';
    if (avg >= 40) return 'Insight: Orta seviye';
    return 'Insight: Düşük seviye';
  }, [options.enableInsight, numericValues.length, avg]);

  if (!data.series || data.series.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} />;
  }

  const accentColor = options.baseColor || theme.colors.primary.main;

  /* 🔥 seriesCountSize mapping */
  const seriesFontSize = {
    sm: 11,
    md: 14,
    lg: 18,
  }[options.seriesCountSize];

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          background: ${theme.colors.background.primary};
          border: 1px solid ${theme.colors.border.weak};
        `
      )}
    >
      <div className={styles.content}>
        {/* ================= DISPLAY MODE ================= */}
        {options.mode === 'circle' && (
          <svg width={width} height={height} onClick={() => setActive(!active)}>
            <circle
              cx={width / 2}
              cy={height / 2}
              r={Math.min(width, height) * 0.25}
              fill={accentColor}
              opacity={active ? 0.35 : 0.15}
            />
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
            >
              Avg: {avg.toFixed(1)}
            </text>
          </svg>
        )}

        {options.mode === 'bars' && (
          <svg width={width} height={height}>
            {numericValues.slice(0, 10).map((v, i) => (
              <rect
                key={i}
                x={20 + i * 25}
                y={height - v}
                width={18}
                height={v}
                fill={accentColor}
              />
            ))}
          </svg>
        )}

        {options.mode === 'text' && (
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {options.text} – Avg: {avg.toFixed(1)}
          </div>
        )}

        {/* ================= INFO CARD ================= */}
        <div
          className={styles.card}
          style={{
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.weak}`,
          }}
        >
          <div
            className={styles.pill}
            style={{ background: accentColor, color: '#fff' }}
          >
            Developed by Sudenur Tilla
          </div>

          {options.showSeriesCount && (
            <div style={{ fontSize: seriesFontSize }}>
              Series count: {data.series.length}
            </div>
          )}

          <div>Total: {total.toFixed(1)}</div>
          {insight && <div style={{ marginTop: 6 }}>{insight}</div>}
        </div>
      </div>
    </div>
  );
};
