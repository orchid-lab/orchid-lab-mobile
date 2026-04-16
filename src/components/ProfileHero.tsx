import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Edit2 } from 'lucide-react-native';
import { UserProfile } from '../api/userApi';

interface ProfileHeroProps {
  user: UserProfile;
  roleName?: string;
  displayAvatar?: string | null;
  isEditing: boolean;
  onEditPress: () => void;
  onAvatarPress: () => void;
}

export default function ProfileHero({
  user,
  roleName,
  displayAvatar,
  isEditing,
  onEditPress,
  onAvatarPress,
}: ProfileHeroProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={isEditing ? 0.7 : 1}
        onPress={onAvatarPress}
        style={styles.avatarWrap}
      >
        {displayAvatar ? (
          <Image source={{ uri: displayAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        {isEditing && (
          <View style={styles.cameraBadge}>
            <Camera size={14} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.name}>{user.name || 'Chưa cập nhật'}</Text>

      <View style={styles.roleBadge}>
        <View style={styles.roleDot} />
        <Text style={styles.roleText}>{roleName ?? '—'}</Text>
      </View>

      {!isEditing && (
        <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
          <Edit2 size={16} color="#1F3D2F" />
          <Text style={styles.editBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#1F3D2F',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#DFE7DF' },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A3F7BF',
  },
  avatarInitial: { fontSize: 36, fontWeight: '700', color: '#1F3D2F' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1F3D2F',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: { fontSize: 22, fontWeight: '800', color: '#1F3D2F', marginBottom: 6 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A3F7BF',
    marginRight: 8,
  },
  roleText: { fontSize: 13, fontWeight: '600', color: '#5A7A5A' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3F7BF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editBtnText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#1F3D2F' },
});