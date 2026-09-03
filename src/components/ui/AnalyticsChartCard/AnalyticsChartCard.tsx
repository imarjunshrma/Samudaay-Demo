import type { ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BarChart, LineChart, type barDataItem, type lineDataItem } from 'react-native-gifted-charts';

import { Icon, Text } from '@/src/components/ui';
import { colors, shadows, spacing, typography } from '@/src/theme';

export interface AnalyticsChartBar {
  label: string;
  value: number;
  tone?: 'primary' | 'muted';
}

export interface AnalyticsChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  headerRight?: ReactNode;
  bars: AnalyticsChartBar[];
  chartType?: 'bar' | 'line';
}

export function AnalyticsChartCard({
  title,
  subtitle,
  icon = 'insights',
  headerRight,
  bars,
  chartType = 'bar',
}: AnalyticsChartCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const chartHeight = 210;
  const chartBottomInset = chartType === 'line' ? 104 : 96;
  const chartContainerHeight = chartHeight + chartBottomInset;
  const max = Math.max(...bars.map((bar) => bar.value), 1);
  const chartWidth = Math.max(windowWidth - spacing[8] - spacing[10], 220);
  const chartData: barDataItem[] = bars.map((bar) => ({
    value: bar.value,
    label: bar.label,
    frontColor: bar.tone === 'muted' ? '#fed7aa' : colors.primary.DEFAULT,
  }));
  const lineData: lineDataItem[] = bars.map((bar) => ({
    value: bar.value,
    label: bar.label,
    dataPointColor: bar.tone === 'muted' ? '#fb923c' : colors.primary.DEFAULT,
    color: bar.tone === 'muted' ? '#fb923c' : colors.primary.DEFAULT,
  }));

  return (
    <View
      style={{
        borderRadius: 28,
        backgroundColor: '#ffffff',
        padding: spacing[5],
        gap: spacing[4],
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.text.muted}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {headerRight ? headerRight : <Icon name={icon} size={22} color={colors.primary.DEFAULT} />}
      </View>
      <View style={{ minHeight: chartContainerHeight, paddingTop: spacing[2], overflow: 'visible' }}>
        {chartType === 'line' ? (
          <LineChart
            data={lineData}
            height={chartHeight}
            width={chartWidth}
            overflowBottom={56}
            areaChart
            curved
            hideAxesAndRules
            hideYAxisText
            hideRules
            hideOrigin
            hideDataPoints={false}
            dataPointsRadius={4}
            dataPointsColor={colors.primary.DEFAULT}
            dataPointsWidth={8}
            dataPointsHeight={8}
            thickness={3}
            color={colors.primary.DEFAULT}
            startFillColor="rgba(24,168,117,0.22)"
            endFillColor="rgba(24,168,117,0.02)"
            startOpacity={1}
            endOpacity={0.1}
            maxValue={max}
            initialSpacing={12}
            endSpacing={12}
            spacing={Math.max(28, Math.floor(chartWidth / Math.max(lineData.length + 1, 4)))}
            isAnimated={false}
            xAxisLabelsHeight={40}
            xAxisLabelsVerticalShift={2}
            xAxisLabelTextStyle={{
              color: '#94a3b8',
              fontFamily: typography.fontFamily.bold,
              fontSize: 10,
              marginTop: spacing[3],
            }}
            xAxisTextNumberOfLines={1}
          />
        ) : (
          <BarChart
            data={chartData}
            height={chartHeight}
            width={chartWidth}
            maxValue={max}
            xAxisLabelsHeight={40}
            xAxisLabelsVerticalShift={4}
            disablePress
            hideAxesAndRules
            hideYAxisText
            hideRules
            hideOrigin
            barWidth={20}
            spacing={Math.max(12, Math.floor(chartWidth / Math.max(chartData.length * 2, 6)))}
            initialSpacing={12}
            endSpacing={12}
            roundedTop
            roundedBottom={false}
            isAnimated={false}
            xAxisLabelTextStyle={{
              color: colors.text.muted,
              fontFamily: typography.fontFamily.medium,
              fontSize: 10,
              marginTop: spacing[3],
            }}
            xAxisTextNumberOfLines={1}
          />
        )}
      </View>
    </View>
  );
}
