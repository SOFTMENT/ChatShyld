import 'package:flutter/material.dart';

class NavigationPage extends StatefulWidget {
  const NavigationPage({super.key});
  @override
  State<NavigationPage> createState() => _NavigationPageState();
}

class _NavigationPageState extends State<NavigationPage> {
  int _selectedIndex = 0;

  final _barBackground = const Color.fromARGB(255, 255, 255, 255);

  static const List<Widget> _pages = [
    ColoredPage(name: 'Calls', color: Colors.blue),
    ColoredPage(name: 'Chats', color: Colors.green),
    ColoredPage(name: 'Assist', color: Colors.red),
    ColoredPage(name: 'Settings', color: Colors.red),
  ];

  void _onTap(int idx) {
    setState(() {
      _selectedIndex = idx;
    });
  }

  Widget _buildNavItem({
    required String label,
    required List<Image> icon,
    required bool selected,
    required double iconSize,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          SizedBox(
            height: iconSize,
            width: iconSize,
            child: selected ? icon[0] : icon[1],
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: selected ? Colors.black : const Color(0XFF999999),
              fontSize: 13,
              fontWeight: FontWeight.w600,
              fontFamily: 'Inter',
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // keep pages alive
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: Container(
        color: _barBackground,
        padding: const EdgeInsets.only(left: 32, right: 32, top: 20),
        child: SafeArea(
          top: false,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildNavItem(
                label: 'Calls',
                icon: [
                  Image.asset('assets/icons/call_black.png'),
                  Image.asset('assets/icons/call_grey.png'),
                ],
                selected: _selectedIndex == 0,
                iconSize: 18,
                onTap: () => _onTap(0),
              ),
              _buildNavItem(
                label: 'Chats',
                icon: [
                  Image.asset('assets/icons/chat_black.png'),
                  Image.asset('assets/icons/chat_grey.png'),
                ],
                selected: _selectedIndex == 1,
                iconSize: 19,
                onTap: () => _onTap(1),
              ),
              _buildNavItem(
                label: 'Assist',
                icon: [
                  Image.asset('assets/icons/assist_black.png'),
                  Image.asset('assets/icons/assist_grey.png'),
                ],
                selected: _selectedIndex == 2,
                iconSize: 20,
                onTap: () => _onTap(2),
              ),
              _buildNavItem(
                label: 'Settings',
                icon: [
                  Image.asset('assets/icons/setting_black.png'),
                  Image.asset('assets/icons/setting_grey.png'),
                ],
                selected: _selectedIndex == 3,
                iconSize: 20,
                onTap: () => _onTap(3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ColoredPage extends StatelessWidget {
  final String name;
  final Color color;
  const ColoredPage({super.key, required this.name, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: color,
      alignment: Alignment.center,
      child: Text(
        name,
        style: const TextStyle(
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
}
