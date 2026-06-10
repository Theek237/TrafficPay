import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import apiService from '../services/apiService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await apiService.login(email.trim(), password.trim());
      if (user.role === 'OFFICER' || user.role === 'ADMIN') {
        navigation.replace('OfficerDashboard');
      } else {
        setError('Access denied. Authorized personnel only.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🛡️</Text>
          <Text style={styles.title}>TrafficPay</Text>
          <Text style={styles.subtitle}>Officer Portal</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>SECURE LOGIN</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.publicBtn}
          onPress={() => navigation.navigate('FineLookup')}
        >
          <Text style={styles.publicBtnText}>🌍 Public Access: Pay a Fine</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContainer: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  logoIcon: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#3f51b5' },
  subtitle: { fontSize: 16, fontWeight: 'bold', color: '#666', letterSpacing: 2 },
  errorBox: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#fca5a5', marginBottom: 20 },
  errorText: { color: '#ef4444' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  loginBtn: { backgroundColor: '#3f51b5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 40 },
  publicBtn: { alignItems: 'center' },
  publicBtnText: { color: '#3f51b5', fontWeight: 'bold', fontSize: 16 },
});
