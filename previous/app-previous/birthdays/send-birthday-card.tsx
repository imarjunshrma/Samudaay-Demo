// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

export default function BirthdayCardScreen() {
  const [selected, setSelected] = useState(0);
  const [message, setMessage] = useState("");

  const templates = [
    {
      title: "Traditional Indian",
      img: "https://via.placeholder.com/300",
    },
    {
      title: "Leather Craft",
      img: "https://via.placeholder.com/300",
    },
    {
      title: "Floral",
      img: "https://via.placeholder.com/300",
    },
    {
      title: "Minimal",
      img: "https://via.placeholder.com/300",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Send Birthday Card
        </Text>
      </View>

      <ScrollView>
        {/* Templates */}
        <Text style={styles.section}>
          Select Template
        </Text>

        <View style={styles.grid}>
          {templates.map((t, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelected(i)}
              style={[
                styles.card,
                selected === i && styles.activeCard,
              ]}
            >
              <Image
                source={{ uri: t.img }}
                style={styles.img}
              />
              <Text style={styles.cardText}>
                {t.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Message */}
        <Text style={styles.section}>
          Your Message
        </Text>

        <View style={styles.inputWrap}>
          <TextInput
            multiline
            maxLength={250}
            value={message}
            onChangeText={setMessage}
            placeholder="Write message..."
            style={styles.input}
          />

          <Text style={styles.counter}>
            {message.length}/250
          </Text>
        </View>

        {/* Recipient */}
        <View style={styles.recipient}>
          <View style={styles.avatar}>
            <Text>👤</Text>
          </View>

          <View>
            <Text style={styles.meta}>
              Sending to
            </Text>
            <Text style={styles.name}>
              Arjun Sharma
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Send */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: "#fff" }}>
            Send Birthday Card
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Community", "Cards", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Cards" && {
                  color: "#f2780d",
                },
              ]}
            >
              {item}
            </Text>
          )
        )}
      </View>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    marginLeft: 10,
    fontWeight: "bold",
  },

  section: {
    padding: 15,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#f2780d",
  },

  img: {
    width: "100%",
    height: 120,
  },

  cardText: {
    padding: 10,
    fontSize: 12,
    fontWeight: "bold",
  },

  inputWrap: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },

  input: {
    height: 100,
    textAlignVertical: "top",
  },

  counter: {
    textAlign: "right",
    fontSize: 10,
    color: "#999",
  },

  recipient: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    padding: 15,
    backgroundColor: "#fff3e6",
    borderRadius: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  name: { fontWeight: "bold" },

  meta: {
    fontSize: 10,
    color: "#666",
  },

  footer: {
    padding: 15,
    backgroundColor: "#fff",
  },

  btn: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },

  navItem: {
    fontSize: 12,
    color: "#888",
  },
});