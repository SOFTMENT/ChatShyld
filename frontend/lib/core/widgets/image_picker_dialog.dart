import 'package:flutter/material.dart';

enum ImagePickerSource { gallery, camera, none }

class ImagePickerDialog {
  static Future<ImagePickerSource?> show(BuildContext context) {
    return showModalBottomSheet<ImagePickerSource>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        height: MediaQuery.of(context).size.height * 0.35,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF222222), Color(0xFF000000)],
          ), // dark grey
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Drag handle
            const Padding(
              padding: EdgeInsets.only(top: 12, bottom: 8),
              child: SizedBox(
                width: 40,
                height: 4,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: Colors.grey,
                    borderRadius: BorderRadius.all(Radius.circular(2)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Title
            const Text(
              'Upload Photo',

              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 12),
            const Divider(color: Colors.grey),

            // Options
            Expanded(
              child: ListView(
                children: [
                  _buildTile(
                    context,
                    icon: Icons.camera_alt,
                    label: 'Take Photo',

                    source: ImagePickerSource.camera,
                  ),
                  _buildTile(
                    context,
                    icon: Icons.photo_library,
                    label: 'Choose from Gallery',
                    source: ImagePickerSource.gallery,
                  ),
                  _buildTile(
                    context,
                    icon: Icons.close,
                    label: 'Cancel',
                    source: ImagePickerSource.none,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Widget _buildTile(
    BuildContext context, {
    required IconData icon,
    required String label,
    required ImagePickerSource source,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(
        label,
        style: const TextStyle(color: Colors.white, fontSize: 16),
      ),
      onTap: () => Navigator.pop(context, source),
      contentPadding: const EdgeInsets.symmetric(horizontal: 24),
      horizontalTitleGap: 16,
    );
  }
}
