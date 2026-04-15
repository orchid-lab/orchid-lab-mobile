/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  FileText,
  ClipboardList,
  BookOpen,
  Sprout,
  FileBarChart2,
  AlertCircle
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { API_URL } from '@env';

// --- CONFIG & TYPES ---
const BASE_URL = API_URL;
const PAGE_SIZE = 10;
const QUICK_FILTERS = ['Tất cả', 'Tuần này', 'Tháng này', 'Quý 1'];

type Report = {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  sampleName: string;
  status: string;
  isNewest: boolean;
};

// --- COMPONENTS ---

const Header = () => (
  <Animated.View entering={FadeInDown.duration(500)} style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Báo Cáo</Text>
    <View style={styles.headerActions}>
      <TouchableOpacity style={styles.iconButton}>
        <Search size={22} color="#1F3D2F" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <SlidersHorizontal size={22} color="#1F3D2F" />
      </TouchableOpacity>
    </View>
  </Animated.View>
);

const FilterChips = ({ active, setActive }: { active: string; setActive: (v: string) => void }) => (
  <Animated.View entering={FadeInDown.delay(100).duration(500)}>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
      data={QUICK_FILTERS}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const isActive = active === item;
        return (
          <TouchableOpacity
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => setActive(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        );
      }}
    />
  </Animated.View>
);

// Tách MetricsSection ra và truyền totalCount vào để render động
const MetricsSection = ({ totalCount }: { totalCount: number }) => {
  const metrics = [
    { id: '1', title: 'Tổng số\nbáo cáo', value: totalCount.toString(), icon: FileBarChart2, color: '#FFFFFF' },
    // Tạm thời hardcode số báo cáo chờ xử lý, bạn có thể gọi API đếm sau
    { id: '2', title: 'Đang chờ\nxử lý', value: '3', icon: AlertCircle, color: '#A3F7BF' }, 
  ];

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.metricsContainer}>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <View key={metric.id} style={[styles.metricCard, { backgroundColor: metric.color }]}>
            <View style={styles.metricIconWrap}>
              <Icon size={20} color="#1F3D2F" />
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricTitle}>{metric.title}</Text>
          </View>
        );
      })}
    </Animated.View>
  );
};

const ReportItem = ({ item, index }: { item: Report; index: number }) => {
  const isDone = item.status === 'Approved' || item.status === 'Done';
  const displayStatus = isDone ? 'Đã duyệt' : (item.status === 'WaitingForApproval' ? 'Chờ duyệt' : item.status);
  const formattedDate = item.createdDate?.split('T')[0] ?? '';

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index * 100, 500)).springify()}>
      <TouchableOpacity style={styles.reportCard} activeOpacity={0.85}>
        {item.isNewest && <View style={styles.newDot} />}
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.reportDate}>{formattedDate} • 🌿 {item.sampleName}</Text>
        </View>

        <View style={[styles.statusTag, isDone ? styles.statusDone : styles.statusPending]}>
          {isDone ? (
            <CheckCircle2 size={14} color="#1F3D2F" style={{ marginRight: 4 }} />
          ) : (
            <Clock size={14} color="#1F3D2F" style={{ marginRight: 4 }} />
          )}
          <Text style={styles.statusText}>{displayStatus}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- CUSTOM BOTTOM TAB BAR ---
const CustomTabBar = () => {
  const TABS = [
    { id: 'tasks', label: 'Công việc', icon: ClipboardList, active: false },
    { id: 'logs', label: 'Nhật ký', icon: BookOpen, active: false },
    { id: 'reports', label: 'Báo cáo', icon: FileText, active: true }, // Tab hiện tại
    { id: 'batches', label: 'Nuôi cấy', icon: Sprout, active: false },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <TouchableOpacity key={tab.id} style={styles.tabItem} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, tab.active && styles.iconWrapperActive]}>
              <Icon size={22} color={tab.active ? '#A3F7BF' : '#8A9E92'} />
            </View>
            <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// --- MAIN SCREEN ---
