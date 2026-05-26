import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminSuccess,
  adminDanger,
  adminWarning,
  adminBlue500,
  adminNeutral,
  adminTextPrimary,
  adminTextMuted,
  adminBorderSubtle,
} from '@/constants/adminColors';
import { getRelativeTime } from '@/data/mockAdminData';
import { MockActivity } from '@/data/mockAdminData';
import { useSlideEnter } from '@/constants/adminAnimations';

interface ActivityFeedItemProps {
  item: MockActivity;
  index?: number;
  isLast?: boolean;
}

const ACTION_CONFIG: Record<
  MockActivity['action'],
  { bg: string; icon: string; getText: (item: MockActivity) => string }
> = {
  approved:  { bg: adminSuccess,  icon: 'checkmark',               getText: (i) => `Approved ${i.landlordName ?? ''}` },
  rejected:  { bg: adminDanger,   icon: 'close',                   getText: (i) => `Rejected ${i.landlordName ?? ''}` },
  submitted: { bg: adminWarning,  icon: 'cloud-upload-outline',     getText: (i) => `${i.landlordName ?? 'Landlord'} submitted ID` },
  login:     { bg: adminBlue500,  icon: 'shield-checkmark-outline', getText: (i) => `${i.adminName} signed in` },
  viewed:    { bg: adminNeutral,  icon: 'eye-outline',              getText: (i) => `Viewed ${i.landlordName ?? ''} submission` },
};

const ActivityFeedItem = ({ item, index = 0, isLast = false }: ActivityFeedItemProps) => {
  const slideStyle = useSlideEnter(index * 40);
  const config = ACTION_CONFIG[item.action] ?? ACTION_CONFIG.viewed;
  const isActionable = item.action === 'approved' || item.action === 'rejected';

  return (
    <Animated.View style={slideStyle}>
      <View style={styles.row}>
        {/* Icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon as any} size={13} color="#FFFFFF" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.actionText} numberOfLines={2}>
            {config.getText(item)}
          </Text>
          <Text style={styles.timeText}>{getRelativeTime(item.timestamp)}</Text>
        </View>

        {/* Arrow for actionable items */}
        {isActionable && (
          <Ionicons name="arrow-forward-outline" size={12} color={adminTextMuted} />
        )}
      </View>

      {!isLast && <View style={styles.separator} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 10,
  },
  actionText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  timeText: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
  separator: {
    height: 0.5,
    backgroundColor: adminBorderSubtle,
    marginLeft: 60,
  },
});

export default memo(ActivityFeedItem);
