import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import apiService from '../services/apiService';

export default function OfficerDashboard({ navigation }) {
  const [fines, setFines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFines = async () => {
    try {
      const data = await apiService.getMyFines();
      setFines(data);
    } catch (error) {
      console.log('Failed to fetch fines:', error);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    await fetchFines();
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchFines();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadInitialData();
    
    // Refresh when returning to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFines();
    });
    return unsubscribe;
  }, [navigation]);

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

  const renderTicket = ({ item }) => {
    const isPaid = item.status === 'PAID';
    const amount = item.amount?.$numberDecimal || item.amount;
    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.refNo}>{item.referenceNo}</Text>
          <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusPending]}>
            <Text style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextPending]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.ticketBody}>
          <View>
            <Text style={styles.label}>VEHICLE</Text>
            <Text style={styles.value}>{item.vehicleNo}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>AMOUNT</Text>
            <Text style={styles.amount}>LKR {amount}</Text>
          </View>
        </View>

        <View style={styles.ticketFooter}>
          <Text style={styles.category}>{item.categoryId?.name}</Text>
          <Text style={styles.date}>{new Date(item.issuedAt).toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : fines.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.title}>Ready for Duty</Text>
          <Text style={styles.subtitle}>You haven't issued any fines yet.</Text>
        </View>
      ) : (
        <FlatList
          data={fines}
          keyExtractor={(item) => item._id}
          renderItem={renderTicket}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
          }
        />
      )}
      
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  listContainer: { padding: 16, paddingBottom: 100 },
  icon: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  subtitle: { color: '#9ca3af', textAlign: 'center' },
  logoutBtn: { marginRight: 16 },
  logoutText: { color: '#06b6d4', fontWeight: 'bold' },
  
  ticketCard: { 
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  refNo: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusPending: { backgroundColor: 'rgba(234,179,8,0.1)', borderColor: '#eab308' },
  statusPaid: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: '#22c55e' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextPending: { color: '#eab308' },
  statusTextPaid: { color: '#22c55e' },
  
  ticketBody: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  label: { color: '#6b7280', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  value: { color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' },
  amount: { color: '#06b6d4', fontSize: 16, fontWeight: 'bold' },
  
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  category: { color: '#9ca3af', fontSize: 14 },
  date: { color: '#6b7280', fontSize: 12 },

  fab: { 
    position: 'absolute', bottom: 32, right: 24, backgroundColor: '#3b82f6', 
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, 
    elevation: 4, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
});
