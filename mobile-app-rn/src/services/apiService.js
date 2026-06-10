import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConstants } from '../utils/constants';

class ApiService {
  async _getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = await AsyncStorage.getItem('traffic_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // Auth: Login
  async login(email, password) {
    try {
      const res = await axios.post(`${AppConstants.apiUrl}/auth/login`, {
        email,
        password,
      });
      const payload = res.data.data;
      if (payload && payload.token) {
        await AsyncStorage.setItem('traffic_token', payload.token);
        await AsyncStorage.setItem('traffic_user', JSON.stringify(payload.user));
        return payload.user;
      }
      throw new Error('Login failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  // Auth: Logout
  async logout() {
    await AsyncStorage.removeItem('traffic_token');
    await AsyncStorage.removeItem('traffic_user');
  }

  // System: Get Districts
  async getDistricts() {
    try {
      const res = await axios.get(`${AppConstants.apiUrl}/system/districts`);
      return res.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load districts');
    }
  }

  // Fines: Get Fine Categories
  async getCategories() {
    try {
      const res = await axios.get(`${AppConstants.apiUrl}/system/fine-categories`);
      return res.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load categories');
    }
  }

  // Fines: Get My Issued Fines (Officer)
  async getMyFines() {
    try {
      const headers = await this._getHeaders(true);
      const res = await axios.get(`${AppConstants.apiUrl}/fines`, { headers });
      return res.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to load fines');
    }
  }

  // Fines: Issue New Fine (Officer)
  async issueFine(payload) {
    try {
      const headers = await this._getHeaders(true);
      const res = await axios.post(`${AppConstants.apiUrl}/fines`, payload, { headers });
      return res.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to issue fine');
    }
  }

  // Fines: Lookup Fine (Public)
  async lookupFine(refNo, categoryCode) {
    try {
      const res = await axios.get(
        `${AppConstants.apiUrl}/fines/lookup?referenceNo=${refNo}&categoryCode=${categoryCode}`
      );
      return res.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Fine not found');
    }
  }

  // Payments: Confirm Payment (Public)
  async confirmPayment(fineId, payload) {
    try {
      const res = await axios.post(`${AppConstants.apiUrl}/payments/mock-confirm`, {
        fineId,
        ...payload,
      });
      return res.data.data.receiptNo;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Payment failed');
    }
  }
}

export default new ApiService();
