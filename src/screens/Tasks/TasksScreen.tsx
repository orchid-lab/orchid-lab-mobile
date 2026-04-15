/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardList, Search, SlidersHorizontal, ListChecks } from 'lucide-react-native';
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
  const [hasMore, setHasMore] = useState(true);

  const fetchTasks = useCallback(async (pageNo: number, replace: boolean) => {
    if (replace) setLoading(true);
    try {
      const cleanUrl = String(BASE_URL).replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/api/tasks?pageNo=${pageNo}&pageSize=${PAGE_SIZE}`);
      const json = await res.json();
      
      // LƯU Ý: Dữ liệu API này nằm trong json.value
      const responseData = json.value || {};
      const fetchedData = responseData.data ?? [];
      
      setData(prev => replace ? fetchedData : [...prev, ...fetchedData]);
      setTotalCount(responseData.totalCount ?? 0);
      setHasMore(pageNo < (responseData.pageCount ?? 1));
    } catch (e) {
      console.error("Lỗi fetch tasks:", e);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchTasks(1, true); }, []);

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
            {data.filter(i => i.status === 'Assigned').length}
          </Text>
          <Text style={styles.metricTitle}>Việc cần{"\n"}làm ngay</Text>
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
        <View style={styles.headerActions}>
          <Search size={22} color="#1F3D2F" />
          <SlidersHorizontal size={22} color="#1F3D2F" />
        </View>
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
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchTasks(1, true)} tintColor="#1F3D2F" />
          }
          onEndReached={() => hasMore && fetchTasks(page + 1, false)}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
        />
      )}
      <CustomTabBar />
    </SafeAreaView>
  );
};

export default TasksScreen;