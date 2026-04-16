/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { styles } from '../screens/Profile/styles';

interface FieldRowProps {
  label: string;
  value: string;
  editable?: boolean;
  editing: boolean;
  onChangeText?: (t: string) => void;
  keyboardType?: any;
  icon: any;
  delay: number;
}

export const FieldRow: React.FC<FieldRowProps> = ({
  label,
  value,
  editable = true,
  editing,
  onChangeText,
  keyboardType,
  icon: Icon,
  delay,
}) => {
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
        <Icon size={20} color="#40d47a" />
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
          <Text style={[styles.fieldValue, (!editable && editing) && { color: '#88a89e' }]} numberOfLines={1}>
            {value || '—'}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};