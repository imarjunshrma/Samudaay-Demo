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

export default function KycScreen() {
  const [reason, setReason] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>☰</Text>
        <Text style={styles.title}>KYC Approval</Text>
        <Text>👤</Text>
      </View>

      <ScrollView>
        {/* Profile */}
        <View style={styles.section}>
          <Text style={styles.id}>Application #88421</Text>

          <Text style={styles.name}>
            Arjun Varma
          </Text>

          <Text style={styles.subtitle}>
            Third Generation Cordwainer
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Info label="Full Name" value="Arjun Kumar Varma" />
          <Info label="Father's Name" value="Rajesh Varma" />
          <Info label="Gender" value="Male" />
          <Info label="DOB" value="12 Aug 1988" />
          <Info
            label="Address"
            value="Kanpur, Uttar Pradesh"
          />
        </View>

        {/* Status */}
        <View style={styles.card}>
          <Text style={styles.bold}>Status</Text>
          <Text style={styles.pending}>
            Pending Audit
          </Text>
          <Text style={styles.desc}>
            Submitted 48 hours ago
          </Text>

          <Text style={styles.success}>
            ✔ Aadhaar Verified
          </Text>
          <Text style={styles.success}>
            ✔ Locality Confirmed
          </Text>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Documents
          </Text>

          <DocCard title="Aadhaar Card" />
          <DocCard title="Caste Certificate" />
        </View>

        {/* Decision */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Review Action
          </Text>

          <TextInput
            placeholder="Reason for rejection..."
            value={reason}
            onChangeText={setReason}
            style={styles.input}
            multiline
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.reject}>
              <Text style={styles.rejectText}>
                Reject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.approve}>
              <Text style={styles.approveText}>
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Applications", "Messages", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                i === 0 && { color: "#f2780d" },
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

/* 🔹 Components */

function Info({ label, value }) {
  return (
    <View style={styles.info}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function DocCard({ title }) {
  return (
    <View style={styles.doc}>
      <Text style={styles.bold}>{title}</Text>
      <Image
        source={{
          uri: "https://via.placeholder.com/300x150",
        }}
        style={styles.docImg}
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

  id: {
    fontSize: 12,
    color: "#f2780d",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    margin: 15,
  },

  info: {
    marginBottom: 10,
  },

  label: {
    fontSize: 10,
    color: "#999",
  },

  value: {
    fontWeight: "bold",
  },

  pending: {
    color: "orange",
    fontWeight: "bold",
  },

  success: {
    color: "green",
    marginTop: 5,
  },

  desc: {
    fontSize: 12,
    color: "#666",
  },

  doc: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  docImg: {
    width: "100%",
    height: 120,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 80,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  reject: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f2780d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  approve: {
    flex: 1,
    backgroundColor: "#f2780d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  rejectText: { color: "#f2780d" },
  approveText: { color: "#fff" },

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