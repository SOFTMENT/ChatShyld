// lib/core/logging/log.dart
import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

final log = Logger(
  level: kReleaseMode ? Level.warning : Level.debug,
  printer: PrettyPrinter(
    methodCount: 0,
    errorMethodCount: 8,
    lineLength: 80,
    colors: !kReleaseMode,
    printEmojis: true,
    // printTime: true, // ❌ deprecated
    dateTimeFormat: kReleaseMode
        ? DateTimeFormat.none
        : DateTimeFormat.onlyTimeAndSinceStart, // ✅
  ),
);
