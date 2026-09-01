// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [activeTab, setActiveTab] = useState("all");

  const chats = [
    {
      name: "National Meetup Delhi",
      message: "Rajesh: Looking forward to seeing everyone!",
      time: "10:30 AM",
      members: "24 members active",
      unread: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA8vXVmTp_vlxEpUzmjHz63u3uLjhxULwa2_MfszM2v-OrZIqg7gJmW9MmBH4n7tNusHYIdaT-2v3Y9E3csIFFBqBVksta_1yvFnO-YkeRIN7kEEztrflFyYaB1K1gmMGI2OfCd0jMwFqQJM6TFZuC5oIYMsUs1rZyohgsvQd6o9UEDCziVnzEBR6tKgi2EDMh3MRxQccKZIH-HUdgkw78wwngkCnRaogMctXacnLs95BNHm1Jf1VM4qnhu1KAcvnJYwl40oWZ1BtEV",
    },
    {
      name: "Mumbai Local Group",
      message: "Amit: Does anyone know a good tanner?",
      time: "Yesterday",
      members: "112 members",
      unread: 0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC5zDIFn2xmZuMbv5c_fKrrPYpBW7p0se0SIj3XeZ7EwQpeSHlvAJrctft7Pt7crxtWKN8E4PQ3mK8r87t1LN9EQPe_1bb_fmPk4I092EpQTC5Ow0qAPSjByCl0OdA7Jj9Z5BbDwEd1jtrGouCYqqAwJt5d4Irzu3CLh6F_Ibc7XKF1ly4wicRB2Imn4m7YyzXO0EJTq-TWtXS06FWs2n_LdsHf2HZGfgtaVr7VgqqFUdS5CKw4uvF4iLM-yxu554_vZe_lt947kIMl",
    },
    {
      name: "Leather Crafts Workshop",
      message: "Suresh: Shared a video",
      time: "Monday",
      members: "85 members",
      unread: 0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDsfz1a_s13ad2uVDtv5slAUwFTqLLQ1bXPx5hRLU9otz1T7LtQFcCi0G65UkWncrNrgMshGB0ySRl9vILHTRZ1CeCIfOR6UlR6179K3rwN95B8uaPccKre3d4lzBfuZTOSHcdjOY1eaddOSNHwH7iO-4q7pkm5qYY_PgrlsncgbSeK9K6Ofw9_vKJTf5HS0t5XfGeVMlcO3Kfwf1vcI_55HtvydRFNz3fulun2q-ZccPD6H5HRACOMwyYtCZTF0csUDg4FSK2JaxO8",
    },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.menu}>☰</Text>
        <Text style={styles.title}>Community Chats</Text>
        <Text style={styles.icon}>👥</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search groups..."
          style={styles.searchInput}
        />
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {["all", "unread", "archived"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CHAT LIST */}
      <ScrollView>
        {chats.map((chat, i) => (
          <TouchableOpacity key={i} style={styles.chatItem}>
            
            <Image source={{ uri: chat.image }} style={styles.avatar} />

            <View style={styles.chatContent}>
              
              <View style={styles.row}>
                <Text style={styles.name}>{chat.name}</Text>
                <Text style={styles.time}>{chat.time}</Text>
              </View>

              <Text style={styles.message}>{chat.message}</Text>
              <Text style={styles.members}>{chat.members}</Text>
            </View>

            {chat.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {chat.unread}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>💬</Text>
      </TouchableOpacity>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Home", "Chats", "Market", "Profile"].map((item) => (
          <Text
            key={item}
            style={[
              styles.navItem,
              item === "Chats" && styles.activeNav,
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

  menu: { fontSize: 20 },

  title: { fontWeight: "bold" },

  icon: { fontSize: 18 },

  searchBox: {
    paddingHorizontal: 16,
  },

  searchInput: {
    backgroundColor: "#fff3e6",
    padding: 10,
    borderRadius: 10,
  },

  tabs: {
    flexDirection: "row",
    padding: 10,
  },

  tab: {
    marginRight: 10,
    paddingBottom: 6,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderColor: PRIMARY,
  },

  tabText: {
    color: "#777",
    fontSize: 12,
  },

  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },

  chatItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    marginRight: 10,
  },

  chatContent: { flex: 1 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: { fontWeight: "bold" },

  time: { fontSize: 10, color: PRIMARY },

  message: {
    fontSize: 13,
    marginTop: 2,
  },

  members: {
    fontSize: 10,
    color: "#777",
  },

  badge: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
  },

  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  fabText: {
    fontSize: 20,
    color: "#fff",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { fontSize: 12, color: "#777" },

  activeNav: {
    color: PRIMARY,
    fontWeight: "bold",
  },
});