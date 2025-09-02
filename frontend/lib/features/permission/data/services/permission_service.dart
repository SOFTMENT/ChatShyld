// lib/core/services/permission_service.dart

import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

/// A universal permission handler that can request any single permission,
/// show a custom rationale dialog, and open app settings if permanently denied.
class PermissionService {
  /// Requests the given [permission].
  ///
  /// [context]: Required for showing dialogs.
  /// [rationale]: Optional message to display before requesting if denied.
  /// [deniedMessage]: Message to show if permission is permanently denied.
  ///
  /// Returns `true` if granted, `false` otherwise.
  Future<bool> request(
    BuildContext context, {
    required Permission permission,
    String? rationale,
    String? deniedMessage,
  }) async {
    // 1. Check current status
    var status = await permission.status;

    if (!context.mounted) return false;
    // 2. If denied and a rationale is provided, show rationale dialog first
    if (status.isDenied && rationale != null) {
      final proceed = await showDialog<bool>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Permission Required'),
          content: Text(rationale),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Continue'),
            ),
          ],
        ),
      );
      if (proceed != true) return false;
    }

    // 3. Request permission
    status = await permission.request();
    if (!context.mounted) return false;
    // 4. If permanently denied, show settings dialog
    if (status.isPermanentlyDenied) {
      await showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Permission Permanently Denied'),
          content: Text(
            deniedMessage ??
                'Permission was permanently denied. Please enable it in app settings.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                openAppSettings();
                Navigator.pop(context);
              },
              child: const Text('Open Settings'),
            ),
          ],
        ),
      );
      return false;
    }

    // 5. Return whether granted
    return status.isGranted;
  }
}
