/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator,
  SafeAreaView, RefreshControl,
} from 'react-native';
import { s } from '../../styles/technicianReportsStyles';
import { ReportCard, Report } from './ReportCard';

const BASE_URL = 'https://your-api-url.com'; // ← đổi lại
const PAGE_SIZE = 10;
const FILTERS = ['All', 'Created', 'Pending', 'Done', 'Rejected'];

const TechnicianReportsScreen = () => {
  const [data, setData] = useState<Report[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = useCallback(async (pageNo: number, replace: boolean) => {
    if (replace) setLoading(true); else setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        pageNo: String(pageNo),
        pageSize: String(PAGE_SIZE),
        ...(search ? { nameSearchTerm: search } : {}),
        ...(activeFilter !== 'All' ? { status: activeFilter } : {}),
      });
      const res = await fetch(`${BASE_URL}/api/monitoring-log?${params}`);
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
  }, [search, activeFilter]);

  useEffect(() => {
    setPage(1);
    fetchReports(1, true);
  }, [search, activeFilter]);

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
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
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
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.chip, activeFilter === item && s.chipActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[s.chipText, activeFilter === item && s.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

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
          renderItem={({ item }) => (
            <ReportCard item={item} onPress={() => {}} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E7D32" />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#2E7D32" style={{ marginVertical: 12 }} /> : null}
          ListEmptyComponent={
            <View style={s.center}>
              <Text style={{ fontSize: 32 }}>🌿</Text>
              <Text style={s.emptyText}>No reports found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default TechnicianReportsScreen;