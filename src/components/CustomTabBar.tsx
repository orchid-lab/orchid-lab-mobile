import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ClipboardList, BookOpen, FileText, Sprout } from 'lucide-react-native';
import { styles } from '../screens/TechnicianReports/styles';

const TABS = [
  { id: 'tasks', label: 'Công việc', icon: ClipboardList, active: false },
  { id: 'logs', label: 'Nhật ký', icon: BookOpen, active: false },
  { id: 'reports', label: 'Báo cáo', icon: FileText, active: true },
  { id: 'batches', label: 'Lô nuôi cấy', icon: Sprout, active: false },
];

export const CustomTabBar = () => {
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