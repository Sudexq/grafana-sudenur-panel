import { PanelPlugin } from '@grafana/data';
import { SimplePanel } from './components/SimplePanel';
import { DisplayMode, SimpleOptions } from './types';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'text',
      name: 'Text',
      description: 'Shown inside the panel',
      defaultValue: 'Hello from Sudenur Panel',
    })
    .addBooleanSwitch({
      path: 'showSeriesCount',
      name: 'Show series count',
      defaultValue: true,
    })
    .addRadio({
      path: 'seriesCountSize',
      name: 'Series count size',
      defaultValue: 'sm',
      settings: {
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
    })
    .addColorPicker({
      path: 'baseColor',
      name: 'Accent color',
      description: 'Changes the visualization color',
      defaultValue: '#3b82f6',
    })
    .addRadio({
      path: 'mode',
      name: 'Display mode',
      description: 'Switch visualization style',
      defaultValue: 'circle' as DisplayMode,
      settings: {
        options: [
          { value: 'circle', label: 'Circle' },
          { value: 'bars', label: 'Bars' },
          { value: 'text', label: 'Text only' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'enableInsight',
      name: 'Enable smart insight',
      description: 'Shows a simple insight computed from query data (bonus)',
      defaultValue: true,
    });
    
});
