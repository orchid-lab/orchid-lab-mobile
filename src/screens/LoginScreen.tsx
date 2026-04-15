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
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ─── Colour tokens ─────────────────────────────────────────────────────────────
const C = {
  green1: '#1a9e4f',
  green2: '#27ae60',
  green3: '#2ecc71',
  green4: '#52d68a',
  yellow: '#f1c40f',
  yellowDark: '#e0a800',
  white: '#ffffff',
  offWhite: '#f4fdf8',
  textDark: '#1a2e24',
  textMid: '#4a7c5e',
  textLight: '#8ab89a',
  border: '#d4f0e0',
};

// ─── SVG Leaf Illustration ─────────────────────────────────────────────────────
const LeafIllustration: React.FC = () => (
  <Svg width={300} height={260} viewBox="0 0 320 280">
    {/* Back large dark leaf */}
    <Path
      d="M160 260 C80 220 40 150 60 80 C80 20 140 10 180 40 C220 70 230 140 200 200 Z"
      fill={C.green1}
      opacity={0.85}
    />
    {/* Right monstera leaf */}
    <Path
      d="M200 240 C230 190 260 130 240 70 C225 25 185 15 165 50 C145 85 160 160 190 210 Z"
      fill={C.green2}
      opacity={0.9}
    />
    {/* Left wide leaf */}
    <Path
      d="M80 230 C40 180 30 110 60 60 C80 25 120 30 140 70 C160 110 140 180 110 220 Z"
      fill={C.green3}
      opacity={0.88}
    />
    {/* Center bright leaf */}
    <Path
      d="M155 255 C120 200 115 130 140 80 C155 50 180 50 190 80 C205 120 195 200 170 255 Z"
      fill={C.green4}
      opacity={0.95}
    />
    {/* Far right thin leaf */}
    <Path
      d="M255 200 C270 160 275 100 260 60 C250 35 235 40 228 65 C220 95 230 155 245 195 Z"
      fill={C.green1}
      opacity={0.7}
    />
    {/* Far left leaf */}
    <Path
      d="M50 190 C30 145 35 85 55 50 C68 28 85 35 88 62 C92 95 75 155 60 190 Z"
      fill={C.green2}
      opacity={0.65}
    />
    {/* Monstera holes */}
    <Ellipse cx={150} cy={140} rx={12} ry={18} fill={C.green2} opacity={0.45} />
    <Ellipse cx={170} cy={172} rx={9} ry={13} fill={C.green1} opacity={0.38} />
    {/* Yellow flower cluster left */}
    <G>
      <Circle cx={90} cy={95} r={8} fill={C.yellow} />
      <Circle cx={90} cy={95} r={4} fill={C.yellowDark} />
      <Circle cx={82} cy={88} r={5} fill={C.yellow} opacity={0.8} />
      <Circle cx={98} cy={88} r={5} fill={C.yellow} opacity={0.8} />
      <Circle cx={90} cy={83} r={5} fill={C.yellow} opacity={0.8} />
    </G>
    {/* Yellow flower cluster right */}
    <G>
      <Circle cx={235} cy={118} r={7} fill={C.yellow} />
      <Circle cx={235} cy={118} r={3} fill={C.yellowDark} />
      <Circle cx={228} cy={112} r={4} fill={C.yellow} opacity={0.8} />
      <Circle cx={242} cy={112} r={4} fill={C.yellow} opacity={0.8} />
    </G>
    {/* Yellow flower top */}
    <G>
      <Circle cx={145} cy={65} r={6} fill={C.yellow} opacity={0.9} />
      <Circle cx={153} cy={60} r={4} fill={C.yellow} opacity={0.7} />
      <Circle cx={137} cy={60} r={4} fill={C.yellow} opacity={0.7} />
    </G>
    {/* Tiny berries */}
    <Circle cx={200} cy={74} r={4} fill={C.yellow} opacity={0.8} />
    <Circle cx={207} cy={67} r={3} fill={C.yellowDark} opacity={0.7} />
    <Circle cx={65} cy={128} r={4} fill={C.yellow} opacity={0.7} />
  </Svg>
);

