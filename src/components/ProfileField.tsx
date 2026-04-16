import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { EditForm } from '../hooks/useProfile';

interface ProfileFieldProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
  field?: keyof EditForm;
  isEditing: boolean;
  editable?: boolean;
  readonly?: boolean;
  onChangeText?: (field: keyof EditForm, text: string) => void;
}

export default function ProfileField({
  icon: Icon,
  label,
  value,
  field,
  isEditing,
  editable = true,
  readonly = false,
  onChangeText,
}: ProfileFieldProps) {
  const showInput = isEditing && editable && !readonly && field;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon size={16} color="#5A7A5A" />
        <Text style={styles.label}>{label}</Text>
      </View>

      {showInput ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => onChangeText?.(field!, text)}
          placeholder={`Nhập ${label.toLowerCase()}`}
          placeholderTextColor="#A0B0A0"
        />
      ) : (
        <Text style={[styles.value, readonly && isEditing && styles.readonlyText]}>
          {value || '—'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { marginLeft: 8, fontSize: 13, fontWeight: '600', color: '#5A7A5A' },
  value: { fontSize: 16, fontWeight: '600', color: '#1F3D2F', paddingVertical: 4 },
  readonlyText: { color: '#A0B0A0' },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F3D2F',
    borderBottomWidth: 1,
    borderBottomColor: '#A3F7BF',
    paddingVertical: 8,
  },
});