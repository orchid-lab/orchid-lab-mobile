/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue, 
  Easing 
} from 'react-native-reanimated';
import { User, LogOut, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const QuickMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<any>();
  
  // Animation value: 0 là đóng, 1 là mở
  const animValue = useSharedValue(0);

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    // Tạm biệt withSpring, dùng withTiming 150ms cho tốc độ "bàn thờ"
    // Easing.out giúp nó bung ra nhanh ở đầu và mượt ở cuối
    animValue.value = withTiming(toValue, { 
      duration: 300,
      easing: Easing.out(Easing.quad) 
    });
    setExpanded(!expanded);
  };

  const menuStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // Scale từ 0.8 lên 1: Khi đóng sẽ có cảm giác "Zoom out" nhẹ cực sang
        { scale: 0.8 + (animValue.value * 0.2) }, 
        // Trượt nhẹ lên trên một chút khi đóng
        { translateY: -10 * (1 - animValue.value) } 
      ],
      // Fade mượt mà theo animValue
      opacity: animValue.value,
    };
  });

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      {/* Nút chính */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={toggleMenu} 
        style={[styles.mainButton, expanded && styles.mainButtonActive]}
      >
        <Settings size={22} color={expanded ? "#131313" : "#FFFFFF"} />
      </TouchableOpacity>

      {/* Menu phụ */}
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