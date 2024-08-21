import 'package:flutter/material.dart';

Widget loginTextInputWidget(
    Size size, TextEditingController usernameTextController) {
  return Padding(
    padding: const EdgeInsets.only(top: 0, left: 50, right: 50),
    child: SizedBox(
      height: 60,
      width: size.width,
      child: TextField(
        maxLength: 25,
        controller: usernameTextController,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          counterText: "",
          enabledBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.white, width: 1.0),
            borderRadius: BorderRadius.circular(32),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.white, width: 1.0),
            borderRadius: BorderRadius.circular(32),
          ),
          filled: true,
          hintText: "Enter your name",
          hintStyle: const TextStyle(
            color: Colors.white,
          ),
          contentPadding: const EdgeInsets.fromLTRB(32, 16, 32, 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(160),
          ),
        ),
      ),
    ),
  );
}
