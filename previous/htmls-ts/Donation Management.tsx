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

export default function DonationsScreen() {
  const [selectedAmount, setSelectedAmount] = useState(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>←</Text>
        <Text style={styles.title}>Donations</Text>
      </View>

      <ScrollView>
        {/* Impact Card */}
        <View style={styles.section}>
          <View style={styles.impactCard}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5lbvs7EK9L2PG_TNfMXqCJT9toXn0_h42qmXwtIhYkpyaYFgpkaVAHPNwNJ8lejIjsgLeK2YE74e6uLkywNnEy05qHOP6dEtg6ZcGWX1ApnEb2IlN0cof9y3ouJmtdCuinWUBEsuUjU8_Bcy9lfDhrXhhPMCUY_4WUPueGxVkrPkdjgQr_Wp1MQX2kkzL6761d8rjVl70lrvytLo9cLmcm5mp5JVAQGVC_W6okrofWD6QqRBW6EAF_HNrH4RIRtB3CoXlbwMxs0FL",
              }}
              style={styles.banner}
            />
            <View style={{ padding: 15 }}>
              <Text style={styles.primaryText}>Your Impact</Text>
              <Text style={styles.amount}>₹45,000</Text>
              <Text style={styles.desc}>
                Total Community Contributions
              </Text>
            </View>
          </View>
        </View>

        {/* Admin Action */}
        <View style={styles.section}>
          <View style={styles.adminCard}>
            <View>
              <Text style={styles.bold}>
                Record Offline Donation
              </Text>
              <Text style={styles.desc}>
                Log manual cash/check
              </Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donation Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Make a Donation
          </Text>

          {/* Inputs */}
          <TextInput
            placeholder="Donor Name"
            style={styles.input}
          />
          <TextInput
            placeholder="Relation"
            style={styles.input}
          />

          {/* Amount */}
          <Text style={styles.label}>Select Amount</Text>

          <View style={styles.amountRow}>
            {[500, 1000, 2000].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.amountBtn,
                  selectedAmount === amt && styles.activeAmount,
                ]}
                onPress={() => setSelectedAmount(amt)}
              >
                <Text>₹{amt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Custom Amount"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Message"
            multiline
            style={[styles.input, { height: 80 }]}
          />

          <TouchableOpacity style={styles.donateBtn}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Donate Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Donations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Donations
          </Text>

          {[
            "₹5,000",
            "₹10,000",
            "₹2,500",
          ].map((amt, i) => (
            <View key={i} style={styles.listItem}>
              <View>
                <Text style={styles.bold}>{amt}</Text>
                <Text style={styles.desc}>
                  Sample Date • Self
                </Text>
              </View>
              <Text>📄</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Family", "Donations", "Jobs", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Donations" && { color: "#f2780d" },
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  icon: { fontSize: 18 },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  impactCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },

  banner: { width: "100%", height: 120 },

  primaryText: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  amount: {
    fontSize: 28,
    fontWeight: "bold",
  },

  desc: { fontSize: 12, color: "#666" },

  adminCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
  },

  smallBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  label: {
    marginTop: 15,
    fontWeight: "bold",
  },

  amountRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  amountBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#f2780d",
    borderRadius: 8,
    alignItems: "center",
  },

  activeAmount: {
    backgroundColor: "#f2780d",
  },

  donateBtn: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

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