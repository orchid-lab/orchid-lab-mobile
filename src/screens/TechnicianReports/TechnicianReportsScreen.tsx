/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  Leaf,
  Sprout,
  CheckCircle2,
  Clock,
  DownloadCloud,
  Plus,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { API_URL } from '@env';

// --- CONFIG & TYPES ---
const BASE_URL = API_URL;
const PAGE_SIZE = 10;
const QUICK_FILTERS = ['Tuần này', 'Tháng này', 'Quý 1', 'Năm 2024'];

type Report = {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  sampleName: string;
  status: string;
  isNewest: boolean;
};

// --- MOCK METRICS (Có thể thay bằng API sau) ---
const METRICS = [
  { id: '1', title: 'Tổng CO2\ngiảm thiểu', value: '1,240T', icon: Leaf, color: '#FFFFFF' },
  { id: '2', title: 'Điểm\nbền vững', value: '98/100', icon: Sprout, color: '#A3F7BF' },
];

// --- COMPONENTS ---

const Header = () => (
  <Animated.View entering={FadeInDown.duration(500)} style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Báo Cáo{'\n'}Tác Động</Text>
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
      {QUICK_FILTERS.map((item) => {
        const isActive = active === item;
        return (
          <TouchableOpacity
            key={item}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => setActive(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </Animated.View>
);

const MetricsSection = () => (
  <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.metricsContainer}>
    {METRICS.map((metric, index) => {
      const Icon = metric.icon;
      return (
        <View
          key={metric.id}
          style={[
            styles.metricCard,
            {
              backgroundColor: metric.color,
              zIndex: METRICS.length - index,
              marginLeft: index > 0 ? -30 : 0,
            },
          ]}
        >
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

const ReportItem = ({ item, index }: { item: Report; index: number }) => {
  // Map Status API (Approved, WaitingForApproval,...) sang UI Tiếng Việt
  const isDone = item.status === 'Approved' || item.status === 'Done';
  const displayStatus = isDone ? 'Hoàn thành' : (item.status === 'WaitingForApproval' ? 'Chờ duyệt' : item.status);
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

// --- MAIN SCREEN ---
const ImpactReportsScreen = () => {
  const [activeFilter, setActiveFilter] = useState(QUICK_FILTERS[0]);
  const [data, setData] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- LOGIC GỌI API ---
  const fetchReports = useCallback(async (pageNo: number, replace: boolean) => {
    if (replace) setLoading(true); else setLoadingMore(true);
    try {
      // Tuyệt chiêu dọn dẹp URL
      const rawUrl = String(BASE_URL);
      const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

      const params = new URLSearchParams({
        pageNo: String(pageNo),
        pageSize: String(PAGE_SIZE),
        // Có thể thêm filter thời gian ở đây dựa vào biến activeFilter nếu Backend hỗ trợ
      });

      const res = await fetch(`${cleanUrl}/api/monitoring-log?${params}`);
      const json = await res.json();
      
      const newData: Report[] = json.data ?? [];
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

  // --- COMPONENT GỘP HEADER ---
  const ListHeader = () => (
    <View style={styles.listHeaderPadding}>
      <MetricsSection />
      <Text style={styles.sectionTitle}>Danh sách báo cáo</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Background Gradient cong mềm mại */}
      <LinearGradient
        colors={['#DFE7DF', '#F2F6F2']}
        style={StyleSheet.absoluteFill}
      />

      <Header />

      <View style={{ height: 60, zIndex: 10 }}>
        <FilterChips active={activeFilter} setActive={setActiveFilter} />
      </View>

      {/* TÍCH HỢP FLATLIST VỚI DỮ LIỆU API */}
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
          
          // Pagination Props
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1F3D2F" />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#1F3D2F" style={{ marginVertical: 20 }} /> : null}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp.duration(400)} style={styles.center}>
              <Leaf size={48} color="#9DB89D" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text style={{ color: '#1F3D2F', opacity: 0.6 }}>Chưa có báo cáo nào</Text>
            </Animated.View>
          }
        />
      )}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.9}>
          <DownloadCloud size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.btnPrimaryText}>Tải xuống tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
          <Plus size={20} color="#131313" style={{ marginRight: 8 }} />
          <Text style={styles.btnSecondaryText}>Yêu cầu báo cáo mới</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#DFE7DF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140, // Chừa khoảng trống cho Bottom Actions
  },
  listHeaderPadding: {
    paddingTop: 10,
    paddingBottom: 16,
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F3D2F',
    lineHeight: 34,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1F3D2F',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  // Filter Chips
  filterContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999, // Pill shape
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 12,
  },
  chipActive: {
    backgroundColor: '#1F3D2F',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F3D2F',
    opacity: 0.7,
  },
  chipTextActive: {
    color: '#A3F7BF',
    opacity: 1,
  },

  // Metrics Overlapping Cards
  metricsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  metricCard: {
    flex: 1,
    height: 180,
    borderRadius: 35, // Bo góc siêu lớn
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#1F3D2F',
    shadowOpacity: 0.08,
    shadowOffset: { width: -5, height: 10 },
    shadowRadius: 20,
    elevation: 5,
  },
  metricIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 61, 47, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F3D2F',
    marginTop: 20,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F3D2F',
    opacity: 0.8,
    lineHeight: 20,
  },

  // Report List
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F3D2F',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1F3D2F',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    position: 'relative',
  },
  newDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A3F7BF',
  },
  reportInfo: {
    flex: 1,
    paddingRight: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F3D2F',
    marginBottom: 6,
  },
  reportDate: {
    fontSize: 13,
    color: '#1F3D2F',
    opacity: 0.6,
    fontWeight: '500',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusDone: {
    backgroundColor: '#A3F7BF',
  },
  statusPending: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#1F3D2F',
    borderStyle: 'dashed',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F3D2F',
  },

  // Bottom Actions
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 32,
    /* Dùng gradient trong suốt thay vì rgba để tạo hiệu ứng fade mượt mà cho list ở dưới */
  },
  btnPrimary: {
    backgroundColor: '#131313',
    flexDirection: 'row',
    height: 60,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#131313',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF', // Đổi sang trắng để nổi bật trên nền
    flexDirection: 'row',
    height: 60,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#131313',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ImpactReportsScreen;