const TechnicianReportsScreen = () => {
  const [activeFilter, setActiveFilter] = useState(QUICK_FILTERS[0]);
  const [data, setData] = useState<Report[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = useCallback(async (pageNo: number, replace: boolean) => {
    if (replace) setLoading(true); else setLoadingMore(true);
    try {
      const rawUrl = String(BASE_URL);
      const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

      const params = new URLSearchParams({
        pageNo: String(pageNo),
        pageSize: String(PAGE_SIZE),
      });

      const res = await fetch(`${cleanUrl}/api/monitoring-log?${params}`);
      const json = await res.json();
      
      const newData: Report[] = json.data ?? [];
      setTotalCount(json.totalCount ?? 0);
      setData(prev => replace ? newData : [...prev, ...newData]);
      setHasMore(pageNo < (json.pageCount ?? 1));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchReports(1, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchReports(1, true);
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchReports(next, false);
    }
  };

  const ListHeader = () => (
    <View style={styles.listHeaderPadding}>
      <MetricsSection totalCount={totalCount} />
      <Text style={styles.sectionTitle}>Danh sách báo cáo</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#DFE7DF', '#F2F6F2']} style={StyleSheet.absoluteFill} />

      <Header />

      <View style={{ height: 60, zIndex: 10 }}>
        <FilterChips active={activeFilter} setActive={setActiveFilter} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1F3D2F" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => <ReportItem item={item} index={index} />}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1F3D2F" />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#1F3D2F" style={{ marginVertical: 20 }} /> : null}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp.duration(400)} style={styles.center}>
              <FileText size={48} color="#9DB89D" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text style={{ color: '#1F3D2F', opacity: 0.6 }}>Chưa có báo cáo nào</Text>
            </Animated.View>
          }
        />
      )}

      <CustomTabBar />
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#DFE7DF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 110 },
  listHeaderPadding: { paddingTop: 10, paddingBottom: 16 },

  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, zIndex: 10 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#1F3D2F', lineHeight: 34 },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#1F3D2F', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },

  filterContainer: { paddingHorizontal: 24, alignItems: 'center' },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, backgroundColor: 'rgba(255, 255, 255, 0.4)', marginRight: 12 },
  chipActive: { backgroundColor: '#1F3D2F' },
  chipText: { fontSize: 15, fontWeight: '600', color: '#1F3D2F', opacity: 0.7 },
  chipTextActive: { color: '#A3F7BF', opacity: 1 },

  // SỬA LỖI ĐÈ NHAU Ở ĐÂY: Dùng gap thay vì marginLeft âm
  metricsContainer: { flexDirection: 'row', marginBottom: 40, gap: 16 },
  metricCard: { flex: 1, height: 160, borderRadius: 32, padding: 20, justifyContent: 'space-between', shadowColor: '#1F3D2F', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 15, elevation: 3 },
  metricIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(31, 61, 47, 0.08)', justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 26, fontWeight: '800', color: '#1F3D2F', marginTop: 12 },
  metricTitle: { fontSize: 14, fontWeight: '600', color: '#1F3D2F', opacity: 0.8, lineHeight: 20 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F3D2F', marginBottom: 16 },
  reportCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#1F3D2F', shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  newDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#A3F7BF' },
  reportInfo: { flex: 1, paddingRight: 16 },
  reportTitle: { fontSize: 16, fontWeight: '700', color: '#1F3D2F', marginBottom: 6 },
  reportDate: { fontSize: 13, color: '#1F3D2F', opacity: 0.6, fontWeight: '500' },
  statusTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  statusDone: { backgroundColor: '#A3F7BF' },
  statusPending: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#1F3D2F', borderStyle: 'dashed' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#1F3D2F' },

  // BOTTOM TAB BAR STYLES
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: '#1F3D2F',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 15,
    elevation: 10,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 70 },
  iconWrapper: { padding: 8, borderRadius: 20 },
  iconWrapperActive: { backgroundColor: 'rgba(163, 247, 191, 0.15)' },
  tabLabel: { fontSize: 10, fontWeight: '600', color: '#8A9E92', marginTop: 4 },
  tabLabelActive: { color: '#A3F7BF', fontWeight: '800' },
});

export default TechnicianReportsScreen;