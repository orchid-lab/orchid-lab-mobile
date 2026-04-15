/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import LeafIllustration from '../../components/LeafIllustration';
import AnimatedInput from '../../components/AnimatedInput';
import { styles } from '../../styles/loginStyles';

const BASE_URL = 'https://your-api-url.com'; // ← đổi lại URL thực tế

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Shared values ────────────────────────────────────────────────────────
  const leavesY = useSharedValue(-50);
  const leavesOpacity = useSharedValue(0);
  const floatY = useSharedValue(0);
  const headlineOpacity = useSharedValue(0);
  const headlineY = useSharedValue(16);
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  // ── Entrance animation ───────────────────────────────────────────────────
  useEffect(() => {
    leavesOpacity.value = withTiming(1, { duration: 750, easing: Easing.out(Easing.cubic) });
    leavesY.value = withSpring(0, { damping: 14, stiffness: 70 });

    headlineOpacity.value = withDelay(280, withTiming(1, { duration: 600 }));
    headlineY.value = withDelay(280, withSpring(0, { damping: 16, stiffness: 100 }));

    cardOpacity.value = withDelay(180, withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) }));
    cardY.value = withDelay(180, withSpring(0, { damping: 16, stiffness: 85 }));

    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  // ── Animated styles ───────────────────────────────────────────────────────
  const leavesStyle = useAnimatedStyle(() => ({
    opacity: leavesOpacity.value,
    transform: [{ translateY: leavesY.value + floatY.value }],
  }));

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ translateY: headlineY.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  // ── Login handler ────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/authentication/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.replace('TechnicianReports');
      } else {
        Alert.alert('Đăng nhập thất bại', data?.detail || 'Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#1a9e4f', '#27ae60', '#40d47a']}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.leavesWrap, leavesStyle]}>
            <LeafIllustration />
          </Animated.View>

          <Animated.View style={[styles.headlineWrap, headlineStyle]}>
            <Text style={styles.headlineHello}>Hello.</Text>
            <Text style={styles.headlineSub}>Welcome back 👋</Text>
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            <Text style={styles.cardTitle}>Sign In</Text>

            <AnimatedInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              delay={100}
            />
            <AnimatedInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              delay={200}
            />

            <Animated.View style={[{ width: '100%', marginTop: 8 }, btnAnimStyle]}>
              <TouchableOpacity
                activeOpacity={0.88}
                disabled={loading}
                onPressIn={() => {
                  btnScale.value = withSpring(0.96, { damping: 12, stiffness: 280 });
                }}
                onPressOut={() => {
                  btnScale.value = withSpring(1, { damping: 10, stiffness: 200 });
                }}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={['#34d978', '#1db85c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.ctaText}>Login</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;