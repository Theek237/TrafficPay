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
        
        <View style={styles.header}>
          <Text style={styles.icon}>🚔</Text>
          <Text style={styles.title}>Traffic<Text style={{color: '#06b6d4'}}>Pay</Text></Text>
          <Text style={styles.subtitle}>Secure Smart City Fine Portal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Find Your Ticket</Text>
          <Text style={styles.label}>REFERENCE NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. FIN-123456"
            placeholderTextColor="#6b7280"
            value={refNo}
            onChangeText={setRefNo}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>CATEGORY CODE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. SPD"
            placeholderTextColor="#6b7280"
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

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.officerLink}>🔒 Officer Portal Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContainer: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  icon: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: '900', color: '#ffffff', tracking: -1 },
  subtitle: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16, color: '#fff' },
  btn: { backgroundColor: '#06b6d4', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  footer: { marginTop: 40, alignItems: 'center' },
  officerLink: { color: '#6b7280', fontSize: 14, fontWeight: '600' }
});
