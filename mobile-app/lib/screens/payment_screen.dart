import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PaymentScreen extends StatefulWidget {
  final Map<String, dynamic> fineData;

  const PaymentScreen({super.key, required this.fineData});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cardController = TextEditingController();
  final _apiService = ApiService();
  bool _isLoading = false;
  
  Future<void> _paySecurely() async {
    if (_nameController.text.isEmpty || _phoneController.text.isEmpty || _cardController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final receipt = await _apiService.confirmPayment(
        widget.fineData['_id'],
        {
          'payerName': _nameController.text.trim(),
          'payerPhone': _phoneController.text.trim(),
          'paymentMethod': 'CARD',
          'cardNumber': _cardController.text.trim(),
        }
      );

      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (ctx) => AlertDialog(
            icon: const Icon(Icons.check_circle, color: Colors.green, size: 64),
            title: const Text('Payment Successful'),
            content: Text('Receipt: $receipt\n\nYour fine has been marked as PAID.', textAlign: TextAlign.center),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.pop(context); // Go back to lookup
                },
                child: const Text('DONE', style: TextStyle(fontWeight: FontWeight.bold)),
              )
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final fine = widget.fineData;
    final amount = fine['amount']['\$numberDecimal'] ?? fine['amount'];
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Complete Payment', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      const Text('TOTAL DUE', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black54)),
                      Text('LKR $amount', style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w900, color: Colors.indigo)),
                      const Divider(height: 32),
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Reference'), Text(fine['referenceNo'], style: const TextStyle(fontWeight: FontWeight.bold))]),
                      const SizedBox(height: 12),
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Vehicle'), Text(fine['vehicleNo'], style: const TextStyle(fontWeight: FontWeight.bold))]),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Cardholder Name', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: 'Mobile Number', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _cardController,
                decoration: const InputDecoration(labelText: 'Card Number', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _isLoading ? null : _paySecurely,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[600],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                ),
                child: _isLoading 
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('PAY SECURELY', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
