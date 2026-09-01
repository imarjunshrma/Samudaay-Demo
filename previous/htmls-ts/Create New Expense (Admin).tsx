import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [paymentMode, setPaymentMode] = useState("cash");

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Create Expense</Text>
        <Text>💸</Text>
      </View>

      <ScrollView>
        {/* AMOUNT */}
        <View style={styles.section}>
          <Text style={styles.label}>Expense Amount</Text>

          <View style={styles.amountRow}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.amountInput}
            />
          </View>
        </View>

        {/* VENDOR */}
        <Input label="Vendor / Payee Name" />

        {/* DATE */}
        <Input label="Date of Expense" />

        {/* CATEGORY */}
        <Input label="Expense Category" />

        {/* EVENT LINK */}
        <Input label="Link to Event" />

        {/* PAYMENT MODE */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Mode</Text>

          <View style={styles.row}>
            {["cash", "bank", "cheque"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setPaymentMode(mode)}
                style={[
                  styles.paymentCard,
                  paymentMode === mode && styles.activePayment,
                ]}
              >
                <Text>{mode.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NOTES */}
        <Input label="Description / Notes" multiline />

        {/* UPLOAD */}
        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>Upload Receipt (Image/PDF)</Text>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit}>
          <Text style={{ color: "#fff" }}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Input Component */
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

  section: { paddingHorizontal: 16, marginBottom: 12 },

  label: {
    fontSize: 12,
    color: "#777",
  },

  input: {
    marginTop: 6,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  currency: {
    padding: 12,
    backgroundColor: "#ffe8d6",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  amountInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  paymentCard: {
    flex: 1,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },

  activePayment: {
    backgroundColor: PRIMARY,
  },

  uploadBox: {
    margin: 16,
    padding: 30,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
  },

  uploadText: {
    color: PRIMARY,
  },

  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },

  cancel: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  submit: {
    flex: 2,
    backgroundColor: PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
