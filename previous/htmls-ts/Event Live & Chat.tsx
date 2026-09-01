import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function LiveScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      name: "Rajesh Kumar",
      text: "Great session! बहुत अच्छा 👍",
      time: "14:02",
    },
    {
      name: "Sunita Devi",
      text: "Recording milegi kya later?",
      time: "14:05",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        name: "You",
        text: message,
        time: "Now",
      },
    ]);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Live Event
        </Text>
        <Text>🔗</Text>
      </View>

      {/* Video */}
      <View style={styles.video}>
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-sE38YZKkGnLB0ndUFqGdVzJaQV9PpQ7hdz0-dZeth4lsY9lAmo0n2sY75owSimLgXrEFNRCY1oaNcG8u6QSp42j_wTEAQJYq1jQYLylGCdNZH15anEfDS2ZVaKkge3kWbdOlu17y8xyJpfHX_K3x89W0aX1VNyvvv9nYM_CWG5E4DhbUf-87woKJBfpJQogz6awieP7s1xbpf45V39LgL9feU70j9iIcQZEwchoRr5wnOzKG0Dap9dUjd2DN3SLTRAA1d0EPuSIy",
          }}
          style={styles.videoImg}
        />

        <View style={styles.liveBadge}>
          <Text style={{ color: "#fff" }}>LIVE • 1.2k</Text>
        </View>

        <TouchableOpacity style={styles.playBtn}>
          <Text style={{ color: "#fff", fontSize: 20 }}>
            ▶
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat */}
      <ScrollView style={styles.chat}>
        {messages.map((msg, i) => (
          <View key={i} style={styles.msg}>
            <Text style={styles.name}>
              {msg.name}
            </Text>
            <Text>{msg.text}</Text>
            <Text style={styles.time}>
              {msg.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Type message..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}
        >
          <Text style={{ color: "#fff" }}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  video: {
    height: 200,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  videoImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  playBtn: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 50,
  },

  liveBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },

  chat: {
    flex: 1,
    padding: 10,
  },

  msg: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  name: {
    fontWeight: "bold",
    color: "#f2780d",
  },

  time: {
    fontSize: 10,
    color: "#999",
  },

  inputBox: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 10,
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#f2780d",
    padding: 10,
    borderRadius: 20,
  },
});