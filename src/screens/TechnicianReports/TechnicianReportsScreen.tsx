/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileBarChart2, AlertCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { API_URL } from '@env';

import { styles } from './styles';
import { CustomTabBar } from '../../components/CustomTabBar';
import { ReportItem } from '../../components/ReportItem';

const BASE_URL = API_URL;
const PAGE_SIZE = 100;
const QUICK_FILTERS = ['Tất cả', 'Tuần này', 'Tháng này', 'Quý 1'];

const TechnicianReportsScreen = () => {
  const [] = useState(QUICK_FILTERS[0]);
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page] = useState(1);
  const [, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchReports = useCallback(async (pageNo: number, replace: boolean) => {
  if (replace) setLoading(true); else setLoadingMore(true);
  try {
    const cleanUrl = String(BASE_URL).replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/api/monitoring-log?pageNo=${pageNo}&pageSize=${PAGE_SIZE}`);
    const json = await res.json();
    
    const fetchedData = json.data ?? [];
    setData(prev => replace ? fetchedData : [...prev, ...fetchedData]);
    setTotalCount(json.totalCount ?? 0);
    setHasMore(pageNo < (json.pageCount ?? 1));
    const pending = fetchedData.filter((item: any) => item.status === 'WaitingForApproval').length;
    setPendingCount(pending);

  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false); setLoadingMore(false); setRefreshing(false);
  }
  }, []);

  useEffect(() => { fetchReports(1, true); }, []);

  const ListHeader = () => (
  <View style={styles.listHeaderPadding}>
    <View style={styles.metricsContainer}>
      <View style={[styles.metricCard, { backgroundColor: '#FFFFFF' }]}>
        <FileBarChart2 size={20} color="#1F3D2F" />
        <Text style={styles.metricValue}>{totalCount}</Text>
        <Text style={styles.metricTitle}>Tổng số{"\n"}báo cáo</Text>
      </View>
      <View style={[styles.metricCard, { backgroundColor: '#A3F7BF' }]}>
        <AlertCircle size={20} color="#1F3D2F" />
        {/* THAY SỐ 3 THÀNH BIẾN PENDINGCOUNT */}
        <Text style={styles.metricValue}>{pendingCount}</Text>
        <Text style={styles.metricTitle}>Đang chờ{"\n"}xử lý</Text>
      </View>
    </View>
    <Text style={styles.sectionTitle}>Danh sách báo cáo</Text>
  </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#DFE7DF', '#F2F6F2']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      
      {/* Header UI */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Báo Cáo</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => <ReportItem item={item} index={index} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchReports(1, true)} tintColor="#1F3D2F" />}
        onEndReached={() => !loadingMore && hasMore && fetchReports(page + 1, false)}
        ListFooterComponent={loadingMore ? <ActivityIndicator color="#1F3D2F" /> : null}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />

      <CustomTabBar />
    </SafeAreaView>
  );
};

export default TechnicianReportsScreen;