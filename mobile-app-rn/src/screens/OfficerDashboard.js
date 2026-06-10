import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import apiService from '../services/apiService';

export default function OfficerDashboard({ navigation }) {
  const handleLogout = async () => {
    await apiService.logout();
    navigation.replace('Login');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📋</Text>
        <Text style={styles.title}>Ready for Duty</Text>
        <Text style={styles.subtitle}>Click the button below to issue a new fine.</Text>
      </View>
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('IssueFine')}
      >
        <Text style={styles.fabText}>+ Issue Fine</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  icon: { fontSize: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  subtitle: { color: '#9ca3af', textAlign: 'center' },
  logoutBtn: { marginRight: 16 },
  logoutText: { color: '#06b6d4', fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 32, right: 24, backgroundColor: '#3b82f6', 
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, 
    elevation: 4, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
});
