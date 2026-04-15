/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import { User, LogOut, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const QuickMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<any>();
  
  // Animation value (0 là đóng, 1 là mở)
  const animValue = useSharedValue(0);

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    // Dùng spring với damping cao để nút bung ra "gắt" và chắc chắn
    animValue.value = withSpring(toValue, { damping: 15, stiffness: 150 });
    setExpanded(!expanded);
  };

  const menuStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: animValue.value },
        { translateY: animValue.value * 10 } // Đẩy xuống một chút khi mở
      ],
      opacity: withTiming(animValue.value, { duration: 150 }),
    };
  });

  const handleLogout = () => {
    // Logic đăng xuất của bạn ở đây
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Các nút phụ hiện ra khi bấm */}
      <Animated.View style={[styles.expandedMenu, menuStyle]}>
        <TouchableOpacity 
          style={styles.subButton} 
          onPress={() => { toggleMenu(); navigation.navigate('Profile'); }}
        >
          <User size={20} color="#1F3D2F" />
          <Text style={styles.subText}>Hồ sơ</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.subButton, { borderBottomWidth: 0 }]} 
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF5252" />
          <Text style={[styles.subText, { color: '#FF5252' }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Nút chính */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={toggleMenu} 
        style={styles.mainButton}
      >
        <Settings size={24} color={expanded ? "#1F3D2F" : "#FFFFFF"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 45 : 15, 
    right: 20,
    zIndex: 9999,
    alignItems: 'flex-end',
  },
  mainButton: {
    width: 45, 
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#131313',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  expandedMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 8,
    padding: 8,
    width: 140,
    elevation: 8,
    shadowColor: '#1F3D2F',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E8E0',
  },
  subButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F0',
  },
  subText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F3D2F',
  },
});