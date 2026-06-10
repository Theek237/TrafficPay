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
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Back to Fine Lookup'}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logoIcon}>🛡️</Text>
          <Text style={styles.title}>Officer Portal</Text>
          <Text style={styles.subtitle}>Authorized Personnel Only</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="officer@traffic.com"
            placeholderTextColor="#6b7280"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#6b7280"
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
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContainer: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  backText: { color: '#9ca3af', fontWeight: 'bold', fontSize: 14 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '900', color: '#ffffff' },
  subtitle: { fontSize: 14, fontWeight: 'bold', color: '#06b6d4', letterSpacing: 2, marginTop: 8 },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.5)', marginBottom: 20 },
  errorText: { color: '#fca5a5', textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16, color: '#fff' },
  loginBtn: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
