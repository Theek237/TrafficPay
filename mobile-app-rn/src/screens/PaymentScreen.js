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

      <Text style={styles.inputLabel}>Cardholder Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.inputLabel}>Mobile Number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.inputLabel}>Card Number</Text>
      <TextInput style={styles.input} value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" secureTextEntry />

      <TouchableOpacity 
        style={[styles.payBtn, isLoading && styles.payBtnDisabled]} 
        onPress={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payBtnText}>PAY SECURELY</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 24 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 32, alignItems: 'center' },
  totalLabel: { color: '#6b7280', fontWeight: 'bold', letterSpacing: 1 },
  totalAmount: { fontSize: 40, fontWeight: '900', color: '#3f51b5', marginVertical: 8 },
  divider: { height: 1, backgroundColor: '#e5e7eb', width: '100%', marginVertical: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  rowLabel: { color: '#4b5563' },
  rowValue: { fontWeight: 'bold', color: '#1f2937' },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16 },
  payBtn: { backgroundColor: '#16a34a', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  payBtnDisabled: { opacity: 0.7 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
