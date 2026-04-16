// src/screens/LoginScreen/styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bgImage: { ...StyleSheet.absoluteFill },
  overlay: { 
    ...StyleSheet.absoluteFill, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)' 
  },
  
  contentContainer: { flex: 1 },

  // Lời chào ban đầu (Căn giữa màn hình)
  headlineWrap: {
    position: 'absolute',
    top: SCREEN_H * 0.38,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headlineHello: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  headlineSub: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
    letterSpacing: 1.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Thẻ Glassmorphism
  glassCard: {
    position: 'absolute',
    alignSelf: 'center',
    width: SCREEN_W * 0.88,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // Không dùng elevation để tránh lỗi 2 màu trên Android
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },

  // Button & Feedback
  ctaGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  swipeHint: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  swipeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.5,
    letterSpacing: 2,
    marginTop: 8,
  },
});