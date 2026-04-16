import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserById,
  uploadUserAvatar,
  updateUser,
  UserProfile,
  UpdateUserPayload,
} from '../api/userApi';

export interface EditForm {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

export function useProfile() {
  const { user: authUser, isAuthReady, updateUser: syncAuthUser } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<{ uri: string; type?: string; fileName?: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    id: '', name: '', email: '', phoneNumber: '', avatarUrl: '',
  });

  // ─── Load user ────────────────────────────────────────────────────────────
  useEffect(() => {
    // 🔍 Debug: paste vào Metro console để kiểm tra
    console.log('[useProfile] isAuthReady:', isAuthReady, '| authUser?.id:', authUser?.id);

    // Chưa khởi tạo xong → không làm gì, giữ loading=true
    if (!isAuthReady) return;

    // Auth ready nhưng không có id → không fetch được
    if (!authUser?.id) {
      console.warn('[useProfile] isAuthReady=true nhưng authUser.id trống — kiểm tra AuthContext');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        console.log('[useProfile] → GET /api/user/' + authUser.id);
        const data = await fetchUserById(authUser.id);
        console.log('[useProfile] ← response:', JSON.stringify(data));

        if (cancelled) return;
        setUser(data);
        setEditForm({
          id: data.id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl,
        });
      } catch (err: any) {
        console.error('[useProfile] fetch error:', err?.message);
        if (!cancelled) Alert.alert('Lỗi', 'Không thể tải thông tin người dùng từ máy chủ.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [authUser?.id, isAuthReady]);

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let newAvatarUrl = user.avatarUrl ?? '';

      if (avatarFile) {
        newAvatarUrl = await uploadUserAvatar(avatarFile);
      }

      const hasChanges =
        editForm.name !== user.name ||
        editForm.phoneNumber !== user.phoneNumber ||
        newAvatarUrl !== user.avatarUrl;

      if (hasChanges) {
        const payload: UpdateUserPayload = {
          id: editForm.id,
          name: editForm.name,
          email: editForm.email,
          phoneNumber: editForm.phoneNumber,
          avatarUrl: newAvatarUrl,
        };
        await updateUser(payload);
      }

      const fresh = await fetchUserById(editForm.id);
      setUser(fresh);
      await syncAuthUser(fresh);

      setIsEditing(false);
      setAvatarFile(null);
      setPreviewUrl(null);
      Alert.alert('Thành công', 'Đã cập nhật thông tin hồ sơ.');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể lưu thông tin lúc này.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setPreviewUrl(null);
    setEditForm({
      id: user?.id ?? '',
      name: user?.name ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    });
  };

  // ─── Avatar picker ────────────────────────────────────────────────────────
  const handlePickAvatar = () => {
    if (!isEditing) return;
    Alert.alert('Tính năng', 'Cắm react-native-image-picker vào đây.');
  };

  return {
    authUser, user, loading, isEditing, saving,
    editForm, previewUrl,
    setIsEditing, setEditForm,
    handleSave, handleCancel, handlePickAvatar,
  };
}