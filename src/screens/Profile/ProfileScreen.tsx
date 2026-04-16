/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, ActivityIndicator, Alert, Image, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Phone, Mail, Shield, Edit2, Save, X, Camera, ChevronLeft 
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = API_URL;

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState<any>(null); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    avatarUrl: ''
  });


    useEffect(() => {
        const fetchUser = async () => {
        // THÊM DÒNG NÀY: Chặn ngay từ cửa nếu authUser hoặc id không tồn tại
        if (!authUser?.id) return; 

        try {
            const cleanUrl = String(BASE_URL).replace(/\/+$/, '');
            const res = await fetch(`${cleanUrl}/api/user/${authUser.id}`);
            
            if (!res.ok) throw new Error('Không thể lấy thông tin');
            
            const data = await res.json();
            setUser(data);
            setEditForm({
              id: data.id,
              name: data.name,
              email: data.email,
              phoneNumber: data.phoneNumber,
              avatarUrl: data.avatarUrl
            });
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải thông tin người dùng từ máy chủ.");
        } finally {
            setLoading(false);
        }
        };

        fetchUser();
    }, [authUser?.id]); 

  // 2. LOGIC LƯU DATA (Giống hệt code Web)
  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanUrl = String(BASE_URL).replace(/\/+$/, '');
      let newAvatarUrl = user?.avatarUrl;

      // Bước 2.1: Nếu có chọn ảnh mới -> Gọi API Upload Ảnh
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", {
          uri: avatarFile.uri,
          type: avatarFile.type || 'image/jpeg',
          name: avatarFile.fileName || 'avatar.jpg',
        } as any);

        const imageRes = await fetch(`${cleanUrl}/api/images/user`, {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (!imageRes.ok) throw new Error("Upload ảnh thất bại");
        const imageJson = await imageRes.json();
        newAvatarUrl = imageJson.value; // Lấy URL trả về
      }

      // Bước 2.2: Kiểm tra xem có gì thay đổi không
      const infoChanged =
        editForm.name !== user?.name ||
        editForm.email !== user?.email ||
        editForm.phoneNumber !== user?.phoneNumber ||
        newAvatarUrl !== user?.avatarUrl;

      // Bước 2.3: Gọi API Update User nếu có thay đổi
      if (infoChanged) {
        const updateRes = await fetch(`${cleanUrl}/api/user`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editForm, avatarUrl: newAvatarUrl }),
        });

        if (!updateRes.ok) throw new Error("Cập nhật thông tin thất bại");
      }

      // Bước 2.4: Fetch lại data mới nhất để đồng bộ
      const finalRes = await fetch(`${cleanUrl}/api/user/${editForm.id}`);
      const updatedUser = await finalRes.json();

      setUser(updatedUser);
      // updateUser(updatedUser); // Cập nhật lại Context
      
      setIsEditing(false);
      setAvatarFile(null);
      setPreviewUrl(null);
      Alert.alert("Thành công", "Đã cập nhật thông tin hồ sơ.");

    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể lưu thông tin lúc này.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setPreviewUrl(null);
    setEditForm({
      id: user?.id ?? '',
      name: user?.name ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      avatarUrl: user?.avatarUrl ?? ''
    });
  };

  const handleAvatarChange = () => {
    if (!isEditing) return;
    // Chỗ này bạn dùng react-native-image-picker để lấy ảnh
    // Sau khi lấy được ảnh thì set 2 state:
    // setAvatarFile(response.assets[0]);
    // setPreviewUrl(response.assets[0].uri);
    Alert.alert("Tính năng", "Cắm react-native-image-picker vào đây để chọn ảnh nhé Phát.");
  };

  // 3. UI COMPONENTS
  const Field = ({ icon: Icon, label, value, field, editable = true, readonly = false }: any) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Icon size={16} color="#5A7A5A" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {isEditing && editable && !readonly ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setEditForm(prev => ({ ...prev, [field]: text }))}
          placeholder={`Nhập ${label.toLowerCase()}`}
          placeholderTextColor="#A0B0A0"
        />
      ) : (
        <Text style={[styles.fieldValue, readonly && isEditing && styles.readonlyText]}>
          {value || '—'}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color="#1F3D2F" />
      </View>
    );
  }

  const displayAvatar = previewUrl || user?.avatarUrl;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#DFE7DF', '#F2F6F2']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#1F3D2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <TouchableOpacity 
            activeOpacity={isEditing ? 0.7 : 1} 
            onPress={handleAvatarChange}
            style={styles.avatarWrap}
          >
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.cameraBadge}>
                <Camera size={14} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.heroName}>{user?.name || 'Chưa cập nhật'}</Text>
          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>{authUser.roleName}</Text>
          </View>

          {!isEditing && (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Edit2 size={16} color="#1F3D2F" />
              <Text style={styles.editBtnText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <Field icon={User} label="Họ và tên" value={editForm.name} field="name" />
          <View style={styles.divider} />
          <Field icon={Phone} label="Số điện thoại" value={editForm.phoneNumber} field="phoneNumber" />
          <View style={styles.divider} />
          <Field icon={Mail} label="Địa chỉ Email" value={editForm.email} field="email" readonly />
          
          {isEditing && <Text style={styles.noteText}>* Email không thể thay đổi</Text>}
        </View>

        <View style={styles.infoCard}>
          <Field icon={Shield} label="Mã nhân viên (ID)" value={user?.id} editable={false} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {isEditing && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={saving}>
            <X size={20} color="#1F3D2F" />
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#131313" />
            ) : (
              <>
                <Save size={20} color="#131313" />
                <Text style={styles.saveText}>Lưu thay đổi</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F6F2' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F3D2F' },
  scrollContent: { padding: 20 },
  
  heroCard: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 16, elevation: 2, shadowColor: '#1F3D2F', shadowOpacity: 0.05, shadowRadius: 10 },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#DFE7DF' },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#A3F7BF' },
  avatarInitial: { fontSize: 36, fontWeight: '700', color: '#1F3D2F' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1F3D2F', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  heroName: { fontSize: 22, fontWeight: '800', color: '#1F3D2F', marginBottom: 6 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  roleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A3F7BF', marginRight: 8 },
  roleText: { fontSize: 13, fontWeight: '600', color: '#5A7A5A' },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#A3F7BF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  editBtnText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#1F3D2F' },

  infoCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#1F3D2F', shadowOpacity: 0.05, shadowRadius: 10 },
  fieldContainer: { marginVertical: 8 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fieldLabel: { marginLeft: 8, fontSize: 13, fontWeight: '600', color: '#5A7A5A' },
  fieldValue: { fontSize: 16, fontWeight: '600', color: '#1F3D2F', paddingVertical: 4 },
  readonlyText: { color: '#A0B0A0' },
  input: { fontSize: 16, fontWeight: '600', color: '#1F3D2F', borderBottomWidth: 1, borderBottomColor: '#A3F7BF', paddingVertical: 8, paddingHorizontal: 0 },
  divider: { height: 1, backgroundColor: '#F0F4F0', marginVertical: 8 },
  noteText: { fontSize: 12, color: '#FF5252', marginTop: 12, fontStyle: 'italic' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0E8E0', elevation: 20 },
  cancelBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, backgroundColor: '#F0F4F0', borderRadius: 16, marginRight: 10 },
  cancelText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#1F3D2F' },
  saveBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, backgroundColor: '#A3F7BF', borderRadius: 16, marginLeft: 10 },
  saveText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#131313' },
});