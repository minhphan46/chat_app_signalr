import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import '../widgets/login_button_widget.dart';
import '../widgets/login_header_widge.dart';
import '../widgets/login_main_image_widget.dart';
import '../widgets/login_subtitle_widget.dart';
import '../widgets/login_text_input_widget.dart';
import '../widgets/login_version_widget.dart';
import 'chat_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController usernameTextController = TextEditingController();

  onTapButton() {
    if (usernameTextController.text.isEmpty) {
      const snackBar = SnackBar(
        content: Text(
          'Please enter your name',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        backgroundColor: Colors.redAccent,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    } else {
      Navigator.push(
        context,
        MaterialPageRoute<void>(
          builder: (BuildContext context) =>
              ChatScreen(usernameTextController.text),
        ),
      );
    }
  }

  @override
  void dispose() {
    usernameTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        decoration: AppTheme.loginContainerBoxdecoration,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: SizedBox(
            height: size.height,
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: <Widget>[
                loginHeaderWidget(),
                loginSubtitleWidget(),
                loginMainImageWidget(size),
                loginTextInputWidget(size, usernameTextController),
                loginButtonWidget(size, onTapButton),
                loginVersionWidget()
              ],
            ),
          ),
        ),
      ),
    );
  }
}
