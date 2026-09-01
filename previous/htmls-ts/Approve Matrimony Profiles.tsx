import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [selectedReason, setSelectedReason] = useState(null);

  const profiles = [
    {
      name: "Rajesh Kumar",
      age: 28,
      role: "Leather Artisan",
      location: "Kanpur, UP",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAJrEnOvnXHiWthC_ybWGT86lgbRBg2fnynl9YBbvP31vSwkJV8BtLgel842eIJCfmWtS_DYoPJm90hnEXpxSzLHInSO1PVv0BNNygPzDiKhKfPJYCjJsXSqVDWfGJT4Z4zh3vBm6nMJ66cadryaYR0UGmQ80uJHB0Kaji4RcehAm9Bm_88X3UYiGtLYyoRW5TEOKhzX7Kh63hNoI93YJvZAfD9cMgltRUrjKiQQh6Y26X1SZ27lsBhBUKWWS9e_Ce7uQm1I5skj-Zw",
    },
    {
      name: "Priya Verma",
      age: 25,
      role: "Boutique Owner",
      location: "Mumbai",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC7pygBTXktsBzMlNCPzSch1lGp3GMlMZTedCBDBM4hq-7BhiDOLnlBSRqPjI0JPnXHJ15wvd_YIwMwmxuhw3yqU5RUpokWknn0_R4CCkKIJrHkIQPhjsKpANuZZKzQyaCp1FRj1xu1X0lgDBwcoys89XubtYIfJfA0EdJ9tgTWuEA7niRRtScfupfy1kRv1nl0i9RFXEt-g7qHKlbi4cI_r6mGIVDGEpu-IchLH8mFupdO3bd4ao51zGhOizuFjfhCDBUo0xl9M0mh",
    },
  ];

  const reasons = [
    "Inappropriate content",
    "Blurry photo",
    "Incomplete profile",
    "Duplicate profile",
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>←</Text>
        <Text style={styles.title}>Profile Moderation</Text>
        <Text>⚙️</Text>
      </View>

      <ScrollView>
        
        {/* FILTER */}
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>Pending Review (12)</Text>

          <View style={styles.filterBtns}>
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>Newest</Text>
            </View>
            <View style={styles.filter}>
              <Text style={styles.filterText}>Urgent</Text>
            </View>
          </View>
        </View>

        {/* PROFILE CARDS */}
        {profiles.map((item, i) => (
          <View key={i} style={styles.card}>
            
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.name}>
                {item.name}, {item.age}
              </Text>

              <Text style={styles.sub}>
                {item.role}
              </Text>

              <Text style={styles.sub}>{item.location}</Text>

              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewText}>View Full Details</Text>
              </TouchableOpacity>

              {/* ACTIONS */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.reject}>
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.approve}>
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* REJECT REASON BOX */}
        <View style={styles.rejectBox}>
          <Text style={styles.rejectTitle}>
            Select Reason for Rejection
          </Text>

          {reasons.map((r, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.reason,
                selectedReason === i && styles.reasonActive,
              ]}
              onPress={() => setSelectedReason(i)}
            >
              <Text>{r}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.confirmReject}>
            <Text style={styles.confirmText}>Confirm Rejection</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Dashboard", "Profiles", "Moderation", "Settings"].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.navItem,
              item === "Moderation" && styles.activeNav,
            ]}
          >
            {item}
          </Text>
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
  },

  back: { fontSize: 20 },

  title: { fontWeight: "bold", fontSize: 16 },

  filterRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  filterTitle: { fontSize: 12, color: "#777" },

  filterBtns: { flexDirection: "row", gap: 8 },

  activeFilter: {
    backgroundColor: PRIMARY,
    padding: 6,
    borderRadius: 20,
  },

  activeFilterText: { color: "#fff", fontSize: 12 },

  filter: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 20,
  },

  filterText: { fontSize: 12 },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 200,
  },

  cardContent: { padding: 12 },

  name: { fontWeight: "bold", fontSize: 16 },

  sub: { color: "#666", fontSize: 12 },

  viewBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: PRIMARY,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  viewText: { color: PRIMARY },

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  reject: {
    flex: 1,
    backgroundColor: "#ffe5e5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  rejectText: { color: "red" },

  approve: {
    flex: 1,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  approveText: { color: "#fff" },

  rejectBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  rejectTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  reason: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 6,
  },

  reasonActive: {
    borderColor: PRIMARY,
    backgroundColor: "#fff3e6",
  },

  confirmReject: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  confirmText: { color: "#fff" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { fontSize: 12, color: "#777" },

  activeNav: { color: PRIMARY, fontWeight: "bold" },
});