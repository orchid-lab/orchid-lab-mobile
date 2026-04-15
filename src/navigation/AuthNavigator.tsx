/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import ExperimentLogScreen from '../screens/ExperimentLog/ExperimentLogScreen';
import SamplesScreen from '../screens/Samples/SamplesScreen';
import BatchesScreen from '../screens/Batches/BatchesScreen';
import TasksScreen from '../screens/Tasks/TasksScreen';
import { QuickMenu } from '../components/QuickMenu';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'none', 
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TechnicianReports" component={ReportsScreen} />
        <Stack.Screen name="ExperimentLog" component={ExperimentLogScreen} />
        <Stack.Screen name="Samples" component={SamplesScreen} />
        <Stack.Screen name="Batches" component={BatchesScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
      </Stack.Navigator>
      <QuickMenu />
    </View>
  );
};