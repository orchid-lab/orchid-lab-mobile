/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * LoginScreen.tsx
 *
 * Dependencies:
 *   npm install react-native-reanimated react-native-svg react-native-linear-gradient
 *   npm install react-native-safe-area-context
 *
 * babel.config.js — add to plugins array:
 *   'react-native-reanimated/plugin'
 *
 * iOS: npx pod-install
 *
 * ── Expo users ──────────────────────────────────────────────────────────────
 *   npx expo install react-native-reanimated react-native-svg expo-linear-gradient
 *   Then change:  import LinearGradient from 'react-native-linear-gradient'
 *   To:           import { LinearGradient } from 'expo-linear-gradient'
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
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

import LeafIllustration from '../../components/LeafIllustration';
import AnimatedInput from '../../components/AnimatedInput';
import { styles } from '../../styles/loginStyles';

type ScreenType = 'login' | 'signup';

const LoginScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ── Shared values ────────────────────────────────────────────────────────
  const leavesY = useSharedValue(-50);
  const leavesOpacity = useSharedValue(0);
  const floatY = useSharedValue(0);
  const headlineOpacity = useSharedValue(0);
  const headlineY = useSharedValue(16);
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  // ── Entrance animation (runs once on mount) ──────────────────────────────
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

  // ── Screen-switch transition ──────────────────────────────────────────────
  const switchScreen = useCallback((next: ScreenType) => {
    cardOpacity.value = withTiming(0, { duration: 160 });
    cardY.value = withTiming(24, { duration: 160 });
    setTimeout(() => {
      setScreen(next);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAcceptedTerms(false);
      cardOpacity.value = withTiming(1, { duration: 400 });
      cardY.value = withSpring(0, { damping: 16, stiffness: 90 });
    }, 180);
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

  const isLogin = screen === 'login';
  const ctaDisabled = !isLogin && !acceptedTerms;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-screen gradient background */}
      <LinearGradient
        colors={['#1a9e4f', '#27ae60', '#40d47a']}
        locations={[0, 0.5, 1]}
        style={{ ...{ position: 'absolute' }, top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Decorative soft circles */}
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
          {/* ── Leaves ─────────────────────────────────────────────────── */}
          <Animated.View style={[styles.leavesWrap, leavesStyle]}>
            <LeafIllustration />
          </Animated.View>

          {/* ── Headline ───────────────────────────────────────────────── */}
          <Animated.View style={[styles.headlineWrap, headlineStyle]}>
            <Text style={styles.headlineHello}>Hello.</Text>
            <Text style={styles.headlineSub}>
              {isLogin ? 'Welcome back 👋' : 'Create your account'}
            </Text>
          </Animated.View>

          {/* ── Card ───────────────────────────────────────────────────── */}
          <Animated.View style={[styles.card, cardStyle]}>
            <Text style={styles.cardTitle}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

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
            {!isLogin && (
              <AnimatedInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                delay={300}
              />
            )}

            {isLogin && (
              <TouchableOpacity style={styles.forgotRow}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {!isLogin && (
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAcceptedTerms(v => !v)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxOn]}>
                  {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>I accept the policy and terms</Text>
              </TouchableOpacity>
            )}

            <Animated.View style={[{ width: '100%' }, btnAnimStyle]}>
              <TouchableOpacity
                activeOpacity={0.88}
                disabled={ctaDisabled}
                onPressIn={() => {
                  btnScale.value = withSpring(0.96, { damping: 12, stiffness: 280 });
                }}
                onPressOut={() => {
                  btnScale.value = withSpring(1, { damping: 10, stiffness: 200 });
                }}
              >
                <LinearGradient
                  colors={ctaDisabled ? ['#b2dfca', '#b2dfca'] : ['#34d978', '#1db85c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.ctaGradient, ctaDisabled && styles.ctaDisabled]}
                >
                  <Text style={styles.ctaText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <TouchableOpacity onPress={() => switchScreen(isLogin ? 'signup' : 'login')}>
                <Text style={styles.switchLink}>
                  {isLogin ? 'Sign Up' : 'Login here'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;