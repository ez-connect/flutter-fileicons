import 'package:flutter/material.dart';

import 'package:fileicons/fileicons.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter FileIcons Example',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      debugShowCheckedModeBanner: false,
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final items = FileIconsMapping.entries.toList();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter FileIcons'),
      ),
      body: GridView.extent(
        maxCrossAxisExtent: 86,
        childAspectRatio: 0.7,
        children: List.generate(items.length, (index) {
          final item = items[index];
          return Column(
            children: [
              Icon(FileIconsData(int.parse(item.value)), size: 64),
              const SizedBox(height: 8),
              Text(
                item.key,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12),
              ),
            ],
          );
        }),
      ),
    );
  }
}
