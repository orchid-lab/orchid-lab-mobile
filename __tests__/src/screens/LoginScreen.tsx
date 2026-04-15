import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OrchidLab Mobile</Text>
      <Button title="Đăng nhập" onPress={() => console.log('Login pressed')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});