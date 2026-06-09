import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class ApiService {
  // Common headers
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('traffic_token');
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // Auth: Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('${AppConstants.apiUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );
    final data = json.decode(res.body);
    if (res.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('traffic_token', data['token']);
      await prefs.setString('traffic_user', json.encode(data['user']));
      return data['user'];
    } else {
      throw Exception(data['message'] ?? 'Login failed');
    }
  }

  // Auth: Logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('traffic_token');
    await prefs.remove('traffic_user');
  }

  // Fines: Get Fine Categories
  Future<List<dynamic>> getCategories() async {
    final res = await http.get(Uri.parse('${AppConstants.apiUrl}/system/fine-categories'));
    if (res.statusCode == 200) {
      return json.decode(res.body)['data'];
    }
    throw Exception('Failed to load categories');
  }

  // Fines: Issue New Fine (Officer)
  Future<Map<String, dynamic>> issueFine(Map<String, dynamic> payload) async {
    final headers = await _getHeaders(includeAuth: true);
    final res = await http.post(
      Uri.parse('${AppConstants.apiUrl}/fines'),
      headers: headers,
      body: json.encode(payload),
    );
    final data = json.decode(res.body);
    if (res.statusCode == 201) {
      return data['data'];
    }
    throw Exception(data['message'] ?? 'Failed to issue fine');
  }

  // Fines: Lookup Fine (Public)
  Future<Map<String, dynamic>> lookupFine(String refNo, String categoryCode) async {
    final res = await http.get(
      Uri.parse('${AppConstants.apiUrl}/fines/lookup?referenceNo=$refNo&categoryCode=$categoryCode'),
    );
    final data = json.decode(res.body);
    if (res.statusCode == 200) {
      return data['data'];
    }
    throw Exception(data['message'] ?? 'Fine not found');
  }

  // Payments: Confirm Payment (Public)
  Future<String> confirmPayment(String fineId, Map<String, dynamic> payload) async {
    final res = await http.post(
      Uri.parse('${AppConstants.apiUrl}/payments/mock-confirm'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'fineId': fineId, ...payload}),
    );
    final data = json.decode(res.body);
    if (res.statusCode == 200) {
      return data['data']['receiptNo'];
    }
    throw Exception(data['message'] ?? 'Payment failed');
  }
}
