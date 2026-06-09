import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const TrafficPayApp());
}

class TrafficPayApp extends StatelessWidget {
  const TrafficPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TrafficPay',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: const FineLookupScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class FineLookupScreen extends StatefulWidget {
  const FineLookupScreen({super.key});

  @override
  State<FineLookupScreen> createState() => _FineLookupScreenState();
}

class _FineLookupScreenState extends State<FineLookupScreen> {
  final _refController = TextEditingController();
  final _categoryController = TextEditingController();
  bool _isLoading = false;
  String? _error;

  // Assuming emulator access to localhost
  // If running on a physical Android device, change to your local IP (e.g., 192.168.1.x)
  final String apiUrl = 'http://10.0.2.2:5000/api/v1';

  Future<void> _lookupFine() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await http.get(Uri.parse(
          '$apiUrl/fines/lookup?referenceNo=${_refController.text.trim()}&categoryCode=${_categoryController.text.trim()}'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body)['data'];
        if (mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => PaymentScreen(fineData: data, apiUrl: apiUrl),
            ),
          );
        }
      } else {
        setState(() {
          _error = json.decode(response.body)['message'] ?? 'Fine not found';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Connection error. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Sri Lanka Traffic Fines', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              const Icon(Icons.security, size: 80, color: Colors.indigo),
              const SizedBox(height: 20),
              const Text(
                'On-The-Spot Payment',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.black87),
              ),
              const SizedBox(height: 8),
              const Text(
                'Enter your fine details from the traffic sheet to proceed with secure payment.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.black54),
              ),
              const SizedBox(height: 40),
              
              if (_error != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(color: Colors.red[50], borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.red.shade200)),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline, color: Colors.red),
                      const SizedBox(width: 8),
                      Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red))),
                    ],
                  ),
                ),

              TextField(
                controller: _refController,
                decoration: InputDecoration(
                  labelText: 'Reference Number',
                  hintText: 'TF-YYYYMMDD-123456',
                  prefixIcon: const Icon(Icons.numbers),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _categoryController,
                decoration: InputDecoration(
                  labelText: 'Category Code',
                  hintText: 'SP-01',
                  prefixIcon: const Icon(Icons.category),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _lookupFine,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                ),
                child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('FIND RECORD', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class PaymentScreen extends StatefulWidget {
  final Map<String, dynamic> fineData;
  final String apiUrl;

  const PaymentScreen({super.key, required this.fineData, required this.apiUrl});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cardController = TextEditingController();
  bool _isLoading = false;
  
  Future<void> _paySecurely() async {
    if (_nameController.text.isEmpty || _phoneController.text.isEmpty || _cardController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('${widget.apiUrl}/payments/mock-confirm'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'fineId': widget.fineData['_id'],
          'payerName': _nameController.text.trim(),
          'payerPhone': _phoneController.text.trim(),
          'paymentMethod': 'CARD',
          'cardNumber': _cardController.text.trim(),
        }),
      );

      if (response.statusCode == 200) {
        final receipt = json.decode(response.body)['data']['receiptNo'];
        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (ctx) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              icon: const Icon(Icons.check_circle, color: Colors.green, size: 64),
              title: const Text('Payment Successful'),
              content: Text('Receipt: $receipt\n\nAn SMS notification has been sent to the officer. You may collect your license.', textAlign: TextAlign.center),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(ctx); // Close dialog
                    Navigator.pop(context); // Go back to lookup
                  },
                  child: const Text('DONE', style: TextStyle(fontWeight: FontWeight.bold)),
                )
              ],
            ),
          );
        }
      } else {
        throw Exception();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Payment failed. Try again.')));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final fine = widget.fineData;
    final amount = fine['amount']['\$numberDecimal'];
    
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Complete Payment', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Fine Summary Card
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      const Text('TOTAL AMOUNT DUE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black54, letterSpacing: 1.5)),
                      const SizedBox(height: 8),
                      Text('LKR $amount', style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w900, color: Colors.indigo)),
                      const Divider(height: 32),
                      _buildSummaryRow(Icons.confirmation_number, 'Reference', fine['referenceNo']),
                      const SizedBox(height: 12),
                      _buildSummaryRow(Icons.directions_car, 'Vehicle', fine['vehicleNo']),
                      const SizedBox(height: 12),
                      _buildSummaryRow(Icons.warning, 'Violation', fine['categoryId']['name']),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),
              
              const Text('Payment Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87)),
              const SizedBox(height: 16),
              
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Cardholder Name',
                  prefixIcon: const Icon(Icons.person),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: 'Mobile Number',
                  hintText: '07XXXXXXXX',
                  prefixIcon: const Icon(Icons.phone_android),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _cardController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Card Number',
                  hintText: 'XXXX XXXX XXXX XXXX',
                  prefixIcon: const Icon(Icons.credit_card),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
              
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _isLoading ? null : _paySecurely,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[600],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                ),
                child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.lock, size: 18),
                          SizedBox(width: 8),
                          Text('PAY SECURELY', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
                        ],
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.black45),
        const SizedBox(width: 12),
        Text(label, style: const TextStyle(color: Colors.black54)),
        const Spacer(),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black87)),
      ],
    );
  }
}
  // End of app
