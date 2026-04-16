/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, useSharedValue } from 'react-native-reanimated';
import { User, LogOut, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const QuickMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<any>();
  const animValue = useSharedValue(0);

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    animValue.value = withSpring(toValue, { damping: 15, stiffness: 150 });
    setExpanded(!expanded);
  };

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animValue.value }, { translateY: withTiming(expanded ? 0 : -20) }],
    opacity: withTiming(animValue.value, { duration: 150 }),
  }));

  const handleLogout = () => {
    // Reset stack về trang Login
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={toggleMenu} style={[styles.mainButton, expanded && styles.mainButtonActive]}>
        <Settings size={22} color={expanded ? "#131313" : "#FFFFFF"} />
      </TouchableOpacity>

      <Animated.View style={[styles.expandedMenu, menuStyle, { pointerEvents: expanded ? 'auto' : 'none' }]}>
        <TouchableOpacity style={styles.subButton} onPress={() => { toggleMenu(); navigation.navigate('Profile'); }}>
          <User size={18} color="#1F3D2F" />
          <Text style={styles.subText}>Hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.subButton, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <LogOut size={18} color="#FF5252" />
          <Text style={[styles.subText, { color: '#FF5252' }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 25, right: 20, zIndex: 9999, alignItems: 'flex-end' },
  mainButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#131313', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
  mainButtonActive: { backgroundColor: '#A3F7BF' },
  expandedMenu: { backgroundColor: '#FFFFFF', borderRadius: 20, marginTop: 10, padding: 6, width: 130, elevation: 10, shadowColor: '#1F3D2F', shadowOpacity: 0.15, shadowRadius: 15, borderWidth: 1, borderColor: '#E0E8E0' },
  subButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F0F4F0' },
  subText: { marginLeft: 8, fontSize: 13, fontWeight: '700', color: '#1F3D2F' },
});