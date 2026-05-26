import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Text as SvgText, Line, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import {
  adminBase,
  adminSurface,
  adminSurfaceAlt,
  adminBorderSubtle,
  adminBorderDefault,
  adminTextPrimary,
  adminTextMuted,
  adminTextSecondary,
  adminSuccess,
  adminWarning,
  adminDanger,
  adminBlue300,
  adminBlue500,
  adminCyan500,
  adminNeutral,
} from '@/constants/adminColors';
import { mockAnalyticsData } from '@/data/mockAdminData';
import { useAdminStore } from '@/store/useAdminStore';
import DotGridBackground from '@/components/admin/DotGridBackground';

type DateRange = '7D' | '30D' | '90D' | 'All';

const DATE_RANGES: DateRange[] = ['7D', '30D', '90D', 'All'];

const DONUT_SEGMENTS = [
  { key: 'verified', label: 'Verified', color: adminSuccess },
  { key: 'pending', label: 'Pending', color: adminWarning },
  { key: 'rejected', label: 'Rejected', color: adminDanger },
  { key: 'unverified', label: 'Unverified', color: adminNeutral },
] as const;

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function MetricMini({
  icon,
  iconColor,
  value,
  label,
}: {
  icon: string;
  iconColor: string;
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.metricMini}>
      <View style={[styles.metricIcon, { backgroundColor: iconColor + '1F' }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function BarChart({ data }: { data: typeof mockAnalyticsData.verificationsByDay }) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 40 - 32; // screen - padding - card padding
  const chartHeight = 140;
  const barGroupWidth = chartWidth / data.length;
  const barWidth = Math.min(20, barGroupWidth * 0.35);
  const gap = 4;
  const maxVal = Math.max(...data.map((d: { approved: number; rejected: number }) => d.approved + d.rejected)) || 1;
  const yPad = 20;
  const barMaxHeight = chartHeight - yPad;

  return (
    <View style={styles.chartCard}>
      <SectionLabel title="DAILY DECISIONS (7 DAYS)" />
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: adminSuccess }]} />
          <Text style={styles.legendText}>Approved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: adminDanger }]} />
          <Text style={styles.legendText}>Rejected</Text>
        </View>
      </View>
      <Svg width={chartWidth} height={chartHeight + 24}>
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = yPad + barMaxHeight * (1 - t);
          return (
            <Line
              key={i}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          );
        })}

        {data.map((day: { approved: number; rejected: number; day: string }, i: number) => {
          const groupX = i * barGroupWidth + barGroupWidth / 2;
          const approvedH = (day.approved / maxVal) * barMaxHeight;
          const rejectedH = (day.rejected / maxVal) * barMaxHeight;
          const approvedX = groupX - barWidth - gap / 2;
          const rejectedX = groupX + gap / 2;

          return (
            <G key={i}>
              {/* Approved bar */}
              <Rect
                x={approvedX}
                y={yPad + barMaxHeight - approvedH}
                width={barWidth}
                height={approvedH}
                rx={3}
                fill={adminSuccess}
                opacity={0.85}
              />
              {/* Rejected bar */}
              <Rect
                x={rejectedX}
                y={yPad + barMaxHeight - rejectedH}
                width={barWidth}
                height={rejectedH}
                rx={3}
                fill={adminDanger}
                opacity={0.75}
              />
              {/* Day label */}
              <SvgText
                x={groupX}
                y={chartHeight + 18}
                fill={adminTextMuted}
                fontSize={9}
                textAnchor="middle"
                fontFamily="PlusJakartaSans_400Regular"
              >
                {day.day}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

type StatusEntry = { status: string; count: number; percentage: number };

function DonutChart({
  breakdown,
}: {
  breakdown: StatusEntry[];
}) {
  const total = breakdown.reduce((sum, s) => sum + s.count, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const cx = 80;
  const cy = 80;
  const segmentData = DONUT_SEGMENTS.map((s) => {
    const found = breakdown.find((b) => b.status === s.key);
    const count = found?.count ?? 0;
    return { ...s, count, pct: total > 0 ? count / total : 0 };
  });

  let cumulativeOffset = 0;

  return (
    <View style={styles.donutCard}>
      <SectionLabel title="STATUS BREAKDOWN" />
      <View style={styles.donutRow}>
        <Svg width={160} height={160}>
          {/* Track */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={adminBorderDefault}
            strokeWidth={18}
          />
          {segmentData.map((seg) => {
            const dashLen = seg.pct * circumference;
            const dashGap = circumference - dashLen;
            const rotation = -90 + cumulativeOffset * 360;
            cumulativeOffset += seg.pct;
            return (
              <Circle
                key={seg.key}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={18}
                strokeDasharray={`${dashLen} ${dashGap}`}
                strokeDashoffset={0}
                transform={`rotate(${rotation}, ${cx}, ${cy})`}
                opacity={0.9}
              />
            );
          })}
          {/* Center text */}
          <SvgText
            x={cx}
            y={cy - 6}
            fill={adminTextPrimary}
            fontSize={20}
            fontWeight="700"
            textAnchor="middle"
            fontFamily="Fraunces_700Bold"
          >
            {total}
          </SvgText>
          <SvgText
            x={cx}
            y={cy + 12}
            fill={adminTextMuted}
            fontSize={9}
            textAnchor="middle"
            fontFamily="PlusJakartaSans_400Regular"
          >
            TOTAL
          </SvgText>
        </Svg>

        <View style={styles.donutLegend}>
          {segmentData.map((seg) => (
            <View key={seg.key} style={styles.donutLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.donutLegendLabel}>{seg.label}</Text>
                <Text style={styles.donutLegendCount}>{seg.count}</Text>
              </View>
              <Text style={[styles.donutLegendPct, { color: seg.color }]}>
                {total > 0 ? Math.round(seg.pct * 100) : 0}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function SuburbTable({ suburbs }: { suburbs: typeof mockAnalyticsData.topSuburbs }) {
  return (
    <View style={styles.tableCard}>
      <SectionLabel title="TOP SUBURBS" />
      {suburbs.map((suburb, i) => (
        <View
          key={suburb.suburb}
          style={[
            styles.tableRow,
            { backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' },
          ]}
        >
          <Text style={styles.tableRank}>{i + 1}</Text>
          <Text style={styles.tableSuburb}>{suburb.suburb}</Text>
          <View style={styles.tableBarWrap}>
            <View
              style={[
                styles.tableBarFill,
                {
                  width: `${(suburb.count / (suburbs[0]?.count || 1)) * 100}%`,
                  backgroundColor: adminBlue300,
                },
              ]}
            />
          </View>
          <Text style={styles.tableCount}>{suburb.count}</Text>
        </View>
      ))}
    </View>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const stats = useAdminStore((s) => s.stats);
  const [dateRange, setDateRange] = useState<DateRange>('7D');

  const approvalRate = useMemo(() => {
    const v = mockAnalyticsData.statusBreakdown.find((s) => s.status === 'verified')?.count ?? 0;
    const r = mockAnalyticsData.statusBreakdown.find((s) => s.status === 'rejected')?.count ?? 0;
    const total = v + r;
    return total > 0 ? Math.round((v / total) * 100) : 0;
  }, []);

  return (
    <View style={styles.container}>
      <DotGridBackground />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Ionicons name="bar-chart-outline" size={20} color={adminTextMuted} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date range pills */}
        <View style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>PERIOD</Text>
          {DATE_RANGES.map((r) => {
            const active = dateRange === r;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.rangePill, active && styles.rangePillActive]}
                onPress={() => setDateRange(r)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rangePillText, { color: active ? adminBlue300 : adminTextMuted }]}>
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Metric mini-cards */}
        <View style={styles.metricsGrid}>
          <MetricMini
            icon="time-outline"
            iconColor={adminWarning}
            value={stats.pendingCount}
            label="Pending"
          />
          <MetricMini
            icon="checkmark-circle-outline"
            iconColor={adminSuccess}
            value={stats.totalVerified}
            label="Verified"
          />
          <MetricMini
            icon="trending-up-outline"
            iconColor={adminBlue300}
            value={`${approvalRate}%`}
            label="Approval Rate"
          />
          <MetricMini
            icon="close-circle-outline"
            iconColor={adminDanger}
            value={mockAnalyticsData.statusBreakdown.find((s) => s.status === 'rejected')?.count ?? 0}
            label="Rejected"
          />
        </View>

        {/* Bar chart */}
        <BarChart data={mockAnalyticsData.verificationsByDay} />

        {/* Donut chart */}
        <DonutChart breakdown={mockAnalyticsData.statusBreakdown} />

        {/* Suburbs table */}
        <SuburbTable suburbs={mockAnalyticsData.topSuburbs} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminBase },
  header: {
    backgroundColor: adminSurface,
    borderBottomWidth: 1,
    borderBottomColor: adminBorderSubtle,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 24,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingBottom: 20 },

  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  rangeLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 9,
    color: adminTextMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginRight: 4,
    includeFontPadding: false,
  },
  rangePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: adminBorderDefault,
  },
  rangePillActive: {
    backgroundColor: adminBlue300 + '1F',
    borderColor: adminBlue300 + '55',
  },
  rangePillText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    includeFontPadding: false,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  metricMini: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: adminSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    padding: 14,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 24,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  metricLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 4,
    includeFontPadding: false,
  },

  sectionLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: adminTextMuted,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 14,
    includeFontPadding: false,
  },

  chartCard: {
    marginHorizontal: 20,
    backgroundColor: adminSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    padding: 16,
    marginBottom: 14,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: adminTextSecondary,
    includeFontPadding: false,
  },

  donutCard: {
    marginHorizontal: 20,
    backgroundColor: adminSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    padding: 16,
    marginBottom: 14,
  },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  donutLegend: { flex: 1, gap: 10 },
  donutLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  donutLegendLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: adminTextSecondary,
    includeFontPadding: false,
  },
  donutLegendCount: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  donutLegendPct: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    includeFontPadding: false,
  },

  tableCard: {
    marginHorizontal: 20,
    backgroundColor: adminSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 10,
    borderRadius: 6,
  },
  tableRank: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: adminTextMuted,
    width: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },
  tableSuburb: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: adminTextPrimary,
    flex: 1,
    includeFontPadding: false,
  },
  tableBarWrap: {
    width: 80,
    height: 6,
    backgroundColor: adminBorderDefault,
    borderRadius: 3,
    overflow: 'hidden',
  },
  tableBarFill: {
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
  tableCount: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: adminBlue300,
    width: 24,
    textAlign: 'right',
    includeFontPadding: false,
  },
});
