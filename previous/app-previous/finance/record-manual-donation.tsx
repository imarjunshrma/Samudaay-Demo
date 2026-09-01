import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function DonationEntryScreen() {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: "",
    mode: "cash",
    ref: "",
  });

  const setField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Manual Donation Entry
        </Text>
        <Text>?</Text>
      </View>

      <ScrollView>
        {/* Donor */}
        <Section title="Donor Information">
          <Input
            label="Search Member"
            placeholder="Name or ID"
          />

          <Text style={styles.or}>OR</Text>

          <Input
            label="Manual Name"
            placeholder="Enter full name"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />
        </Section>

        {/* Transaction */}
        <Section title="Transaction Details">
          <Input
            label="Amount (₹)"
            value={form.amount}
            onChange={(v) => setField("amount", v)}
          />

          <Input
            label="Date"
            value={form.date}
            onChange={(v) => setField("date", v)}
          />

          {/* Payment Mode */}
          <Text style={styles.label}>
            Payment Mode
          </Text>

          <View style={styles.row}>
            {["cash", "transfer", "cheque"].map(
              (m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.mode,
                    form.mode === m && styles.activeMode,
                  ]}
                  onPress={() => setField("mode", m)}
                >
                  <Text>{m}</Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <Input
            label="Reference No."
            value={form.ref}
            onChange={(v) => setField("ref", v)}
          />
        </Section>

        {/* Upload */}
        <Section title="Verification Proof">
          <TouchableOpacity style={styles.upload}>
            <Text>📷 Upload Screenshot</Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>

      {/* Save */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: "#fff" }}>
            Save Donation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Components */

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  section: { padding: 15 },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  label: {
    fontSize: 12,
    color: "#666",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  or: {
    textAlign: "center",
    marginVertical: 10,
    color: "#999",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  mode: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 10,
  },

  activeMode: {
    backgroundColor: "#f2780d",
  },

  upload: {
    marginTop: 10,
    padding: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    borderRadius: 10,
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
});