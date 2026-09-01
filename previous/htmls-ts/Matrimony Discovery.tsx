import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";

export default function DiscoverScreen() {
  const [search, setSearch] = useState("");

  const profiles = [
    {
      name: "Ananya Verma",
      age: 24,
      id: "CM-88291",
      verified: true,
      online: true,
      profession: "Software Engineer",
      education: "M.Sc IT",
      location: "Pune",
    },
    {
      name: "Rahul Jadhav",
      age: 28,
      id: "CM-77102",
      profession: "Bank Manager",
      education: "MBA",
      location: "Mumbai",
    },
    {
      name: "Priya K.",
      age: 26,
      id: "CM-90211",
      premium: true,
    },
  ];

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Matrimony</Text>
        <Text>🔔</Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search profiles..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* Filters */}
      <ScrollView horizontal style={styles.filters}>
        {["Age", "Education", "Profession", "City"].map(
          (f, i) => (
            <View key={i} style={styles.filter}>
              <Text>{f}</Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Premium Banner */}
      <View style={styles.banner}>
        <Text style={styles.bold}>
          Direct Family Connect
        </Text>
        <Text style={styles.desc}>
          Upgrade to view contact details
        </Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: "#fff" }}>
            Upgrade
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profiles */}
      <ScrollView>
        {filtered.map((p, i) => (
          <ProfileCard key={i} {...p} />
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Discover", "Matches", "Messages", "Profile"].map(
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

/* 🔹 Profile Card */

function ProfileCard({
  name,
  age,
  id,
  verified,
  online,
  profession,
  education,
  location,
  premium,
}) {
  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imgWrap}>
        <Image
          source={{ uri: "https://via.placeholder.com/300" }}
          style={styles.img}
        />

        {verified && (
          <Text style={styles.verified}>
            ✔ Verified
          </Text>
        )}

        {premium && (
          <View style={styles.overlay}>
            <Text style={styles.lock}>
              Premium Only
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.content}>
        <Text style={styles.name}>
          {name}, {age}
        </Text>
        <Text style={styles.id}>{id}</Text>

        {!premium && (
          <>
            <Text style={styles.meta}>
              🎓 {education}
            </Text>
            <Text style={styles.meta}>
              💼 {profession}
            </Text>
            <Text style={styles.meta}>
              📍 {location}
            </Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.connect}>
                <Text style={{ color: "#fff" }}>
                  Connect
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.chat}>
                <Text>💬</Text>
              </TouchableOpacity>
            </View>
          </>
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
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  search: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 12,
    borderRadius: 10,
  },

  filters: {
    paddingHorizontal: 10,
  },

  filter: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  banner: {
    backgroundColor: "#fff3e6",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },

  btn: {
    marginTop: 10,
    backgroundColor: "#f2780d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  imgWrap: {
    position: "relative",
    height: 200,
  },

  img: {
    width: "100%",
    height: "100%",
  },

  verified: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "green",
    color: "#fff",
    padding: 5,
    fontSize: 10,
  },

  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  lock: {
    color: "#fff",
    fontWeight: "bold",
  },

  content: {
    padding: 15,
  },

  name: { fontWeight: "bold" },

  id: {
    color: "#f2780d",
    fontSize: 12,
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  connect: {
    flex: 1,
    backgroundColor: "#f2780d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  chat: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
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

  bold: { fontWeight: "bold" },

  desc: { fontSize: 12, color: "#666" },
});