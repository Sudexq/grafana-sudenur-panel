import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

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
  const [isActive, setIsActive] = useState(false);

  // Handle no data case (real data handling bonus)
  if (data.series.length === 0) {
    return (
      <PanelDataErrorView
        fieldConfig={fieldConfig}
        panelId={id}
        data={data}
        needsStringField
      />
    );
  }

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          background: ${theme.colors.background.primary};
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        `
      )}
    >
      {/* Background Visualization */}
      <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
      >
        <g>
          <circle
            data-testid="simple-panel-circle"
            r={120}
            onClick={() => setIsActive(!isActive)}
            style={{
              fill: isActive
                ? theme.colors.success.main
                : theme.colors.primary.main,
              opacity: 0.2,
              cursor: 'pointer',
              transition: 'fill 0.3s ease',
            }}
          />
        </g>
      </svg>

      {/* Content */}
      <div
        className={styles.textBox}
        style={{
          background: theme.colors.background.secondary,
          borderRadius: '6px',
          padding: '12px',
          maxWidth: '90%',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          Custom Grafana Panel
        </div>

        {options.showSeriesCount && (
          <div
            data-testid="simple-panel-series-counter"
            style={{ fontSize: '13px', marginBottom: '4px' }}
          >
            Number of series: {data.series.length}
          </div>
        )}

        <div style={{ fontSize: '13px', opacity: 0.8 }}>
          Text option value: {options.text}
        </div>

        {/* REQUIRED: Student name visible in panel */}
        <div
          style={{
            marginTop: '10px',
            padding: '4px 8px',
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '12px',
            backgroundColor: theme.colors.primary.main,
            color: theme.colors.primary.contrastText,
          }}
        >
          Developed by Sudenur Tilla
        </div>
      </div>
    </div>
  );
};
