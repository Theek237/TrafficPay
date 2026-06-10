import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import apiService from '../services/apiService';

export default function PaymentScreen({ route, navigation }) {
  const { fineData } = route.params;
  const amount = fineData.amount?.$numberDecimal || fineData.amount;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!name || !phone || !cardNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        payerName: name.trim(),
        payerPhone: phone.trim(),
        paymentMethod: 'CARD',
        cardNumber: cardNumber.trim(),
      };

      const receipt = await apiService.confirmPayment(fineData._id, payload);
      
      Alert.alert('Payment Successful', `Receipt: ${receipt}\n\nYour fine has been marked as PAID.`, [
        { text: 'DONE', onPress: () => navigation.popToTop() }
      ]);
    } catch (e) {
      Alert.alert('Payment Failed', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.totalLabel}>TOTAL DUE</Text>
        <Text style={styles.totalAmount}>LKR {amount}</Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Reference</Text>
          <Text style={styles.rowValue}>{fineData.referenceNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Vehicle</Text>
          <Text style={styles.rowValue}>{fineData.vehicleNo}</Text>
        </View>
      </View>

      <Text style={styles.inputLabel}>CARDHOLDER NAME</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="e.g. John Doe"
        placeholderTextColor="#6b7280"
      />

      <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
      <TextInput 
        style={styles.input} 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad" 
        placeholder="e.g. 0712345678"
        placeholderTextColor="#6b7280"
      />

      <Text style={styles.inputLabel}>CARD NUMBER</Text>
      <TextInput 
        style={styles.input} 
        value={cardNumber} 
        onChangeText={setCardNumber} 
        keyboardType="numeric" 
        secureTextEntry 
        placeholder="•••• •••• •••• ••••"
        placeholderTextColor="#6b7280"
      />

      <TouchableOpacity 
        style={[styles.payBtn, isLoading && styles.payBtnDisabled]} 
        onPress={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.payBtnText}>PAY SECURELY</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 24 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 32, alignItems: 'center' },
  totalLabel: { color: '#9ca3af', fontWeight: 'bold', letterSpacing: 1 },
  totalAmount: { fontSize: 40, fontWeight: '900', color: '#06b6d4', marginVertical: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', width: '100%', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  rowLabel: { color: '#9ca3af' },
  rowValue: { fontWeight: 'bold', color: '#fff' },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16, color: '#fff' },
  payBtn: { backgroundColor: '#06b6d4', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  payBtnDisabled: { opacity: 0.7 },
  payBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
