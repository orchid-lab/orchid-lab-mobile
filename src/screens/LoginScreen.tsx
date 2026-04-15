/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// SVG-like leaf decorations using View shapes
const LeafDecoration: React.FC = () => (
  <View style={styles.leafContainer} pointerEvents="none">
    {/* Big monstera leaf - center */}
    <View style={[styles.leaf, styles.leafBig]} />
    <View style={[styles.leaf, styles.leafMedLeft]} />
    <View style={[styles.leaf, styles.leafMedRight]} />
    <View style={[styles.leaf, styles.leafSmallLeft]} />
    <View style={[styles.leaf, styles.leafSmallRight]} />
    {/* Yellow flower accents */}
    <View style={[styles.flower, styles.flowerLeft]} />
    <View style={[styles.flower, styles.flowerRight]} />
    <View style={[styles.flower, styles.flowerTop]} />
  </View>
);

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}) => {
  const [, setFocused] = useState(false);
  const animVal = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(animVal, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(animVal, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0f0e8', '#2ecc71'],
  });

  return (
    <Animated.View style={[styles.inputWrapper, { borderColor }]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aac8b8"
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

// Google Icon (simple G)
const GoogleIcon: React.FC = () => (
  <View style={styles.socialIconWrapper}>
    <Text style={[styles.socialIconText, { color: '#EA4335' }]}>G</Text>
  </View>
);

// Twitter Icon (X)
const TwitterIcon: React.FC = () => (
  <View style={[styles.socialIconWrapper, { backgroundColor: '#1DA1F2' }]}>
    <Text style={[styles.socialIconText, { color: '#fff' }]}>𝕏</Text>
  </View>
);

// Facebook Icon
const FacebookIcon: React.FC = () => (
  <View style={[styles.socialIconWrapperLarge, { backgroundColor: '#1877F2' }]}>
    <Text style={[styles.socialIconTextLarge, { color: '#fff' }]}>f</Text>
  </View>
);

type ScreenType = 'welcome' | 'signup' | 'login';

const LoginScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignUp = () => {
    // Handle sign up logic
    console.log('Sign Up:', { email, password, confirmPassword });
  };

  const handleLogin = () => {
    // Handle login logic
    console.log('Login:', { email, password });
  };

  // ─── WELCOME SCREEN ────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#27ae60" />
        <View style={styles.gradientBg}>
          {/* Top leaf illustration area */}
          <View style={styles.illustrationArea}>
            <LeafDecoration />
          </View>

          {/* Bottom card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Sign Up</Text>

            {/* Facebook button */}
            <TouchableOpacity
              style={styles.facebookButton}
              activeOpacity={0.85}
              onPress={() => setScreen('signup')}
            >
              <FacebookIcon />
              <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            {/* Email button */}
            <TouchableOpacity
              style={styles.emailButton}
              activeOpacity={0.85}
              onPress={() => setScreen('signup')}
            >
              <Text style={styles.emailButtonText}>I'll use email or phone</Text>
            </TouchableOpacity>

            {/* Social icons */}
            <View style={styles.socialRow}>
              <GoogleIcon />
              <TwitterIcon />
            </View>

            {/* Login link */}
            <View style={styles.loginLinkRow}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setScreen('login')}>
                <Text style={styles.loginLinkHighlight}>Login here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ─── SIGN UP SCREEN ────────────────────────────────────────────────────────
  if (screen === 'signup') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor="#27ae60" />
        <View style={styles.gradientBg}>
          {/* Top illustration — smaller */}
          <View style={styles.illustrationAreaSmall}>
            <LeafDecoration />
          </View>

          {/* White bottom sheet */}
          <View style={styles.formSheet}>
            <ScrollView
              contentContainerStyle={styles.formScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.formTitle}>Sign Up</Text>
              <Text style={styles.formSubtitle}>Hello. Create Your Account</Text>

              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              {/* Terms */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>I accept the policy and terms</Text>
              </TouchableOpacity>

              {/* Sign Up button */}
              <TouchableOpacity
                style={[styles.signUpButton, !acceptedTerms && styles.signUpButtonDisabled]}
                activeOpacity={0.85}
                onPress={handleSignUp}
                disabled={!acceptedTerms}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>

              {/* Social icons */}
              <View style={styles.socialRow}>
                <GoogleIcon />
                <TwitterIcon />
              </View>

              {/* Login link */}
              <View style={styles.loginLinkRow}>
                <Text style={styles.loginLinkText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => setScreen('login')}>
                  <Text style={styles.loginLinkHighlight}>Login here</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />
      <View style={styles.gradientBg}>
        <View style={styles.illustrationAreaSmall}>
          <LeafDecoration />
        </View>

        <View style={styles.formSheet}>
          <ScrollView
            contentContainerStyle={styles.formScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Login</Text>
            <Text style={styles.formSubtitle}>Welcome back!</Text>

            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <Text style={styles.signUpButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.socialRow}>
              <GoogleIcon />
              <TwitterIcon />
            </View>

            <View style={styles.loginLinkRow}>
              <Text style={styles.loginLinkText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setScreen('signup')}>
                <Text style={styles.loginLinkHighlight}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a8e6c0',
  },

  // ─── Background gradient simulation ───────────────────────────────────────
  gradientBg: {
    flex: 1,
    backgroundColor: '#2ecc71',
  },

  // ─── Leaf illustration area ────────────────────────────────────────────────
  illustrationArea: {
    height: height * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustrationAreaSmall: {
    height: height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  leafContainer: {
    width: width * 0.65,
    height: width * 0.65,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Leaves
  leaf: {
    position: 'absolute',
    borderRadius: 999,
  },
  leafBig: {
    width: 160,
    height: 180,
    backgroundColor: '#27ae60',
    top: 20,
    left: 40,
    transform: [{ rotate: '-10deg' }],
    opacity: 0.95,
  },
  leafMedLeft: {
    width: 100,
    height: 130,
    backgroundColor: '#52c27a',
    top: 50,
    left: 10,
    transform: [{ rotate: '-40deg' }],
  },
  leafMedRight: {
    width: 110,
    height: 140,
    backgroundColor: '#1e8449',
    top: 30,
    left: 100,
    transform: [{ rotate: '20deg' }],
  },
  leafSmallLeft: {
    width: 70,
    height: 100,
    backgroundColor: '#82e0aa',
    top: 80,
    left: 0,
    transform: [{ rotate: '-60deg' }],
  },
  leafSmallRight: {
    width: 80,
    height: 110,
    backgroundColor: '#239b56',
    top: 60,
    left: 140,
    transform: [{ rotate: '45deg' }],
  },

  // Flowers
  flower: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f1c40f',
  },
  flowerLeft: {
    top: 90,
    left: 20,
  },
  flowerRight: {
    top: 70,
    left: 155,
  },
  flowerTop: {
    top: 40,
    left: 100,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f39c12',
  },

  // ─── Welcome card ──────────────────────────────────────────────────────────
  welcomeCard: {
    flex: 1,
    backgroundColor: 'rgba(39,174,96,0.85)',
    paddingHorizontal: 36,
    paddingTop: 10,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 32,
    letterSpacing: 0.5,
  },

  // Facebook button
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    marginBottom: 16,
    justifyContent: 'center',
  },
  facebookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  // Email button
  emailButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },
  emailButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },

  // ─── Social row ────────────────────────────────────────────────────────────
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 18,
  },
  socialIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  socialIconText: {
    fontWeight: '800',
    fontSize: 18,
  },
  socialIconWrapperLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconTextLarge: {
    fontWeight: '800',
    fontSize: 20,
  },

  // Login link
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginLinkText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
  },
  loginLinkHighlight: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  // ─── Form sheet ────────────────────────────────────────────────────────────
  formSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 20,
    elevation: 10,
  },
  formScrollContent: {
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 40,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 4,
    alignSelf: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 24,
    alignSelf: 'center',
  },

  // ─── Input ─────────────────────────────────────────────────────────────────
  inputWrapper: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#f7fdf9',
    overflow: 'hidden',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#2d3436',
  },

  // ─── Terms ─────────────────────────────────────────────────────────────────
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  termsText: {
    color: '#27ae60',
    fontSize: 13,
    fontWeight: '500',
  },

  // ─── Sign Up button ────────────────────────────────────────────────────────
  signUpButton: {
    width: '100%',
    backgroundColor: '#2ecc71',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2ecc71',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 4,
  },
  signUpButtonDisabled: {
    backgroundColor: '#a8e6c0',
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  // ─── Forgot password ───────────────────────────────────────────────────────
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotText: {
    color: '#2ecc71',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default LoginScreen;