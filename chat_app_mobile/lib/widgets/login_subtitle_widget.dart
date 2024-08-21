import 'package:flutter/cupertino.dart';
import '../utils/app_theme.dart';

Widget loginSubtitleWidget() {
  return Padding(
    padding: const EdgeInsets.only(top: 12),
    child: Text(
      'Flutter - ASP.NET Core - signalR',
      style: AppTheme.loginSubTitleTitleStyle,
    ),
  );
}
