import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import { C } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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

  // Background decorative circles
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