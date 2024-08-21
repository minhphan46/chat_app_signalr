import 'package:chat_app_mobile/utils/app_theme.dart';
import 'package:flutter/material.dart';

Widget chatAppbarWidget(Size size, BuildContext context) {
  return Stack(
    children: [
      Container(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 6),
        width: size.width,
        height: 100,
        color: AppTheme.gradientColorFrom,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Flutter chat application',
              style: AppTheme.loginTitleStyle.copyWith(fontSize: 25),
            ),
          ],
        ),
      ),
      // icon pop
      Positioned(
        top: 30,
        bottom: 0,
        left: 10,
        child: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    ],
  );
}
