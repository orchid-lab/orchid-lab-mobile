import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  // Container bọc ngoài để cố định vị trí ảnh
  bgContainer: {
    ...StyleSheet.absoluteFill,
    width: SCREEN_W,
    height: SCREEN_H,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Style cho ảnh - Ép theo kích thước màn hình
  bgImage: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  overlay: { 
    ...StyleSheet.absoluteFill, 
    backgroundColor: 'rgba(0, 0, 0, 0.2)' // Lớp phủ tối nhẹ để chữ nổi bật
  },
  contentContainer: { 
    flex: 1 
  },

  // ─── GREETING SECTION ───
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 12,
    letterSpacing: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // ─── GLASSMORPHISM CARD ───
  glassCard: {
    position: 'absolute',
    alignSelf: 'center',
    width: SCREEN_W * 0.88,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 32,
    padding: 28,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    // shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },

  // ─── UI ELEMENTS ───
  ctaGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  ctaText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  swipeHint: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  swipeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    opacity: 0.5,
    letterSpacing: 3,
    marginTop: 8,
  },
});