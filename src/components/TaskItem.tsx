/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Info } from 'lucide-react-native';
import { styles } from '../screens/Reports/styles';

interface Props {
  item: {
    id: string;
    name: string;
    description: string;
    taskTargetType: string;
    status: string;
    expectedEndDate: string;
  };
}

export const TaskItem = ({ item }: Props) => {
  const isAssigned = item.status === 'Assigned';
  const displayDate = item.expectedEndDate ?? 'Không có hạn';

  return (
    <TouchableOpacity style={styles.reportCard} activeOpacity={0.85}>
      <View style={styles.reportInfo}>
        <Text style={styles.reportTitle} numberOfLines={1}>{item.name}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Info size={12} color="#5A7A5A" style={{ marginRight: 4 }} />
          <Text style={styles.reportDate}>Đối tượng: {item.taskTargetType}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Calendar size={12} color="#5A7A5A" style={{ marginRight: 4 }} />
          <Text style={styles.reportDate}>Hạn: {displayDate}</Text>
        </View>
      </View>

      <View style={[styles.statusTag, isAssigned ? styles.statusPending : styles.statusDone]}>
        <Text style={styles.statusText}>
          {isAssigned ? 'Đã giao' : item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};