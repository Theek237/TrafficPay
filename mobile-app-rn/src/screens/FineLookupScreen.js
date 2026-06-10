import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import apiService from '../services/apiService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FineLookupScreen({ navigation }) {
  const [refNo, setRefNo] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async () => {
    if (!refNo || !categoryCode) {
      Alert.alert('Error', 'Please enter Reference No and Category Code');
      return;
    }

    setIsLoading(true);
    try {
      const fineData = await apiService.lookupFine(refNo.trim(), categoryCode.trim());
      
      if (fineData.status === 'PAID') {
        Alert.alert('Info', 'This fine has already been PAID.');
      } else {
        navigation.navigate('Payment', { fineData });
      }
    } catch (e) {
      Alert.alert('Not Found', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.icon}>🔍</Text>
          <Text style={styles.title}>Find Your Fine</Text>
          <Text style={styles.subtitle}>Enter the details from your physical ticket.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Reference Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. FIN-123456"
            value={refNo}
            onChangeText={setRefNo}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Category Code</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. SPD"
            value={categoryCode}
            onChangeText={setCategoryCode}
            autoCapitalize="characters"
          />

          <TouchableOpacity 
            style={[styles.btn, isLoading && styles.btnDisabled]} 
            onPress={handleLookup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>SEARCH RECORD</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContainer: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  backText: { color: '#3f51b5', fontWeight: 'bold', fontSize: 16 },
  header: { alignItems: 'center', marginBottom: 40 },
  icon: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', color: '#1f2937' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 8 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16 },
  btn: { backgroundColor: '#3f51b5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