// ─── Animated Input Field ──────────────────────────────────────────────────────
interface AnimatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  delay?: number;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  delay = 0,
}) => {
  const [focused, setFocused] = useState(false);
  const focusAnim = useSharedValue(0);
  const slideIn = useSharedValue(36);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 480 }));
    slideIn.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 110 })
    );
  }, []);

  const handleFocus = () => {
    setFocused(true);
    focusAnim.value = withTiming(1, { duration: 220 });
  };
  const handleBlur = () => {
    setFocused(false);
    focusAnim.value = withTiming(0, { duration: 220 });
  };

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: slideIn.value }],
    borderColor: focused ? C.green3 : C.border,
    shadowOpacity: interpolate(focusAnim.value, [0, 1], [0, 0.18]),
    shadowRadius: interpolate(focusAnim.value, [0, 1], [0, 14]),
    elevation: interpolate(focusAnim.value, [0, 1], [0, 5]),
  }));

  return (
    <Animated.View style={[styles.inputWrapper, wrapperStyle]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={C.textLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Animated.View>
  );
};

// ─── Main Screen Component ─────────────────────────────────────────────────────
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
    leavesOpacity.value = withTiming(1, {
      duration: 750,
      easing: Easing.out(Easing.cubic),
    });
    leavesY.value = withSpring(0, { damping: 14, stiffness: 70 });

    headlineOpacity.value = withDelay(
      280,
      withTiming(1, { duration: 600 })
    );
    headlineY.value = withDelay(
      280,
      withSpring(0, { damping: 16, stiffness: 100 })
    );

    cardOpacity.value = withDelay(
      180,
      withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) })
    );
    cardY.value = withDelay(
      180,
      withSpring(0, { damping: 16, stiffness: 85 })
    );

    // Gentle infinite float for leaves
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
  const switchScreen = useCallback(
    (next: ScreenType) => {
      // Fade-slide card out, swap state, fade-slide back in
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
    },
    []
  );

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
        style={StyleSheet.absoluteFill}
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
          {/* ── Leaves ───────────────────────────────────────────────────── */}
          <Animated.View style={[styles.leavesWrap, leavesStyle]}>
            <LeafIllustration />
          </Animated.View>

          {/* ── Headline ─────────────────────────────────────────────────── */}
          <Animated.View style={[styles.headlineWrap, headlineStyle]}>
            <Text style={styles.headlineHello}>Hello.</Text>
            <Text style={styles.headlineSub}>
              {isLogin ? 'Welcome back 👋' : 'Create your account'}
            </Text>
          </Animated.View>

          {/* ── Card ─────────────────────────────────────────────────────── */}
          <Animated.View style={[styles.card, cardStyle]}>
            <Text style={styles.cardTitle}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

            {/* Inputs */}
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

            {/* Forgot password (login only) */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotRow}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Terms (signup only) */}
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

            {/* CTA button */}
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

            {/* Switch screen */}
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

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.green1,
  },

  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: (StatusBar.currentHeight ?? 48) + 8,
    paddingBottom: 44,
    paddingHorizontal: 16,
  },

  // Background decorative circles for depth
  bgCircle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(255,255,255,0.045)',
    top: -width * 0.55,
    left: -width * 0.25,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(0,0,0,0.035)',
    bottom: height * 0.18,
    right: -width * 0.35,
  },

  // Leaves illustration
  leavesWrap: {
    alignItems: 'center',
    marginBottom: -14,
  },

  // Headline
  headlineWrap: {
    alignItems: 'center',
    marginBottom: 22,
  },
  headlineHello: {
    fontSize: 38,
    fontWeight: '800',
    color: C.white,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  headlineSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 3,
  },

  // White card
  card: {
    width: '100%',
    backgroundColor: C.white,
    borderRadius: 32,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 32,
    elevation: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textDark,
    marginBottom: 22,
    letterSpacing: 0.4,
  },

  // Input
  inputWrapper: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: C.offWhite,
    shadowColor: C.green3,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: C.textDark,
  },

  // Forgot password
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 22,
    marginTop: -4,
  },
  forgotText: {
    color: C.green2,
    fontSize: 13,
    fontWeight: '600',
  },

  // Terms row
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 22,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.green3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: C.white,
  },
  checkboxOn: {
    backgroundColor: C.green3,
    borderColor: C.green3,
  },
  checkmark: {
    color: C.white,
    fontSize: 13,
    fontWeight: '800',
  },
  termsText: {
    color: C.textMid,
    fontSize: 13,
    fontWeight: '500',
  },

  // CTA button
  ctaGradient: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.green2,
    shadowOpacity: 0.38,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 6,
  },
  ctaDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.6,
  },

  // Switch screen link
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  switchText: {
    color: C.textLight,
    fontSize: 13,
  },
  switchLink: {
    color: C.green2,
    fontWeight: '700',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});