import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f2027' },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: '#40d47a', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 15 },

  // Blobs
  blob1: { position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: '#40d47a18' },
  blob2: { position: 'absolute', top: 180, left: -80, width: 180, height: 180, borderRadius: 90, backgroundColor: '#1a9e4f12' },

  // Hero
  hero: { alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 28, paddingHorizontal: 24, position: 'relative' },
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 56 : 46, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff18', alignItems: 'center', justifyContent: 'center' },

  // Avatar
  avatarWrap: { marginTop: 16 },
  avatarRing: { width: 110, height: 110, borderRadius: 55, padding: 3, alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: 104, height: 104, borderRadius: 52, backgroundColor: '#1a2a35', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: 104, height: 104, borderRadius: 52 },
  avatarInitials: { color: '#40d47a', fontSize: 38, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#1a9e4f', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0f2027' },

  // Name / Role
  heroName: { color: '#fff', fontSize: 24, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', letterSpacing: 0.3 },
  roleBadge: { marginTop: 6, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, backgroundColor: '#40d47a22', borderWidth: 1, borderColor: '#40d47a44' },
  roleText: { color: '#40d47a', fontSize: 12, fontWeight: '600', letterSpacing: 0.8 },

  // Stats
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: '#ffffff0a', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, borderWidth: 1, borderColor: '#ffffff0f', width: SCREEN_W - 48 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '700' },
  statLabel: { color: '#aaa', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#ffffff22' },

  // Card
  card: { margin: 20, marginTop: 16, backgroundColor: '#162330', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#ffffff0f', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  editBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#40d47a22', borderRadius: 20, borderWidth: 1, borderColor: '#40d47a55' },
  editBtnText: { color: '#40d47a', fontSize: 13, fontWeight: '600', marginLeft: 4 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#ff4d4d18', borderRadius: 20, borderWidth: 1, borderColor: '#ff4d4d44' },
  cancelBtnText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600', marginLeft: 4 },

  // Field
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ffffff08' },
  fieldIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#40d47a15', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  fieldBody: { flex: 1 },
  fieldLabel: { color: '#88a89e', fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 3 },
  fieldValue: { color: '#e8f4ed', fontSize: 15, fontWeight: '500' },
  fieldInput: { color: '#fff', fontSize: 15, fontWeight: '500', borderBottomWidth: 1.5, borderBottomColor: '#40d47a', paddingVertical: 2, paddingHorizontal: 0 },

  // Save
  saveBtn: { marginTop: 22 },
  saveBtnGradient: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  // Logout
  logoutBtn: { flexDirection: 'row', marginHorizontal: 20, marginTop: 4, paddingVertical: 14, borderRadius: 14, backgroundColor: '#ff4d4d12', borderWidth: 1, borderColor: '#ff4d4d33', alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: '#ff6b6b', fontSize: 15, fontWeight: '600', marginLeft: 8 },
});