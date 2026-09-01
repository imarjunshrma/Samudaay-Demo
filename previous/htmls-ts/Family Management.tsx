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

export default function FamilyScreen() {
  const [members, setMembers] = useState([
    {
      name: "Rajesh Kumar",
      relation: "Self",
      info: "Master Cobbler",
      primary: true,
    },
    {
      name: "Sunita Devi",
      relation: "Spouse",
      info: "10th Pass",
    },
    {
      name: "Anjali Kumar",
      relation: "Daughter",
      info: "Class 9",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  const addMember = () => {
    if (!name) return;
    setMembers([...members, { name, relation: "Other" }]);
    setName("");
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Family Management
        </Text>
        <Text>👥</Text>
      </View>

      <ScrollView>
        {/* Summary */}
        <View style={styles.summary}>
          <View>
            <Text style={styles.primary}>
              Total Members
            </Text>
            <Text style={styles.big}>
              {members.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowModal(true)}
          >
            <Text style={{ color: "#fff" }}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your Family
          </Text>

          {members.map((m, i) => (
            <MemberCard key={i} {...m} />
          ))}
        </View>
      </ScrollView>

      {/* Modal Form */}
      <Modal visible={showModal} transparent>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.bold}>
              Add Member
            </Text>

            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={addMember}
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
        {["Home", "Family", "Jobs", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Family" && {
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

/* 🔹 Member Card */
function MemberCard({ name, relation, info, primary }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.bold}>{name}</Text>
        <Text style={styles.desc}>
          {relation}
        </Text>
        {info && (
          <Text style={styles.primary}>
            {info}
          </Text>
        )}
      </View>

      {primary && (
        <Text style={styles.badge}>
          Primary
        </Text>
      )}
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

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff3e6",
    margin: 10,
    borderRadius: 10,
  },

  primary: { color: "#f2780d" },

  big: {
    fontSize: 22,
    fontWeight: "bold",
  },

  addBtn: {
    backgroundColor: "#f2780d",
    padding: 10,
    borderRadius: 10,
  },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

  desc: { fontSize: 12, color: "#666" },

  badge: {
    fontSize: 10,
    color: "#f2780d",
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