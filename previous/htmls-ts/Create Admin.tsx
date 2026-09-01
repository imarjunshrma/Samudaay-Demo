import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [selectedRole, setSelectedRole] = useState("super");
  const [permissions, setPermissions] = useState({
    member: true,
    moderation: true,
    finance: false,
  });

  const togglePermission = (key) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const roles = [
    {
      key: "super",
      title: "Super Admin",
      desc: "Full access to all modules",
    },
    {
      key: "event",
      title: "Event Admin",
      desc: "Manage events and workshops",
    },
    {
      key: "donation",
      title: "Donation Admin",
      desc: "Manage donations",
    },
    {
      key: "matrimony",
      title: "Matrimony Admin",
      desc: "Manage profiles",
    },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.icon}>←</Text>
        <Text style={styles.title}>Add New Admin</Text>
        <Text style={styles.icon}>ℹ️</Text>
      </View>

      <ScrollView>

        {/* STEP 1 */}
        <Text style={styles.stepTitle}>Step 1: Select Member</Text>

        <TextInput
          placeholder="Search member..."
          style={styles.search}
        />

        <View style={styles.memberCard}>
          <Image
            source={{ uri: "https://picsum.photos/100" }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.name}>Rajesh Kumar</Text>
            <Text style={styles.id}>ID: ICC-54321</Text>
          </View>
        </View>

        {/* STEP 2 */}
        <Text style={styles.stepTitle}>Step 2: Assign Role</Text>

        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.roleCard,
              selectedRole === role.key && styles.roleActive,
            ]}
            onPress={() => setSelectedRole(role.key)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDesc}>{role.desc}</Text>
            </View>

            <Text>
              {selectedRole === role.key ? "🔘" : "⚪"}
            </Text>
          </TouchableOpacity>
        ))}

        {/* STEP 3 */}
        <Text style={styles.stepTitle}>Step 3: Permissions</Text>

        <PermissionItem
          title="Member Management"
          desc="Approve or ban users"
          value={permissions.member}
          onChange={() => togglePermission("member")}
        />

        <PermissionItem
          title="Content Moderation"
          desc="Delete posts/comments"
          value={permissions.moderation}
          onChange={() => togglePermission("moderation")}
        />

        <PermissionItem
          title="Financial Reporting"
          desc="View donation reports"
          value={permissions.finance}
          onChange={() => togglePermission("finance")}
        />

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit}>
          <Text style={{ color: "#fff" }}>Create Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Permission Component inside same file */
function PermissionItem({ title, desc, value, onChange }) {
  return (
    <View style={styles.permission}>
      <View>
        <Text style={styles.permTitle}>{title}</Text>
        <Text style={styles.permDesc}>{desc}</Text>
      </View>

      <Switch value={value} onValueChange={onChange} />
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

  icon: { fontSize: 18 },

  title: { fontWeight: "bold" },

  stepTitle: {
    fontWeight: "bold",
    padding: 16,
  },

  search: {
    marginHorizontal: 16,
    backgroundColor: "#fff3e6",
    padding: 10,
    borderRadius: 10,
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    padding: 10,
    borderRadius: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  name: { fontWeight: "bold" },

  id: { color: PRIMARY, fontSize: 12 },

  roleCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },

  roleActive: {
    borderColor: PRIMARY,
    backgroundColor: "#fff3e6",
  },

  roleTitle: { fontWeight: "bold" },

  roleDesc: { fontSize: 12, color: "#666" },

  permission: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  permTitle: { fontWeight: "bold" },

  permDesc: { fontSize: 11, color: "#777" },

  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },

  cancel: {
    flex: 1,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },

  submit: {
    flex: 2,
    padding: 12,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    alignItems: "center",
  },
});