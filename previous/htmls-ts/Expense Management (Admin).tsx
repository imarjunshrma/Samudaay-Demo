import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

export default function ExpenseScreen() {
  const [showModal, setShowModal] = useState(false);

  const expenses = [
    {
      title: "Social Media Ads",
      amount: "₹2,450",
      status: "Paid",
    },
    {
      title: "Catering Services",
      amount: "₹15,000",
      status: "Pending",
    },
    {
      title: "Hall Rental",
      amount: "₹8,000",
      status: "Paid",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Expense Management
        </Text>
        <Text>🔔</Text>
      </View>

      <ScrollView>
        {/* Summary */}
        <View style={styles.grid}>
          <Card title="Total Expenses" value="₹45,800" />
          <Card title="Pending" value="12" />
        </View>

        {/* Filters */}
        <View style={styles.section}>
          <Text style={styles.bold}>Filters</Text>

          <View style={styles.row}>
            <Filter label="Oct 2023" />
            <Filter label="Category" />
            <Filter label="Event" />
          </View>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Recent Expenses
          </Text>

          {expenses.map((item, i) => (
            <Item key={i} {...item} />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={showModal} transparent>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.bold}>
              Add Expense
            </Text>

            <TextInput
              placeholder="Category"
              style={styles.input}
            />
            <TextInput
              placeholder="Amount"
              style={styles.input}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: "#fff" }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Dashboard", "Expenses", "Events", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Expenses" && {
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

/* 🔹 Components */

function Card({ title, value }) {
  return (
    <View style={styles.card}>
      <Text>{title}</Text>
      <Text style={styles.big}>{value}</Text>
    </View>
  );
}

function Filter({ label }) {
  return (
    <View style={styles.filter}>
      <Text>{label}</Text>
    </View>
  );
}

function Item({ title, amount, status }) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.bold}>{title}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.bold}>{amount}</Text>
        <Text
          style={{
            fontSize: 10,
            color:
              status === "Paid" ? "green" : "orange",
          }}
        >
          {status}
        </Text>
      </View>
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

  grid: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  big: {
    fontSize: 20,
    fontWeight: "bold",
  },

  section: { padding: 15 },

  bold: { fontWeight: "bold" },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  filter: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },

  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 50,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  saveBtn: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
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