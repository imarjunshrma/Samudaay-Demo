// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [selectedRole, setSelectedRole] = useState("member");

  const roles = [
    {
      key: "trustee",
      title: "Trustee",
      desc: "Full admin access, manage funds, approve members.",
    },
    {
      key: "member",
      title: "Member",
      desc: "Basic access, training resources, job listings.",
    },
    {
      key: "support",
      title: "Community Support",
      desc: "Assist users and moderate discussions.",
    },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>←</Text>
        <Text style={styles.title}>Assign Role</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView>

        {/* PROFILE */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3bvnvBCxMXGYEiv9uuhhTXTqP2nf3lLeubnVbySoS3JfKFh44aR8nHlNqJQTXvblEriat36XLnJDz13ItzhXw_AX9uogTIUDa6TeOum3J6keaRrrwKyfj1PozvlTWMtue7PXVTsz7U5pflNyx9s1LcWWSXzUojLM2bKV_dN5DtIY6xj9BXFPuOlFQX4EJMzZorpSmlzefRhWZvLcocodY_XAPZSm2U8xajiNKfUOZu68m7wOfWf3QMsI1sVYOoV42fx4-lH1itMZE",
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>Rajesh Kumar</Text>
          <Text style={styles.id}>ID: IC-2024-0891</Text>

          <View style={styles.currentRole}>
            <Text style={styles.currentRoleText}>
              Current Role: Member
            </Text>
          </View>
        </View>

        {/* ROLE SELECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Role</Text>

          {roles.map((role, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.roleCard,
                selectedRole === role.key && styles.roleActive,
              ]}
              onPress={() => setSelectedRole(role.key)}
            >
              <View style={styles.radio}>
                {selectedRole === role.key && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDesc}>{role.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          User will be notified via SMS & App notification
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  back: { fontSize: 20 },

  title: { fontWeight: "bold", fontSize: 16 },

  profileCard: {
    margin: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  id: {
    color: PRIMARY,
    marginTop: 4,
  },

  currentRole: {
    marginTop: 10,
    backgroundColor: "#fff3e6",
    padding: 6,
    borderRadius: 20,
  },

  currentRoleText: {
    color: PRIMARY,
    fontSize: 12,
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  roleCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  roleActive: {
    borderColor: PRIMARY,
    backgroundColor: "#fff3e6",
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: PRIMARY,
    borderRadius: 5,
  },

  roleTitle: {
    fontWeight: "bold",
  },

  roleDesc: {
    fontSize: 12,
    color: "#666",
  },

  footer: {
    padding: 16,
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  note: {
    textAlign: "center",
    fontSize: 11,
    color: "#777",
    marginTop: 10,
  },
});