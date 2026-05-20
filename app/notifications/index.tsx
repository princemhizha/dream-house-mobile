import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { AppNotification, getNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/notificationService';
const TYPE_META: Record<AppNotification['type'], { iconName: string; color: string; bg: string }> = {
  property: {
    iconName: 'home-outline',
    color: Colors.emerald500,
    bg: Colors.emeraldMuted,
  },
  system: {
    iconName: 'settings-outline',
    color: Colors.textMuted,
    bg: 'rgba(122,138,126,0.12)',
  },
  promo: {
    iconName: 'diamond-outline',
    color: Colors.gold400,
    bg: Colors.goldMuted,
  },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => null);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllNotificationsRead().catch(() => null);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    markNotificationRead(id).catch(() => null);
  }, []);

  const keyExtractor = useCallback((item: AppNotification) => item.id, []);

  const renderItem = useCallback<ListRenderItem<AppNotification>>(
    ({ item }) => {
      const meta = TYPE_META[item.type];
      return (
        <TouchableOpacity
          style={[styles.item, item.read && styles.itemRead]}
          onPress={() => markRead(item.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.iconName as never} size={18} color={meta.color} />
          </View>
          <View style={styles.itemBody}>
            <View style={styles.itemHeader}>
              <Text
                style={[styles.itemTitle, item.read && styles.itemTitleRead]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.itemMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [markRead]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.8} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
          <Text style={styles.unreadBannerText}>
            {unreadCount === 1 ? '1 unread notification' : `${unreadCount} unread notifications`}
          </Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        initialNumToRender={10}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.textDisabled} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyMessage}>
              We will let you know about new listings and updates here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
  },
  markAllBtn: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
  },
  markAllText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.emerald500,
    letterSpacing: LetterSpacing.wide,
  },
  headerSpacer: {
    width: 80,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.emeraldMuted,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderEmerald,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.emerald500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize['2xs'],
    color: Colors.obsidian,
  },
  unreadBannerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.emerald500,
    letterSpacing: LetterSpacing.wide,
  },
  list: {
    paddingBottom: Spacing['2xl'],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceRaised,
  },
  itemRead: {
    backgroundColor: 'transparent',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  itemTitle: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  itemTitleRead: {
    fontFamily: FontFamily.body,
    color: Colors.textSecondary,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.emerald500,
    flexShrink: 0,
  },
  itemMessage: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: FontSize.xs * 1.6,
  },
  itemTime: {
    fontFamily: FontFamily.body,
    fontSize: FontSize['2xs'],
    color: Colors.textDisabled,
    letterSpacing: LetterSpacing.wide,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['2xl'] * 2,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  emptyMessage: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.6,
    letterSpacing: LetterSpacing.wide,
  },
});
