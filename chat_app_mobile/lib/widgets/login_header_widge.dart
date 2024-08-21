import 'package:flutter/cupertino.dart';

import '../utils/app_theme.dart';

Widget loginHeaderWidget() {
  return Padding(
    padding: const EdgeInsets.only(top: 64),
    child: Text(
      'Flutter Chat App',
      style: AppTheme.loginTitleStyle,
    ),
  );
}
