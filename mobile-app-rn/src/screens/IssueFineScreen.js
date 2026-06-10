import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import apiService from '../services/apiService';

export default function IssueFineScreen({ navigation }) {
  const [vehicleNo, setVehicleNo] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueFine = async () => {
    if (!vehicleNo || !selectedCategory) {
      Alert.alert('Validation Error', 'Please enter vehicle number and select an offense.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Dummy districtId for now, matching the behavior
      const payload = {
        vehicleNo: vehicleNo.trim().toUpperCase(),
        categoryId: selectedCategory._id,
        districtId: '60d5ecb54d6bbb2b5c000000'
      };
      const fine = await apiService.issueFine(payload);
      Alert.alert('Success', `Fine Issued!\nRef: ${fine.referenceNo}`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Vehicle Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. WP CAA 1234"
        value={vehicleNo}
        onChangeText={setVehicleNo}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Offense Category</Text>
      {isLoading ? (
        <ActivityIndicator color="#3f51b5" />
      ) : (
        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat._id}
              style={[
                styles.categoryCard, 
                selectedCategory?._id === cat._id && styles.categoryCardSelected
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory?._id === cat._id && styles.categoryTextSelected
              ]}>
                {cat.name} ({cat.code})
              </Text>
              <Text style={styles.categoryAmount}>LKR {cat.baseAmount?.$numberDecimal || cat.baseAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
        onPress={handleIssueFine}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>ISSUE FINE TICKET</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 24 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 16, fontSize: 16 },
  categoryList: { marginTop: 8 },
  categoryCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 8 },
  categoryCardSelected: { borderColor: '#3f51b5', backgroundColor: '#eef2ff' },
  categoryText: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  categoryTextSelected: { color: '#3f51b5' },
  categoryAmount: { color: '#6b7280', marginTop: 4 },
  submitBtn: { backgroundColor: '#3f51b5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  disabledBtn: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
