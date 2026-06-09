import 'package:flutter/material.dart';
import '../services/api_service.dart';

class IssueFineScreen extends StatefulWidget {
  const IssueFineScreen({super.key});

  @override
  State<IssueFineScreen> createState() => _IssueFineScreenState();
}

class _IssueFineScreenState extends State<IssueFineScreen> {
  final _vehicleController = TextEditingController();
  final _driverController = TextEditingController();
  final _licenseController = TextEditingController();
  final _apiService = ApiService();
  
  List<dynamic> _categories = [];
  String? _selectedCategory;
  bool _isLoading = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoading = true);
    try {
      final cats = await _apiService.getCategories();
      setState(() => _categories = cats);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to load categories')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _submitFine() async {
    if (_vehicleController.text.isEmpty || _selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vehicle No and Category are required')));
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final fine = await _apiService.issueFine({
        'vehicleNo': _vehicleController.text.trim(),
        'categoryId': _selectedCategory,
        'driverName': _driverController.text.trim(),
        'driverLicense': _licenseController.text.trim(),
        'districtId': '60d5ecb54d6bbb2b5c000000', // Dummy fallback if required
        'location': 'Mobile Entry',
      });
      
      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (ctx) => AlertDialog(
            title: const Text('Fine Issued'),
            content: Text('Ref: ${fine['referenceNo']}\nAmount: LKR ${fine['amount']['\$numberDecimal'] ?? fine['amount']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.pop(context);
                },
                child: const Text('DONE'),
              )
            ],
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Issue New Fine', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextField(
                  controller: _vehicleController,
                  decoration: InputDecoration(
                    labelText: 'Vehicle Number *',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    labelText: 'Offense Category *',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  value: _selectedCategory,
                  items: _categories.map((cat) {
                    return DropdownMenuItem<String>(
                      value: cat['_id'],
                      child: Text('${cat['code']} - ${cat['name']}'),
                    );
                  }).toList(),
                  onChanged: (val) => setState(() => _selectedCategory = val),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _driverController,
                  decoration: InputDecoration(
                    labelText: 'Driver Name (Optional)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _licenseController,
                  decoration: InputDecoration(
                    labelText: 'Driver License No (Optional)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitFine,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.indigo,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isSubmitting 
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('ISSUE TICKET', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ],
            ),
          ),
    );
  }
}
