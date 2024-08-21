import 'package:flutter/cupertino.dart';
import '../utils/app_theme.dart';

Widget loginVersionWidget() {
  return Expanded(
      child: Container(
    child: Padding(
      padding: const EdgeInsets.only(bottom: 32),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: Text(
          'version 1.0.0',
          style: AppTheme.loginHelpStyle,
        ),
      ),
    ),
  ));
}
