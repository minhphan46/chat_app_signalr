import 'dart:convert';
import 'dart:math';
import 'package:chat_app_mobile/core/constants.dart';
import 'package:flutter/material.dart';
import 'package:signalr_core/signalr_core.dart';
import '../models/message.dart';
import '../utils/remove_message_extra_char.dart';
import '../widgets/chat_appbar_widget.dart';
import '../widgets/chat_message_list_widget.dart';
import '../widgets/chat_type_message_widget.dart';

class ChatScreen extends StatefulWidget {
  final String userName;
  const ChatScreen(this.userName, {super.key});

  @override
  // ignore: library_private_types_in_public_api
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  @override
  void initState() {
    super.initState();
    openSignalRConnection();
    createRandomId();
  }

  int currentUserId = 0;
  //generate random user id
  createRandomId() {
    Random random = Random();
    currentUserId = random.nextInt(999999);
  }

  ScrollController chatListScrollController = ScrollController();
  TextEditingController messageTextController = TextEditingController();

  submitMessageFunction() async {
    var messageText = removeMessageExtraChar(messageTextController.text);
    await connection.invoke('SendUserMessage',
        args: [widget.userName, currentUserId, messageText]);
    messageTextController.text = "";

    Future.delayed(const Duration(milliseconds: 500), () {
      chatListScrollController.animateTo(
          chatListScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 500),
          curve: Curves.ease);
    });
  }

  @override
  void dispose() {
    chatListScrollController.dispose();
    messageTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: SizedBox(
        height: size.height,
        width: size.width,
        child: Column(
          children: [
            chatAppbarWidget(size, context),
            chatMessageWidget(
                chatListScrollController, messageModel, currentUserId),
            chatTypeMessageWidget(messageTextController, submitMessageFunction)
          ],
        ),
      ),
    );
  }

  //set url and configs
  final connection = HubConnectionBuilder()
      .withUrl(
          SERVER_URL,
          HttpConnectionOptions(
            logging: (level, message) => print(
              "Connect the signalR: $level: $message",
            ),
          ))
      .build();

  //connect to signalR
  Future<void> openSignalRConnection() async {
    await connection.start();
    connection.on('ReceiveMessage', (message) {
      _handleIncommingDriverLocation(message);
    });
    await connection.invoke('JoinUSer', args: [widget.userName, currentUserId]);
  }

  //get messages
  List<MessageModel> messageModel = [];
  Future<void> _handleIncommingDriverLocation(List<dynamic>? args) async {
    if (args != null) {
      var jsonResponse = json.decode(json.encode(args[0]));
      MessageModel data = MessageModel.fromJson(jsonResponse);
      setState(() {
        messageModel.add(data);
      });
    }
  }
}
