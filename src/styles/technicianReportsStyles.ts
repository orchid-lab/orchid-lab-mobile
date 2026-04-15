import { StyleSheet, Dimensions } from 'react-native';

Dimensions.get('window');

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F7F4' },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1B2A1B' },
  countPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: { fontSize: 12, fontWeight: '700', color: '#388E3C' },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7F4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1B2A1B', padding: 0 },

  // Filter chips
  chipRow: { paddingHorizontal: 20, paddingVertical: 12 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E0E8E0',
  },
  chipActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#5A7A5A' },
  chipTextActive: { color: '#fff' },

  // List
  list: { paddingHorizontal: 20, paddingBottom: 32 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#2E7D32',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  newDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingRight: 16,
  },
  cardName: { fontSize: 15, fontWeight: '700', color: '#1B2A1B', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardSample: { fontSize: 13, color: '#5A7A5A', marginBottom: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMeta: { fontSize: 12, color: '#9DB89D' },

  // Empty / Loading
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: '#9DB89D', marginTop: 8 },
});