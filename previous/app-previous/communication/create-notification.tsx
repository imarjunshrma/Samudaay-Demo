// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [recipient, setRecipient] = useState("all");

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Create Notification</Text>
        <Text>⋮</Text>
      </View>

      <ScrollView>

        {/* TITLE */}
        <Input label="Notification Title" placeholder="Enter title..." />

        {/* MESSAGE */}
        <View style={styles.section}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            multiline
            placeholder="Write announcement..."
            style={[styles.input, { height: 120 }]}
          />
        </View>

        {/* UPLOAD */}
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>

        {/* RECIPIENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send To</Text>

          {[
            { key: "all", label: "All Users" },
            { key: "trustees", label: "Trustees" },
            { key: "members", label: "Members" },
            { key: "group", label: "Specific Group" },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setRecipient(item.key)}
              style={[
                styles.radioCard,
                recipient === item.key && styles.activeCard,
              ]}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* GROUP SEARCH */}
          {recipient === "group" && (
            <TextInput
              placeholder="Search group..."
              style={styles.input}
            />
          )}
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.send}>
          <Text style={{ color: "#fff" }}>
            Send Notification
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Sent instantly to selected users
        </Text>
      </View>
    </View>
  );
}

/* 🔹 Input */
function Input({ label, ...props }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={styles.input} />
    </View>
  );
}

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  title: { fontWeight: "bold" },

  section: { padding: 16 },

  label: {
    fontSize: 12,
    color: "#777",
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    marginTop: 6,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  uploadBtn: {
    marginHorizontal: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 10,
    alignItems: "center",
  },

  uploadText: {
    color: PRIMARY,
    fontWeight: "bold",
  },

  radioCard: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },

  activeCard: {
    borderWidth: 1,
    borderColor: PRIMARY,
    backgroundColor: "#fff3e6",
  },

  footer: {
    padding: 16,
  },

  send: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  note: {
    textAlign: "center",
    fontSize: 11,
    color: "#777",
    marginTop: 8,
  },
});