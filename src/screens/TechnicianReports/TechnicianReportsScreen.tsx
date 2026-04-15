/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { s } from '../../styles/technicianReportsStyles';
import { ReportCard, Report } from './ReportCard';
import { API_URL } from '@env';

const BASE_URL = API_URL;
const PAGE_SIZE = 10;

const TechnicianReportsScreen = () => {
  const [data, setData] = useState<Report[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
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
        ...(search ? { nameSearchTerm: search } : {}),
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
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchReports(1, true);
  }, [search]); 

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

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom', 'left', 'right']}>
      <Animated.View 
        style={s.header}
        entering={FadeInDown.duration(600).springify()}
      >
        <View style={s.headerTop}>
          <Text style={s.headerTitle}>Reports</Text>
          <View style={s.countPill}>
            <Text style={s.countText}>{totalCount} total</Text>
          </View>
        </View>
        <View style={s.searchWrap}>
          <Text>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search by name..."
            placeholderTextColor="#9DB89D"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#9DB89D' }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* List */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(Math.min(index * 100, 600)).springify()}>
              <ReportCard item={item} onPress={() => {}} />
            </Animated.View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E7D32" />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#2E7D32" style={{ marginVertical: 12 }} /> : null}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp.duration(400)} style={s.center}>
              <Text style={{ fontSize: 32 }}>🌿</Text>
              <Text style={s.emptyText}>No reports found</Text>
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default TechnicianReportsScreen;