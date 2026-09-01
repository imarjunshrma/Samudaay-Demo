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

export default function MainNavigationMenuScreen() {
  return (
    <View className="flex-1 bg-surface font-body text-on-surface">
    <View className="absolute top-0 w-full z-50 bg-[#fdfbf9]/80 flex justify-between items-center px-6 py-4 shadow-sm bg-gradient-to-b from-[#46291e]/5 to-transparent">
      <View className="flex items-center gap-4">
        <MaterialIcons className="text-[#46291e]" name={"menu" as MaterialIconName} />
        <Text className="font-serif font-bold italic tracking-tight text-2xl text-[#46291e]">
          {" The Artisan Atelier "}
        </Text>
      </View>
      <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
        <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuChlT0FnLhllsGwOHBdTXcfY1A7f2IPxbunJ2of2-ioE86MvpGB_YhHmI32vgJtNseo0sJbGyCK8kLGCHAsY0RY3wzMSpo8v4PFqlSKVzbfTJFRNB6g3TFHY8_9OhSc9_TSF-o1Xg2exg2erec87sjDCe8VBZEDsgGUTMQVW6XTfaXJkm-6Zj8Y4E9DJzYR6vqFs549bv_7bv_qdWav9TOPKvUbiSaJqjhRw-gshLq05pj0qq4f3fNRvfApGRtkwussRn8UsS3u_mSH" }} accessibilityLabel="Master Cobbler Avatar" />
      </View>
    </View>
    <View className="md:hidden absolute bottom-0 left-0 w-full flex justify-around items-center h-20 pb-4 px-4 bg-[#fdfbf9] border-t border-[#46291e]/10 shadow-[0_-4px_12px_rgba(70,41,30,0.08)] z-50">
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#964900] relative after:content-[''] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-[#964900] after:rounded-full" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"home" as MaterialIconName} />
        <Text className="font-sans font-semibold text-[10px] uppercase tracking-tighter">
          {"Home"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33]/60" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
        <Text className="font-sans font-semibold text-[10px] uppercase tracking-tighter">
          {"Events"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33]/60" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"forum" as MaterialIconName} />
        <Text className="font-sans font-semibold text-[10px] uppercase tracking-tighter">
          {"Chats"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33]/60" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"article" as MaterialIconName} />
        <Text className="font-sans font-semibold text-[10px] uppercase tracking-tighter">
          {"News"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33]/60" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"person" as MaterialIconName} />
        <Text className="font-sans font-semibold text-[10px] uppercase tracking-tighter">
          {"Profile"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 min-h-screen flex">
        <View className="absolute inset-y-0 left-0 w-80 z-[60] flex flex-col bg-[#f1edea] shadow-2xl rounded-r-lg">
          <View className="p-8 flex flex-col gap-4">
            <View className="w-20 h-20 rounded-lg overflow-hidden shadow-lg border-2 border-surface-container-lowest">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFIUGZScdKNNMxDULnezEx5rj8pEQ2j4rbAeEkx4t3PaCU9ZyOTNSkvXCvZkDQrKLBSf4pUkLslr1IqWQp9gyj2fdGAQhXOFAkCW31Gj5C9L4UvcbzAjmtagVn5-tgErJszr_SHSuZAtkEDv3yMokBWg-SNYVUZevz1VESP7PhF4ab4KtO6kzydCmm0SoC9JJOm4QKipR3H8kvz_uSNGPqzedy2Zy7Fai_nbI9yNO3q_fFaaYiDxFFdA7tjg9-8GkKYTTksfVvRwk9" }} accessibilityLabel="Rajesh Kumar Profile" />
            </View>
            <View className="space-y-1">
              <Text className="font-serif text-xl font-bold text-[#46291e]">
                {" Rajesh Kumar "}
              </Text>
              <View className="flex items-center gap-2">
                <Text className="font-sans font-medium uppercase tracking-widest text-[10px] bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded-sm">
                  {"Master Cordwainer"}
                </Text>
              </View>
              <Text className="font-sans text-xs text-on-surface-variant/70 tracking-tight">
                {" Guild Member since 1994 • Premium Tier "}
              </Text>
            </View>
          </View>
          <View className="flex-1 overflow-y-auto px-4 pb-8 scrollbar-hide divide-y divide-[#46291e]/10">
            <View className="py-4 space-y-1">
              <TouchableOpacity className="flex items-center gap-4 bg-[#46291e] text-[#ffffff] rounded-sm px-4 py-3 active-nav-indicator relative" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Dashboard"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"person" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"My Profile"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"group" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Family"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"event" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Events"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Donations"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"newspaper" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"News"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"favorite" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Matrimony"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"payments" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"My Transactions"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"chat" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Chats"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"notifications" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Notifications"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-4 text-[#603f33] px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"cake" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Birthdays"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="pt-4 mt-auto">
              <TouchableOpacity className="flex items-center gap-4 text-error px-4 py-3" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"logout" as MaterialIconName} />
                <Text className="font-sans font-medium uppercase tracking-widest text-xs">
                  {"Logout"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="ml-80 flex-1 p-12 bg-surface">
          <View className="max-w-5xl mx-auto">
            <View className="mb-12">
              <Text className="font-serif text-5xl italic text-primary leading-tight mb-4">
                {" Welcome back,"}
                <View />
                {"Master Craftsman. "}
              </Text>
              <Text className="text-on-surface-variant font-body text-lg max-w-md">
                {" Your workshop overview and guild updates for today. "}
              </Text>
            </View>
            <View className="flex gap-8 flex-col md:flex-row md:flex-wrap">
              <View className="col-span-8 bg-surface-container rounded-xl overflow-hidden shadow-sm flex items-stretch">
                <View className="w-1/2 p-8 flex flex-col justify-center">
                  <Text className="text-secondary font-sans text-xs uppercase tracking-widest font-bold mb-2">
                    {"Upcoming Event"}
                  </Text>
                  <Text className="font-serif text-3xl text-primary mb-4">
                    {" The Annual Cordwainers Summit 2024 "}
                  </Text>
                  <Text className="text-on-surface-variant text-sm mb-6">
                    {" Join 200+ masters in Jodhpur to share techniques on vegetable tanning and heritage lasting. "}
                    <TouchableOpacity className="w-fit px-6 py-3 bg-primary text-on-primary font-sans text-xs uppercase tracking-widest rounded-sm" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Reserve Seat "}</Text>
                    </TouchableOpacity>
                  </Text>
                </View>
                <View className="w-1/2 relative">
                  <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc1RmZZ5YHIAis60Om6y0Y-JGe7WRferxqFKK-VteUKr_Q9gIUfIzODnAuN1_zykvqUlPtET1ypIMJG6EUSsWoeupFRXn07-LZE5tB3KRJwvN7uc2JFnqsCgv33TM_ouvkHur6N-JvYVVBSk3A5CBf9RJWx-J7bJ6LJ9mhsTGCf5s7ZNxjpgtSG0gG5sk1vmTEDaVpTotja8pXxyLSF3N7hFlMPLRTXQSrnyNji10Jxy0mK66KaH3drRrhHcAMmC1XyQWRXSDdgrr5" }} accessibilityLabel="Leather Crafting Tools" />
                </View>
              </View>
              <View className="col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between border-b-2 border-secondary/20">
                <View>
                  <MaterialIcons className="text-secondary mb-4" name={"volunteer_activism" as MaterialIconName} />
                  <Text className="font-serif text-2xl text-primary mb-2">
                    {" Community Fund "}
                  </Text>
                  <Text className="text-on-surface-variant text-sm">
                    {" Supporting 12 new apprentices this month through collective donations. "}
                  </Text>
                </View>
                <View className="mt-8">
                  <Text className="text-primary font-serif text-4xl">
                    {"₹42,500"}
                  </Text>
                  <Text className="text-on-surface-variant text-[10px] uppercase tracking-tighter mt-1">
                    {" Goal Reached: 84% "}
                  </Text>
                </View>
              </View>
              <View className="col-span-4 mt-8">
                <Text className="font-serif text-xl italic text-primary mb-6 border-l-4 border-secondary/30 pl-4">
                  {" Guild News "}
                </Text>
                <View className="space-y-8">
                  <View>
                    <Text className="text-[10px] font-sans text-secondary uppercase tracking-widest mb-1">
                      {" June 12 "}
                    </Text>
                    <Text className="font-body font-bold text-on-surface">
                      {" New Export Quality Standards for Leather Sole Stitching "}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-[10px] font-sans text-secondary uppercase tracking-widest mb-1">
                      {" June 10 "}
                    </Text>
                    <Text className="font-body font-bold text-on-surface">
                      {" Raw Material Price Stabilization in Kanpur Hub "}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="col-span-8 mt-8 flex gap-8 flex-col md:flex-row md:flex-wrap">
                <View className="bg-tertiary-container/10 p-6 rounded-xl w-full md:w-[48%]">
                  <View className="flex justify-between items-start mb-4">
                    <MaterialIcons className="text-tertiary" name={"favorite" as MaterialIconName} />
                    <Text className="text-[10px] font-sans text-tertiary uppercase tracking-widest">
                      {"Matrimony"}
                    </Text>
                  </View>
                  <Text className="font-body text-sm text-on-surface-variant">
                    {" 3 New profiles matching your family preferences. "}
                  </Text>
                </View>
                <View className="bg-surface-container-highest p-6 rounded-xl w-full md:w-[48%]">
                  <View className="flex justify-between items-start mb-4">
                    <MaterialIcons className="text-primary" name={"cake" as MaterialIconName} />
                    <Text className="text-[10px] font-sans text-primary uppercase tracking-widest">
                      {"Birthdays"}
                    </Text>
                  </View>
                  <Text className="font-body text-sm text-on-surface-variant">
                    {" Anil Varma and 2 others are celebrating today. "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
