/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardList, ListChecks } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { API_URL } from '@env';

import { styles } from '../Reports/styles';
import { CustomTabBar } from '../../components/CustomTabBar';
import { TaskItem } from '../../components/TaskItem';

const BASE_URL = API_URL;
const PAGE_SIZE = 10;

const TasksScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchTasks = useCallback(async (pageNo: number, replace: boolean) => {
    if (replace) setLoading(true); else setLoadingMore(true);
    try {
      const cleanUrl = String(BASE_URL).replace(/\/+$/, '');
      
      // SỬA CHUẨN: Dùng pageNumber để tránh lỗi OFFSET âm
      const url = `${cleanUrl}/api/tasks?pageNumber=${pageNo}&pageSize=${PAGE_SIZE}`;
      const res = await fetch(url);
      const json = await res.json();
      
      const fetchedData = json.data ?? [];
      setData(prev => replace ? fetchedData : [...prev, ...fetchedData]);
      setTotalCount(json.totalCount ?? 0);
      setHasMore(pageNo < (json.pageCount ?? 1));
    } catch (e) {
      console.error("Lỗi fetch tasks:", e);
    } finally {
      setLoading(false); setLoadingMore(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(1, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchTasks(1, true);
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchTasks(next, false);
    }
  };

  const ListHeader = () => (
    <View style={styles.listHeaderPadding}>
      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, { backgroundColor: '#FFFFFF' }]}>
          <ClipboardList size={20} color="#1F3D2F" />
          <Text style={styles.metricValue}>{totalCount}</Text>
          <Text style={styles.metricTitle}>Tổng số{"\n"}công việc</Text>
        </View>
        <View style={[styles.metricCard, { backgroundColor: '#A3F7BF' }]}>
          <ListChecks size={20} color="#1F3D2F" />
          <Text style={styles.metricValue}>
            {data.filter(i => i.status === 'Template').length}
          </Text>
          <Text style={styles.metricTitle}>Công việc{"\n"}mẫu</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Danh sách công việc</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <LinearGradient 
        colors={['#DFE7DF', '#F2F6F2']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
      />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Công Việc</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1F3D2F" /></View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => <TaskItem item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1F3D2F" />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#1F3D2F" style={{ marginVertical: 20 }} /> : null}
        />
      )}
      <CustomTabBar />
    </SafeAreaView>
  );
};

export default TasksScreen;