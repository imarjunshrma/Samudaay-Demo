// 🧩 1. Registration (Mobile + OTP)

import React from "react";
import {
// 🧩 2. Profile Details
import React from "react";  View,

  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const PRIMARY = "#f2780d";

export default function Step1() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.back}>←</Text>
        <Text style={styles.title}>Registration</Text>
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        <View style={styles.activeBar} />
        <View style={styles.inactiveBar} />
        <View style={styles.inactiveBar} />
      </View>

      {/* Content */}
      <Text style={styles.heading}>Welcome</Text>
      <Text style={styles.subText}>
        Join the Cobbler Community. Enter your mobile number.
      </Text>

      {/* Mobile Input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.phoneRow}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            placeholder="00000 00000"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>
      </View>

      {/* OTP */}
      <View style={styles.otpRow}>
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <TextInput key={i} style={styles.otpBox} maxLength={1} />
        ))}
      </View>


  );
}
// 🧩 2. Profile Details
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export function Step2() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Details</Text>

      <TextInput placeholder="Full Name" style={styles.inputFull} />
      <TextInput placeholder="Father Name" style={styles.inputFull} />

      <View style={styles.row}>
        <TextInput placeholder="Gender" style={styles.inputHalf} />
        <TextInput placeholder="DOB" style={styles.inputHalf} />
      </View>

      <TextInput
        placeholder="Full Address"
        style={[styles.inputFull, { height: 80 }]}
      />

      <View style={styles.row}>
        <TextInput placeholder="City" style={styles.inputHalf} />
        <TextInput placeholder="Pincode" style={styles.inputHalf} />
      </View>

      <TextInput placeholder="Occupation" style={styles.inputFull} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🧩 3. KYC Upload
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f7f5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  back: {
    fontSize: 20,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  subText: {
    color: "#666",
    marginBottom: 20,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
  },

  inputWrapper: {
    marginBottom: 20,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },

  prefix: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    padding: 10,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  otpBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 8,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },

  activeBar: {
    width: 40,
    height: 6,
    backgroundColor: "#f2780d",
    borderRadius: 10,
  },

  inactiveBar: {
    width: 40,
    height: 6,
    backgroundColor: "#f2780d33",
    borderRadius: 10,
  },

  inputFull: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#f2780d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#f2780d55",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  uploadTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  uploadBtn: {
    borderWidth: 1,
    borderColor: "#f2780d",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  uploadText: {
    color: "#f2780d",
  },
});

// 🎨 Shared Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f7f5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  back: {
    fontSize: 20,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  subText: {
    color: "#666",
    marginBottom: 20,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
  },

  inputWrapper: {
    marginBottom: 20,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },

  prefix: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    padding: 10,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  otpBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 8,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },

  activeBar: {
    width: 40,
    height: 6,
    backgroundColor: "#f2780d",
    borderRadius: 10,
  },

  inactiveBar: {
    width: 40,
    height: 6,
    backgroundColor: "#f2780d33",
    borderRadius: 10,
  },

  inputFull: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#f2780d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#f2780d55",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  uploadTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  uploadBtn: {
    borderWidth: 1,
    borderColor: "#f2780d",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  uploadText: {
    color: "#f2780d",
  },
});
