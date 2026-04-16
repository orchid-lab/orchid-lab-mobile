/* eslint-disable react-native/no-inline-styles */
// src/screens/LoginScreen/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolation} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ChevronUp } from 'lucide-react-native';

import AnimatedInput from '../../components/AnimatedInput';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@env';
import { decodeJWT, getGreeting } from '../../utils/authUtils';
import { styles } from './styles';

const { height: SCREEN_H } = Dimensions.get('window');
const SWIPE_LIMIT = 200; 

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // sharedValue lưu trạng thái vuốt
  const dragY = useSharedValue(0);
  const isFormVisible = useSharedValue(0); // 0: Chế độ Greeting, 1: Chế độ Login

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Nếu đang ở màn hình chào, cho phép vuốt lên (âm)
      if (isFormVisible.value === 0) {
        dragY.value = Math.min(0, event.translationY);
      } else {
        // Nếu đang ở màn hình login, cho phép vuốt xuống (dương) để quay lại
        dragY.value = Math.max(0, event.translationY) - SWIPE_LIMIT;
      }
    })
    .onEnd((event) => {
      if (isFormVisible.value === 0) {
        if (event.translationY < -100 || event.velocityY < -500) {
          dragY.value = withSpring(-SWIPE_LIMIT);
          isFormVisible.value = 1;
        } else {
          dragY.value = withSpring(0);
        }
      } else {
        if (event.translationY > 100 || event.velocityY > 500) {
          dragY.value = withSpring(0);
          isFormVisible.value = 0;
        } else {
          dragY.value = withSpring(-SWIPE_LIMIT);
        }
      }
    });

  // Hiệu ứng Fade giữa 2 hình nền
  const bg1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dragY.value, [0, -SWIPE_LIMIT], [1, 0], Extrapolation.CLAMP),
  }));

  const bg2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dragY.value, [0, -SWIPE_LIMIT], [0, 1], Extrapolation.CLAMP),
  }));

  // Hiệu ứng Lời chào
  const greetingStyle = useAnimatedStyle(() => {
    const opacity = interpolate(dragY.value, [0, -100], [1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(dragY.value, [0, -SWIPE_LIMIT], [0, -50], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  // Hiệu ứng Form Login (Trượt lên và Fade in)
  const formStyle = useAnimatedStyle(() => {
    const opacity = interpolate(dragY.value, [-50, -SWIPE_LIMIT], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(dragY.value, [0, -SWIPE_LIMIT], [SCREEN_H * 0.6, SCREEN_H * 0.28], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/authentication/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const decoded = decodeJWT(data.accessToken || data.token);
        await login({
          id: String(decoded?.sub || data.id),
          name: data.name || decoded?.name || '',
          email: data.email || decoded?.email || email,
          roleName: data.roleName || decoded?.role || 'User',
        });
        navigation.replace('TechnicianReports');
      } else {
        Alert.alert('Lỗi', data?.detail || 'Thông tin không chính xác');
      }
    } catch {
      Alert.alert('Lỗi', 'Kết nối thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.root}>
        
        {/* Nền 1: Hiện ban đầu */}
        <Animated.View style={[styles.bgImage, bg1Style]}>
          <Image source={require('../../assets/images/loginBackground.jpg')} style={styles.bgImage} resizeMode="cover" />
        </Animated.View>

        {/* Nền 2: Hiện khi vuốt lên */}
        <Animated.View style={[styles.bgImage, bg2Style]}>
          <Image source={require('../../assets/images/loginBackground2.jpg')} style={styles.bgImage} resizeMode="cover" />
        </Animated.View>

        <View style={styles.overlay} />

        <GestureDetector gesture={gesture}>
          <View style={styles.contentContainer}>
            
            {/* 1. Khu vực lời chào */}
            <Animated.View style={[styles.headlineWrap, greetingStyle]}>
              <Text style={styles.headlineHello}>{getGreeting()}</Text>
              <Text style={styles.headlineSub}>Orchid Lab System</Text>
            </Animated.View>

            {/* 2. Thẻ Đăng nhập (Glassmorphism) */}
            <Animated.View style={[styles.glassCard, formStyle]}>
              <Text style={styles.cardTitle}>Sign In</Text>
              <AnimatedInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <AnimatedInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              
              <TouchableOpacity activeOpacity={0.8} onPress={handleLogin} disabled={loading}>
                <LinearGradient colors={['#34d978', '#1db85c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>ĐĂNG NHẬP</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Gợi ý vuốt */}
            <Animated.View style={[styles.swipeHint, greetingStyle]}>
               <ChevronUp color="#FFF" size={24} />
               <Text style={styles.swipeText}>VUỐT LÊN</Text>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default LoginScreen;