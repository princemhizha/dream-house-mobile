import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from '@/constants/adminColors';
import { useAdminStore } from '@/store/useAdminStore';
import AdminAvatar from '@/components/admin/AdminAvatar';
import DotGridBackground from '@/components/admin/DotGridBackground';

const SETTINGS_KEY = 'dh_admin_settings';

type AdminSettings = {
  notifyVerifications: boolean;
  notifyRejections: boolean;
  notifyDailyDigest: boolean;
  biometricLock: boolean;
  sessionTimeout: boolean;
  auditLogging: boolean;
  compactMode: boolean;
  animations: boolean;
};

const DEFAULT_SETTINGS: AdminSettings = {
  notifyVerifications: true,
  notifyRejections: true,
  notifyDailyDigest: false,
  biometricLock: false,
  sessionTimeout: true,
  auditLogging: true,
  compactMode: false,
  animations: true,
};

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function SettingToggleRow({
  label,
  desc,
  value,
  onToggle,
  tintColor,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  tintColor?: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {desc && <Text style={styles.settingDesc}>{desc}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: adminBorderDefault, true: (tintColor ?? adminBlue300) + '80' }}
        thumbColor={value ? (tintColor ?? adminBlue300) : adminTextMuted}
        ios_backgroundColor={adminBorderDefault}
      />
    </View>
  );
}

function SettingNavRow({
  label,
  desc,
  icon,
  iconColor,
  onPress,
  rightLabel,
  danger,
}: {
  label: string;
  desc?: string;
  icon?: string;
  iconColor?: string;
  onPress: () => void;
  rightLabel?: string;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      {icon && (
        <View style={[styles.settingNavIcon, { backgroundColor: (iconColor ?? adminBlue300) + '1A' }]}>
          <Ionicons name={icon as any} size={15} color={iconColor ?? adminBlue300} />
        </View>
      )}
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, danger && { color: adminDanger }]}>{label}</Text>
        {desc && <Text style={styles.settingDesc}>{desc}</Text>}
      </View>
      {rightLabel ? (
        <Text style={styles.settingRightLabel}>{rightLabel}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={adminTextMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const adminUser = useAdminStore((s) => s.adminUser);
  const adminLogout = useAdminStore((s) => s.adminLogout);

  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
        } catch {}
      }
    });
  }, []);

  const updateSetting = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const handleSignOut = () => {
    adminLogout();
  };

  const roleLabel = adminUser?.initials === 'SA'
    ? 'System Administrator'
    : adminUser?.initials === 'JC'
    ? 'Admin — James Chirwa'
    : adminUser?.initials === 'PN'
    ? 'Admin — Priya Naidoo'
    : 'Administrator';

  return (
    <View style={styles.container}>
      <DotGridBackground />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Ionicons name="settings-outline" size={20} color={adminTextMuted} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <AdminAvatar name={adminUser?.name ?? 'Admin'} size={64} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{adminUser?.name ?? 'Administrator'}</Text>
            <Text style={styles.profileRole}>{roleLabel}</Text>
            <Text style={styles.profileEmail}>{adminUser?.email ?? ''}</Text>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionLabel title="NOTIFICATIONS" />
          <View style={styles.card}>
            <SettingToggleRow
              label="New Verifications"
              desc="Alert when a landlord submits ID"
              value={settings.notifyVerifications}
              onToggle={(v) => updateSetting('notifyVerifications', v)}
              tintColor={adminBlue300}
            />
            <View style={styles.rowDivider} />
            <SettingToggleRow
              label="Rejection Alerts"
              desc="Notify when a rejection is processed"
              value={settings.notifyRejections}
              onToggle={(v) => updateSetting('notifyRejections', v)}
              tintColor={adminWarning}
            />
            <View style={styles.rowDivider} />
            <SettingToggleRow
              label="Daily Digest"
              desc="Summary email each morning"
              value={settings.notifyDailyDigest}
              onToggle={(v) => updateSetting('notifyDailyDigest', v)}
              tintColor={adminCyan500}
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <SectionLabel title="SECURITY" />
          <View style={styles.card}>
            <SettingToggleRow
              label="Biometric Lock"
              desc="Require biometric to open admin"
              value={settings.biometricLock}
              onToggle={(v) => updateSetting('biometricLock', v)}
              tintColor={adminSuccess}
            />
            <View style={styles.rowDivider} />
            <SettingToggleRow
              label="Session Timeout"
              desc="Auto-lock after 30 minutes idle"
              value={settings.sessionTimeout}
              onToggle={(v) => updateSetting('sessionTimeout', v)}
              tintColor={adminBlue300}
            />
            <View style={styles.rowDivider} />
            <SettingToggleRow
              label="Audit Logging"
              desc="Record all admin actions"
              value={settings.auditLogging}
              onToggle={(v) => updateSetting('auditLogging', v)}
              tintColor={adminBlue300}
            />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <SectionLabel title="APPEARANCE" />
          <View style={styles.card}>
            <SettingToggleRow
              label="Compact Mode"
              desc="Tighter layout with smaller cards"
              value={settings.compactMode}
              onToggle={(v) => updateSetting('compactMode', v)}
            />
            <View style={styles.rowDivider} />
            <SettingToggleRow
              label="Animations"
              desc="Enable UI motion and transitions"
              value={settings.animations}
              onToggle={(v) => updateSetting('animations', v)}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <SectionLabel title="ABOUT" />
          <View style={styles.card}>
            <SettingNavRow
              label="Version"
              icon="information-circle-outline"
              iconColor={adminBlue300}
              onPress={() => {}}
              rightLabel="v1.0.0"
            />
            <View style={styles.rowDivider} />
            <SettingNavRow
              label="Build"
              icon="construct-outline"
              iconColor={adminTextMuted}
              onPress={() => {}}
              rightLabel="Frontend Preview"
            />
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.section}>
          <SectionLabel title="DANGER ZONE" />
          <View style={styles.card}>
            <SettingNavRow
              label="Sign Out"
              desc="End this admin session"
              icon="log-out-outline"
              iconColor={adminDanger}
              onPress={handleSignOut}
              danger
            />
          </View>
        </View>

        <Text style={styles.buildNote}>Dream House Admin v1.0.0 · Frontend Preview Build</Text>
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
  scrollContent: { paddingTop: 20 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 20,
    backgroundColor: adminSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    padding: 16,
    marginBottom: 24,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 18,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  profileRole: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: adminBlue300,
    marginTop: 3,
    includeFontPadding: false,
  },
  profileEmail: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },

  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 9,
    color: adminTextMuted,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    includeFontPadding: false,
  },
  card: {
    backgroundColor: adminSurface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  settingNavIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  settingDesc: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
  settingRightLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: adminTextMuted,
    includeFontPadding: false,
  },
  rowDivider: {
    height: 1,
    backgroundColor: adminBorderSubtle,
    marginHorizontal: 16,
  },

  buildNote: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    textAlign: 'center',
    marginBottom: 10,
    includeFontPadding: false,
  },
});
