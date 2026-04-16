import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { X, Save } from 'lucide-react-native';

interface ProfileBottomBarProps {
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProfileBottomBar({ saving, onCancel, onSave }: ProfileBottomBarProps) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={saving}>
        <X size={20} color="#1F3D2F" />
        <Text style={styles.cancelText}>Hủy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving}>
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
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E8E0',
    elevation: 20,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F0F4F0',
    borderRadius: 16,
    marginRight: 10,
  },
  cancelText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#1F3D2F' },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#A3F7BF',
    borderRadius: 16,
    marginLeft: 10,
  },
  saveText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#131313' },
});