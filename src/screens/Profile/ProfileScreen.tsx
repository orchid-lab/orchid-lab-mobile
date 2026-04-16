/* eslint-disable @typescript-eslint/no-unused-vars */
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
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
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
import { User, Mail, Phone, Shield, Edit2, X, Save, LogOut, Camera, ChevronLeft } from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@env';

// Import từ các file đã tách
import { styles } from './styles';
import { UserProfile, EditForm } from './types';
import { getInitials, formatDate } from './utils';
import { FieldRow } from '../../components/FieldRow';

const BASE_URL = (() => {
  const raw = String(API_URL);
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
})();

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

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
        headers: { 'Content-Type': 'application/json' },
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
  const handlePickAvatar = () => {
    try {
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
    } catch (error) {
      Alert.alert(
        "Thiếu Native Module", 
        "Vui lòng tắt Metro Bundler và chạy lại lệnh 'npx react-native run-android' để biên dịch thư viện chọn ảnh."
      );
    }
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
        headers: { 'Content-Type': 'application/json' },
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
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={StyleSheet.absoluteFill} />

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
            <LinearGradient colors={['#1a9e4f22', '#27ae6011', '#40d47a08']} style={styles.heroBg} />

            {/* Back button */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>

            {/* Avatar */}
            <Animated.View style={[styles.avatarWrap, avatarAnimStyle]}>
              <TouchableOpacity
                onPress={editing ? handlePickAvatar : undefined}
                activeOpacity={editing ? 0.7 : 1}
                disabled={uploadingAvatar}
              >
                <LinearGradient colors={['#40d47a', '#1a9e4f']} style={styles.avatarRing}>
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
                    <Camera color="#fff" size={16} />
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
                  <Edit2 color="#40d47a" size={14} />
                  <Text style={styles.editBtnText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
                  <X color="#ff6b6b" size={16} />
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </TouchableOpacity>
              )}
            </View>

            <FieldRow
              icon={User} label="Họ và tên"
              value={editing ? form.name : (profile?.name ?? '')}
              editing={editing} editable={true}
              onChangeText={(t: any) => setForm(p => ({ ...p, name: t }))}
              delay={0}
            />
            <FieldRow
              icon={Mail} label="Email (Không thể thay đổi)"
              value={editing ? form.email : (profile?.email ?? '')}
              editing={editing} editable={false} 
              keyboardType="email-address"
              onChangeText={(t: any) => setForm(p => ({ ...p, email: t }))}
              delay={80}
            />
            <FieldRow
              icon={Phone} label="Số điện thoại"
              value={editing ? form.phoneNumber : (profile?.phoneNumber ?? '')}
              editing={editing} editable={true}
              keyboardType="phone-pad"
              onChangeText={(t: any) => setForm(p => ({ ...p, phoneNumber: t }))}
              delay={160}
            />
            <FieldRow
              icon={Shield} label="Vai trò"
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
                    : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Save color="#fff" size={18} />
                        <Text style={styles.saveBtnText}> Lưu thay đổi</Text>
                      </View>
                    )}
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
            <LogOut color="#ff6b6b" size={18} />
            <Text style={styles.logoutText}> Đăng xuất</Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileScreen;