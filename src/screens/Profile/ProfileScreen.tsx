/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
  StatusBar,
  Platform,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@env';

const { width: SCREEN_W } = Dimensions.get('window');
const BASE_URL = (() => {
  const raw = String(API_URL);
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
})();

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string | null;
  createdDate?: string;
}

interface EditForm {
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0].toUpperCase())
    .join('');

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

// ─── Field Row ────────────────────────────────────────────────────────────────
const FieldRow: React.FC<{
  label: string;
  value: string;
  editable?: boolean;
  editing: boolean;
  onChangeText?: (t: string) => void;
  keyboardType?: any;
  icon: string;
  delay: number;
}> = ({ label, value, editable = true, editing, onChangeText, keyboardType, icon, delay }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 100 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.fieldRow, animStyle]}>
      <View style={styles.fieldIcon}>
        <Text style={styles.fieldIconText}>{icon}</Text>
      </View>
      <View style={styles.fieldBody}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editing && editable ? (
          <TextInput
            style={styles.fieldInput}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType ?? 'default'}
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.fieldValue} numberOfLines={1}>{value || '—'}</Text>
        )}
      </View>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, token, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<EditForm>({ name: '', email: '', phoneNumber: '', avatarUrl: '' });
  const [editing, setEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ── Animations ───────────────────────────────────────────────────────────
  const scrollY = useSharedValue(0);
  const headerScale = useSharedValue(0.8);
  const headerOpacity = useSharedValue(0);
  const avatarScale = useSharedValue(0);
  const nameFade = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const heroAnimStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 120], [1, 0.9], 'clamp');
    const opacity = interpolate(scrollY.value, [0, 120], [1, 0.6], 'clamp');
    return { transform: [{ scale }], opacity };
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
  }));

  const avatarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const nameAnimStyle = useAnimatedStyle(() => ({
    opacity: nameFade.value,
    transform: [{ translateY: interpolate(nameFade.value, [0, 1], [10, 0]) }],
  }));

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerScale.value = withSpring(1, { damping: 14 });
    avatarScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 120 }));
    nameFade.value = withDelay(350, withTiming(1, { duration: 500 }));
  }, []);

  // ── Load Profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/${user!.id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (res.ok) {
        const p: UserProfile = data.value ?? data;
        setProfile(p);
        setForm({
          name: p.name ?? '',
          email: p.email ?? '',
          phoneNumber: p.phoneNumber ?? '',
          avatarUrl: p.avatarUrl ?? '',
        });
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setLoadingProfile(false);
    }
  };

  // ── Upload Avatar ────────────────────────────────────────────────────────
  const handlePickAvatar = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, async response => {
      if (response.didCancel || !response.assets?.length) return;
      const asset = response.assets[0];
      if (!asset.uri) return;

      setUploadingAvatar(true);
      try {
        const formData = new FormData();
        formData.append('image', {
          uri: asset.uri,
          type: asset.type ?? 'image/jpeg',
          name: asset.fileName ?? 'avatar.jpg',
        } as any);

        const res = await fetch(`${BASE_URL}/api/images/user`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          const url = data.url ?? data.imageUrl ?? data.value ?? data;
          setForm(prev => ({ ...prev, avatarUrl: String(url) }));
          setProfile(prev => prev ? { ...prev, avatarUrl: String(url) } : prev);
        } else {
          Alert.alert('Lỗi', 'Không thể tải ảnh lên');
        }
      } catch {
        Alert.alert('Lỗi', 'Lỗi khi tải ảnh');
      } finally {
        setUploadingAvatar(false);
      }
    });
  };

  // ── Save Profile ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Lỗi', 'Tên không được để trống');
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        avatarUrl: form.avatarUrl,
      };
      const res = await fetch(`${BASE_URL}/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setEditing(false);
        await fetchProfile();
        Alert.alert('Thành công', 'Đã cập nhật thông tin');
      } else {
        const data = await res.json();
        Alert.alert('Lỗi', data?.detail ?? 'Không thể cập nhật');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        avatarUrl: profile.avatarUrl ?? '',
      });
    }
    setEditing(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color="#40d47a" />
        <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  const displayName = editing ? form.name : (profile?.name ?? user?.name ?? '');
  const avatarUri = editing ? form.avatarUrl : (profile?.avatarUrl ?? '');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* ── Hero section ── */}
          <Animated.View style={[styles.hero, heroAnimStyle]}>
            <LinearGradient
              colors={['#1a9e4f22', '#27ae6011', '#40d47a08']}
              style={styles.heroBg}
            />

            {/* Back button */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Avatar */}
            <Animated.View style={[styles.avatarWrap, avatarAnimStyle]}>
              <TouchableOpacity
                onPress={editing ? handlePickAvatar : undefined}
                activeOpacity={editing ? 0.7 : 1}
                disabled={uploadingAvatar}
              >
                <LinearGradient
                  colors={['#40d47a', '#1a9e4f']}
                  style={styles.avatarRing}
                >
                  <View style={styles.avatarInner}>
                    {uploadingAvatar ? (
                      <ActivityIndicator color="#40d47a" size="large" />
                    ) : avatarUri ? (
                      <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
                    )}
                  </View>
                </LinearGradient>
                {editing && (
                  <View style={styles.cameraOverlay}>
                    <Text style={styles.cameraIcon}>📷</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Name & Role */}
            <Animated.View style={[{ alignItems: 'center', marginTop: 12 }, nameAnimStyle]}>
              <Text style={styles.heroName}>{displayName || '—'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{profile?.role ?? user?.roleName ?? 'User'}</Text>
              </View>
            </Animated.View>

            {/* Quick stats */}
            <Animated.View style={[styles.statsRow, nameAnimStyle]}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDate(profile?.createdDate)}</Text>
                <Text style={styles.statLabel}>Ngày tạo</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile?.phoneNumber || '—'}</Text>
                <Text style={styles.statLabel}>Điện thoại</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* ── Info Card ── */}
          <Animated.View style={[styles.card, headerStyle]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
              {!editing ? (
                <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                  <Text style={styles.editBtnText}>✏️  Chỉnh sửa</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
                  <Text style={styles.cancelBtnText}>✕  Hủy</Text>
                </TouchableOpacity>
              )}
            </View>

            <FieldRow
              icon="👤" label="Họ và tên"
              value={editing ? form.name : (profile?.name ?? '')}
              editing={editing} editable
              onChangeText={t => setForm(p => ({ ...p, name: t }))}
              delay={0}
            />
            <FieldRow
              icon="✉️" label="Email"
              value={editing ? form.email : (profile?.email ?? '')}
              editing={editing} editable
              keyboardType="email-address"
              onChangeText={t => setForm(p => ({ ...p, email: t }))}
              delay={80}
            />
            <FieldRow
              icon="📞" label="Số điện thoại"
              value={editing ? form.phoneNumber : (profile?.phoneNumber ?? '')}
              editing={editing} editable
              keyboardType="phone-pad"
              onChangeText={t => setForm(p => ({ ...p, phoneNumber: t }))}
              delay={160}
            />
            <FieldRow
              icon="🎭" label="Vai trò"
              value={profile?.role ?? user?.roleName ?? ''}
              editing={false} editable={false}
              delay={240}
            />

            {editing && (
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#40d47a', '#1a9e4f']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.saveBtnGradient}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.saveBtnText}>💾  Lưu thay đổi</Text>}
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* ── Logout ── */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: logout },
              ]);
            }}
          >
            <Text style={styles.logoutText}>🚪  Đăng xuất</Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f2027' },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: '#40d47a', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 15 },

  // Blobs
  blob1: {
    position: 'absolute', top: -60, right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#40d47a18',
  },
  blob2: {
    position: 'absolute', top: 180, left: -80,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#1a9e4f12',
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 28,
    paddingHorizontal: 24,
    position: 'relative',
  },
  heroBg: {
    ...StyleSheet.absoluteFill,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 46,
    left: 20,
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff18',
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: '600' },

  // Avatar
  avatarWrap: { marginTop: 16 },
  avatarRing: {
    width: 110, height: 110, borderRadius: 55,
    padding: 3, alignItems: 'center', justifyContent: 'center',
  },
  avatarInner: {
    width: 104, height: 104, borderRadius: 52,
    backgroundColor: '#1a2a35',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImage: { width: 104, height: 104, borderRadius: 52 },
  avatarInitials: {
    color: '#40d47a', fontSize: 38, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#1a9e4f',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#0f2027',
  },
  cameraIcon: { fontSize: 14 },

  // Name / Role
  heroName: {
    color: '#fff', fontSize: 24, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  roleBadge: {
    marginTop: 6, paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: 20, backgroundColor: '#40d47a22',
    borderWidth: 1, borderColor: '#40d47a44',
  },
  roleText: { color: '#40d47a', fontSize: 12, fontWeight: '600', letterSpacing: 0.8 },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, backgroundColor: '#ffffff0a',
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24,
    borderWidth: 1, borderColor: '#ffffff0f',
    width: SCREEN_W - 48,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '700' },
  statLabel: { color: '#aaa', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#ffffff22' },

  // Card
  card: {
    margin: 20, marginTop: 16,
    backgroundColor: '#162330',
    borderRadius: 24, padding: 20,
    borderWidth: 1, borderColor: '#ffffff0f',
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  cardTitle: {
    color: '#fff', fontSize: 17, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  editBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: '#40d47a22', borderRadius: 20,
    borderWidth: 1, borderColor: '#40d47a55',
  },
  editBtnText: { color: '#40d47a', fontSize: 13, fontWeight: '600' },
  cancelBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: '#ff4d4d18', borderRadius: 20,
    borderWidth: 1, borderColor: '#ff4d4d44',
  },
  cancelBtnText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600' },

  // Field
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#ffffff08',
  },
  fieldIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#40d47a15',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  fieldIconText: { fontSize: 17 },
  fieldBody: { flex: 1 },
  fieldLabel: { color: '#88a89e', fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 3 },
  fieldValue: { color: '#e8f4ed', fontSize: 15, fontWeight: '500' },
  fieldInput: {
    color: '#fff', fontSize: 15, fontWeight: '500',
    borderBottomWidth: 1.5, borderBottomColor: '#40d47a',
    paddingVertical: 2, paddingHorizontal: 0,
  },

  // Save
  saveBtn: { marginTop: 22 },
  saveBtnGradient: {
    paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  // Logout
  logoutBtn: {
    marginHorizontal: 20, marginTop: 4,
    paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#ff4d4d12',
    borderWidth: 1, borderColor: '#ff4d4d33',
    alignItems: 'center',
  },
  logoutText: { color: '#ff6b6b', fontSize: 15, fontWeight: '600' },
});

export default ProfileScreen;