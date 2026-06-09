import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const TrafficPayApp());
}

class TrafficPayApp extends StatelessWidget {
  const TrafficPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TrafficPay Officer',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
