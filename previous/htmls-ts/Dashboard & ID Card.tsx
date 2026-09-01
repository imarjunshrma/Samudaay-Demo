import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="shield" size={26} color="#f2780d" />
          <Text style={styles.headerTitle}>ICC Digital ID</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="notifications" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="menu" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Membership Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Membership Card</Text>

          <LinearGradient colors={["#f2780d", "#d6660a"]} style={styles.card}>
            {/* Top */}
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardSmall}>Indian Cobbler Community</Text>
                <Text style={styles.cardSub}>Official Member</Text>
              </View>
              <MaterialIcons
                name="contactless"
                size={34}
                color="rgba(255,255,255,0.5)"
              />
            </View>

            {/* Middle */}
            <View style={styles.cardMiddle}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcTdiOPDFjB0DIG6ekJmydxKptp_AKtUY16EjP9JCuLZYwa-fdfH48OI1asmtP4RTU3E45Muq36kU4TuPc1ppDyympPbZY5FhgXEqmPhKsIC_ZdY21lYRrRK06RsbgH1MBaXXXP5tXi0uU2U2n_90x-G_mqpzQ5VxeXLxWlkRDrz-4C6mFxPatuU1QBa-FsEv9PlFfeZcjweOkW6Rhgadcs6krvBlRwAKU-ZN_cShw6PwgAW5oE4kEZYvAklE75L9J3aPyI_OR9inX",
                }}
                style={styles.profile}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Rajesh Kumar</Text>
                <Text style={styles.id}>ID: IC-2024-8839</Text>

                <View style={styles.metaRow}>
                  <MaterialIcons name="location-on" size={14} color="#fff" />
                  <Text style={styles.metaText}>Mumbai, Maharashtra</Text>
                </View>

                <View style={styles.metaRow}>
                  <MaterialIcons name="event" size={14} color="#fff" />
                  <Text style={styles.metaText}>Valid thru: Dec 2030</Text>
                </View>
              </View>
            </View>

            {/* Bottom */}
            <View style={styles.cardBottom}>
              <View style={styles.qrBox}>
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_NQ8t26AbRvCgZ3RZC1OfRIuu86GwJnKa5qlryBtDBAeI52PY0ugDkPAVgekUW2Pgv3mk42jBL1S7VrWt9ZLGVLfas1hOk1JW1NwKUMl9gzz_Y9xoPNrGg6moTcX1UVMjkaI6dqozojsU7YYzCqIocqkeB7yCQZXm0QeLE3X0og5kbGivGmR8lCtVKmhg3y1WqAyPj4wcCdv7E7rtEvbbuk4eKncK4bmwhD8ST1ewFAV1NsZXsM9mC8jAgqZ4h9c_n0Hi6ss-qd2V",
                  }}
                  style={styles.qr}
                />
              </View>

              <TouchableOpacity style={styles.verifyBtn}>
                <MaterialIcons name="qr-code-scanner" size={16} color="#fff" />
                <Text style={styles.verifyText}> Verify Card</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Dashboard</Text>

          <View style={styles.grid}>
            {[
              { title: "My Profile", icon: "person" },
              { title: "Family", icon: "groups" },
              { title: "Events", icon: "calendar-month" },
              { title: "Donations", icon: "volunteer-activism" },
              { title: "News", icon: "article" },
              { title: "Matrimony", icon: "favorite" },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.gridItem}>
                <View style={styles.gridIcon}>
                  <MaterialIcons name={item.icon} size={20} color="#f2780d" />
                </View>
                <Text style={styles.gridTitle}>{item.title}</Text>
                <Text style={styles.gridSub}>Details</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>

          <View style={styles.updateCard}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB",
              }}
              style={styles.updateImg}
            />
            <View>
              <Text style={styles.updateTitle}>Skill Workshop in Mumbai</Text>
              <Text style={styles.updateSub}>
                2 days ago • Community Center
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["home", "groups", "build", "account-circle"].map((icon, i) => (
          <View key={i} style={styles.navItem}>
            <MaterialIcons
              name={icon}
              size={22}
              color={i === 0 ? "#f2780d" : "#888"}
            />
            <Text style={styles.navText}>
              {["Home", "Directory", "Services", "Account"][i]}
            </Text>
          </View>
        ))}
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
    backgroundColor: "#f8f7f5",
  },

  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerRight: { flexDirection: "row", gap: 10 },

  headerTitle: { fontSize: 16, fontWeight: "700" },

  iconBtn: { padding: 6, borderRadius: 20 },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  card: { borderRadius: 12, padding: 16 },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardSmall: { color: "#fff", fontSize: 11, letterSpacing: 1 },
  cardSub: { color: "#fff", fontSize: 13, fontWeight: "600" },

  cardMiddle: { flexDirection: "row", gap: 12 },

  profile: { width: 80, height: 80, borderRadius: 8 },

  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  id: { color: "#fff", fontSize: 12, marginTop: 2 },

  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { color: "#fff", fontSize: 11, marginLeft: 4 },

  cardBottom: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qrBox: { backgroundColor: "#fff", padding: 6, borderRadius: 6 },
  qr: { width: 50, height: 50 },

  verifyBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  verifyText: { color: "#fff", fontWeight: "600" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  gridIcon: {
    backgroundColor: "#f2780d20",
    padding: 10,
    borderRadius: 10,
    width: 40,
    alignItems: "center",
    marginBottom: 8,
  },

  gridTitle: { fontWeight: "700" },
  gridSub: { fontSize: 11, color: "#777" },

  updateCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  updateImg: { width: 50, height: 50, borderRadius: 8 },
  updateTitle: { fontWeight: "600" },
  updateSub: { fontSize: 11, color: "#777" },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f8f7f5",
  },

  navItem: { alignItems: "center" },
  navText: { fontSize: 10 },
});
