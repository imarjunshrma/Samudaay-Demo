// @ts-nocheck
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

cssInterop(MaterialIcons, {
  className: {
    target: 'style',
  },
});

export default function AdminDashboardAnalyticsScreen() {
  return (
    <View className="flex-1 bg-background text-on-background selection:bg-secondary/30">
    <View className="absolute top-0 w-full z-50 bg-[#f1edea]/80 flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
      <View className="flex items-center gap-4">
        <MaterialIcons className="text-[#46291e] p-2 rounded-lg" name={"menu" as MaterialIconName} />
        <Text className="text-2xl font-serif italic text-[#46291e]">
          {" The Digital Atelier "}
        </Text>
      </View>
      <View className="flex items-center gap-6">
        <View className="hidden md:flex gap-8 items-center">
          <TouchableOpacity className="text-[#46291e]/60 px-2 py-1 rounded" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Studio"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 px-2 py-1 rounded" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"People"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 px-2 py-1 rounded" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Events"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#964900] font-bold px-2 py-1 rounded" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Ledger"}</Text>
          </TouchableOpacity>
        </View>
        <View className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
          <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBop-WpfdZtdKzZmsTSPWOJ_AENwajaFM6vfB1aDfl9I6QDaltiUzdvwRKZusm2lJ-fNOdun9Jew25JTTt07nJ6LvkrmV3KBqG-72MMqWVWP1HCgOSkTlgg8Wqzwos8rkYNAdOEbIIM1_AVkvfbpyziQ9I_SXxF07WJy14BNQqFrJbKzmSYJu5EsWjMtvqguF7k3_tL71JfK4c5wD_8w7tuCyWsr0q2zW9_AAuiImDRlfZpU2RAvjo3bTKuFkINezGdyR-DWn6FD1Z0" }} accessibilityLabel="Craftsman Profile" />
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full bg-[#f1edea] flex justify-around items-center pb-4 pt-2 px-4 border-t border-[#46291e]/10 shadow-[0_-4px_24px_rgba(70,41,30,0.06)] md:hidden z-50">
      <View className="flex flex-col items-center justify-center text-[#46291e]/50 text-[11px] font-sans uppercase tracking-widest">
        <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
        <Text>
          {"Studio"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-[#46291e]/50 text-[11px] font-sans uppercase tracking-widest">
        <MaterialIcons className="" name={"group" as MaterialIconName} />
        <Text>
          {"People"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-[#46291e]/50 text-[11px] font-sans uppercase tracking-widest">
        <MaterialIcons className="" name={"event" as MaterialIconName} />
        <Text>
          {"Events"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-[#964900] bg-[#46291e]/5 rounded-xl px-3 py-1 text-[11px] font-sans uppercase tracking-widest font-bold">
        <MaterialIcons className="" name={"payments" as MaterialIconName} />
        <Text>
          {"Ledger"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-[#46291e]/50 text-[11px] font-sans uppercase tracking-widest">
        <MaterialIcons className="" name={"favorite" as MaterialIconName} />
        <Text>
          {"Union"}
        </Text>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-32 pb-32 px-6 max-w-screen-xl mx-auto">
        <View className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <View className="max-w-2xl">
            <Text className="text-secondary font-semibold tracking-widest text-xs uppercase mb-4 block">
              {"Workshop Performance"}
            </Text>
            <Text className="text-5xl md:text-7xl text-primary font-serif leading-tight">
              {" Ledger "}
              <Text className="italic font-normal">
                {"&"}
              </Text>
              {" Insights "}
            </Text>
            <Text className="text-on-surface-variant mt-6 text-lg leading-relaxed max-w-lg">
              {" A curated overview of your atelier's vital statistics. From membership growth to the final stitch of the P&L statement, track the pulse of craftsmanship. "}
            </Text>
          </View>
          <View className="flex flex-col items-start gap-2">
            <View className="text-sm font-label text-outline uppercase tracking-tighter">
              <Text>{" Current Quarter "}</Text>
            </View>
            <View className="flex items-center gap-4 bg-surface-container p-4 rounded-xl">
              <View className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <MaterialIcons className="" name={"trending_up" as MaterialIconName} />
              </View>
              <View>
                <View className="text-2xl font-serif text-primary">
                  <Text>{"12.4%"}</Text>
                </View>
                <View className="text-xs text-on-surface-variant font-medium">
                  <Text>{" Net Growth vs Q3 "}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="flex md:grid-cols-2 gap-8 flex-col">
          <View className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden border border-outline-variant/20">
            <View className="relative z-10">
              <View className="flex justify-between items-start">
                <View className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center text-white mb-6">
                  <MaterialIcons className="text-3xl" name={"group" as MaterialIconName} />
                </View>
                <Text className="text-tertiary font-bold text-xs bg-tertiary-fixed px-3 py-1 rounded-full">
                  {"+48 New Craftsmen"}
                </Text>
              </View>
              <Text className="text-3xl text-primary font-serif mb-2">
                {" People Analytics "}
              </Text>
              <Text className="text-on-surface-variant max-w-md">
                {" Detailed demographics and retention metrics for the master guild and apprentice programs. "}
              </Text>
            </View>
            <View className="absolute right-0 bottom-0 opacity-10">
              <MaterialIcons className="text-[12rem] translate-x-8 translate-y-8 text-primary" name={"diversity_3" as MaterialIconName} />
            </View>
            <View className="relative z-10 flex items-center gap-4 mt-8">
              <TouchableOpacity className="bg-primary text-on-primary px-6 py-2 rounded-md font-medium text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Review Roster "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="text-primary font-semibold text-sm px-4 py-2 rounded-md" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Growth Report "}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-surface-container-highest rounded-xl p-8 flex flex-col justify-between min-h-[320px] border border-outline-variant/20">
            <View>
              <View className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-white mb-6">
                <MaterialIcons className="" name={"event" as MaterialIconName} />
              </View>
              <Text className="text-3xl text-primary font-serif mb-2">
                {" Event Analytics "}
              </Text>
              <Text className="text-on-surface-variant text-base">
                {" Attendance patterns and workshop engagement rates from seasonal expos across the region. "}
              </Text>
            </View>
            <View className="mt-4 border-t border-outline-variant/30 pt-6">
              <View className="flex justify-between items-center mb-2">
                <Text className="text-xs font-bold text-outline uppercase tracking-widest">
                  {"Success Rate"}
                </Text>
                <Text className="text-2xl font-serif text-secondary">
                  {"92%"}
                </Text>
              </View>
              <View className="w-full h-1.5 bg-outline-variant/30 rounded-full">
                <View className="w-[92%] h-full bg-secondary rounded-full" />
              </View>
            </View>
          </View>
          <View className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-between border-b-4 border-primary min-h-[320px] border-x border-t border-outline-variant/20">
            <View>
              <View className="flex items-center gap-4 mb-6">
                <View className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                  <MaterialIcons className="" name={"payments" as MaterialIconName} />
                </View>
                <Text className="text-2xl text-primary font-serif">
                  {" Transaction Analytics "}
                </Text>
              </View>
              <Text className="text-on-surface-variant text-base leading-relaxed">
                {" Velocity of sales, average order value, and refund frequency across workshop categories. "}
              </Text>
            </View>
            <View className="mt-8">
              <View className="text-4xl font-serif text-primary tracking-tight">
                <Text>{" $42,800.00 "}</Text>
              </View>
              <View className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">
                <Text>{" Total Volume / Mo "}</Text>
              </View>
            </View>
          </View>
          <View className="bg-tertiary/5 border border-tertiary/10 rounded-xl p-8 flex flex-col justify-between min-h-[320px]">
            <View>
              <View className="w-12 h-12 bg-tertiary text-white rounded-lg flex items-center justify-center mb-6">
                <MaterialIcons className="" name={"favorite" as MaterialIconName} />
              </View>
              <Text className="text-3xl text-primary font-serif mb-2">
                {" Matrimony Analytics "}
              </Text>
              <Text className="text-on-surface-variant text-base">
                {" Insights into the bespoke wedding collection performance and seasonal marriage trends. "}
              </Text>
            </View>
            <View className="flex items-center justify-between mt-4">
              <View className="flex -space-x-3">
                <Image className="w-10 h-10 rounded-full border-2 border-background" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZBlzu1PLndxBAtn-NBAdB2n1jn_6M_QYW3i-PxPNFN3LUmkAY70we488v7G1B0VlHV3uDYHZfFEjPkGn58xkwGxI30B2TkByDazajZu8nMn4HvEBm0Jc-DXmEZSRosyyRnJg6yRpVHEV29OahnjYz7kExsqipSpaQo0LF3ReBslVZDfSFonuh_Ddp9qswMR1cMrbTgAcwKE0u3ECd5GA7WNDx2ZG8ROVE0A3KqMR9DTm1wsKz8buwONheviiTykPQdWLWrt7_J4q_" }} accessibilityLabel="Female user profile" />
                <Image className="w-10 h-10 rounded-full border-2 border-background" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAr9wXSd083WWik9KOcdgyOsncSCb3CGDUWEPu3Td-ciiGjMthq6Q1ttO3E-boj2qHx5ph7MRL4sefPZ6KVwodAFQ7HRT-8dlPDl2AWWxkL7LJN52nSfpT9UGQkHnn32DIHzmujq8al3CjWrvD6-bicBe8WRo-PLZe6gMAzxM8rEgoxe5bPKF7nGfwx0IiosRcyqHd_mfdcVqHd3MPIwK70hf5DvPhK5M89TKCtMg8mrTi7Yy-ryrHgle-CK8CVfJ_Wcqb2pXV4kuWE" }} accessibilityLabel="Male user profile" />
                <View className="w-10 h-10 rounded-full border-2 border-background bg-tertiary-fixed text-xs flex items-center justify-center font-bold text-on-tertiary-fixed">
                  <Text>{" +12 "}</Text>
                </View>
              </View>
              <Text className="text-tertiary font-bold text-sm">
                {"View Collection"}
              </Text>
            </View>
          </View>
          <View className="bg-white rounded-xl p-8 shadow-sm flex flex-col border border-outline-variant/20 min-h-[320px]">
            <View className="flex justify-between items-center mb-8">
              <Text className="text-2xl text-primary font-serif">
                {"All Transactions"}
              </Text>
              <MaterialIcons className="text-outline" name={"open_in_new" as MaterialIconName} />
            </View>
            <View className="space-y-6">
              <View className="flex justify-between items-center">
                <View>
                  <View className="text-base font-bold text-primary">
                    <Text>{" Custom Oxford Boot "}</Text>
                  </View>
                  <View className="text-[10px] text-outline uppercase tracking-wider font-semibold">
                    <Text>{" Order #7721 • Oct 24 "}</Text>
                  </View>
                </View>
                <View className="text-lg font-serif text-secondary">
                  <Text>{"+$850.00"}</Text>
                </View>
              </View>
              <View className="flex justify-between items-center opacity-60">
                <View>
                  <View className="text-base font-bold text-primary">
                    <Text>{" Waxed Laces (Bulk) "}</Text>
                  </View>
                  <View className="text-[10px] text-outline uppercase tracking-wider font-semibold">
                    <Text>{" Order #7720 • Oct 23 "}</Text>
                  </View>
                </View>
                <View className="text-lg font-serif text-secondary">
                  <Text>{"+$120.00"}</Text>
                </View>
              </View>
              <View className="flex justify-between items-center opacity-60">
                <View>
                  <View className="text-base font-bold text-primary">
                    <Text>{" Sole Stitching Service "}</Text>
                  </View>
                  <View className="text-[10px] text-outline uppercase tracking-wider font-semibold">
                    <Text>{" Order #7719 • Oct 23 "}</Text>
                  </View>
                </View>
                <View className="text-lg font-serif text-secondary">
                  <Text>{"+$245.00"}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity className="mt-auto pt-6 text-xs font-bold text-primary uppercase tracking-[0.2em] text-center" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" View Entire Ledger "}</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            <View className="relative z-10">
              <Text className="text-secondary-fixed text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">
                {"Annual Summary"}
              </Text>
              <Text className="text-3xl font-serif mb-4 leading-tight">
                {" Yearly P&L Statement "}
              </Text>
              <View className="flex gap-4 mt-6 flex-col md:flex-row md:flex-wrap">
                <View className="bg-white/5 p-4 rounded-lg border border-white/10 w-full md:w-[48%]">
                  <View className="text-[10px] text-on-primary-container uppercase tracking-widest mb-1">
                    <Text>{" Revenue "}</Text>
                  </View>
                  <View className="text-2xl font-serif">
                    <Text>{"$1.2M"}</Text>
                  </View>
                </View>
                <View className="bg-white/5 p-4 rounded-lg border border-white/10 w-full md:w-[48%]">
                  <View className="text-[10px] text-on-primary-container uppercase tracking-widest mb-1">
                    <Text>{" Costs "}</Text>
                  </View>
                  <View className="text-2xl font-serif">
                    <Text>{"$420k"}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="relative z-10 mt-8">
              <TouchableOpacity className="w-full bg-secondary text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"download" as MaterialIconName} />
                <Text>{" Export PDF Statement "}</Text>
              </TouchableOpacity>
            </View>
            <View className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
