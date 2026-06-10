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
      Alert.alert('Error', 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssue = async () => {
    if (!vehicleNo || !selectedCategory) {
      Alert.alert('Error', 'Please enter vehicle number and select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        vehicleNo: vehicleNo.trim(),
        categoryId: selectedCategory._id,
      };
      const result = await apiService.issueFine(data);
      Alert.alert(
        'Success',
        `Fine issued successfully.\n\nReference: ${result.referenceNo}\n\nAsk the driver to pay online using this reference.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>VEHICLE REGISTRATION</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. CAB-1234"
          placeholderTextColor="#6b7280"
          value={vehicleNo}
          onChangeText={setVehicleNo}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>OFFENSE CATEGORY</Text>
        {isLoading ? (
          <ActivityIndicator color="#3b82f6" />
        ) : (
          <View style={styles.categoriesList}>
            {categories.map((cat) => {
              const isSelected = selectedCategory?._id === cat._id;
              const amount = cat.amount?.$numberDecimal || cat.amount;
              return (
                <TouchableOpacity
                  key={cat._id}
                  style={[styles.catCard, isSelected && styles.catCardSelected]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <View>
                    <Text style={[styles.catCode, isSelected && styles.catTextSelected]}>{cat.code}</Text>
                    <Text style={[styles.catName, isSelected && styles.catTextSelected]}>{cat.name}</Text>
                  </View>
                  <Text style={[styles.catAmount, isSelected && styles.catTextSelected]}>LKR {amount}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.issueBtn, isSubmitting && styles.issueBtnDisabled]} 
          onPress={handleIssue}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.issueBtnText}>ISSUE FINE TICKET</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scroll: { padding: 24, paddingBottom: 100 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 16, color: '#fff' },
  categoriesList: { gap: 12 },
  catCard: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: 'transparent'
  },
  catCardSelected: { borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' },
  catCode: { fontWeight: '900', color: '#9ca3af' },
  catName: { color: '#ffffff', marginTop: 4 },
  catAmount: { fontWeight: 'bold', color: '#06b6d4', fontSize: 16 },
  catTextSelected: { color: '#3b82f6' },
  bottomBar: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#050505', padding: 24, 
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' 
  },
  issueBtn: { backgroundColor: '#e11d48', padding: 16, borderRadius: 12, alignItems: 'center' },
  issueBtnDisabled: { opacity: 0.7 },
  issueBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
