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

export default function KycApprovalScreen() {
  return (
    <View className="flex-1 bg-background text-on-background min-h-screen flex flex-col md:flex-row">
    <View className="hidden md:flex absolute left-0 top-0 h-full flex flex-col bg-[#f1edea] dark:bg-[#1a1614] w-72 rounded-r-lg border-r border-[#46291e]/10 z-40">
      <View className="p-6 flex items-center gap-4 mb-8">
        <View className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
          <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYCesiaJe2Tu3mXtPJfI2IyF6XxvQnvOl8EELFv94w-eguUCsZHzWfZ7p2bU3vsPKpxKkJiNMVT4iutDpUmv9Gy1hFFcGgib4DkvYjhwiluKCdxElBsRMcwSYofHFeq6wlxNk2diwz5MLEO2Pg3Kq4cLfLT_ao1IVT6SOKbV_efupEFN9mfRlznCAPokR7ZjGdr3qGtnoT9U38tn-hXs5XTre1QB2p6H830Q0rZLdIglfv14iaMbqfMCOzhECb6z8HvsSq9cvQ2XYS" }} accessibilityLabel="Admin Portrait" />
        </View>
        <View>
          <Text className="font-serif text-xl Newsreader text-[#46291e] dark:text-[#d7ccc8]">
            {" Head Inspector "}
          </Text>
          <Text className="font-sans text-xs font-medium Manrope text-[#46291e]/60 dark:text-[#d7ccc8]/60 uppercase tracking-tighter">
            {" Master Atelier "}
          </Text>
        </View>
      </View>
      <View className="flex-1 space-y-1">
        <View className="bg-[#46291e] text-white dark:bg-[#d7ccc8] dark:text-[#1a1614] rounded-md mx-2 px-4 py-3 flex items-center gap-3">
          <MaterialIcons className="" name={"pending_actions" as MaterialIconName} />
          <Text className="font-sans text-sm font-medium Manrope">
            {"Pending KYC"}
          </Text>
        </View>
        <View className="text-[#46291e] dark:text-[#d7ccc8] mx-2 px-4 py-3 flex items-center gap-3 dark:hover:bg-[#ffb74d]/10">
          <MaterialIcons className="" name={"verified_user" as MaterialIconName} />
          <Text className="font-sans text-sm font-medium Manrope">
            {"Verified Masters"}
          </Text>
        </View>
        <View className="text-[#46291e] dark:text-[#d7ccc8] mx-2 px-4 py-3 flex items-center gap-3 dark:hover:bg-[#ffb74d]/10">
          <MaterialIcons className="" name={"history_edu" as MaterialIconName} />
          <Text className="font-sans text-sm font-medium Manrope">
            {"Audit Logs"}
          </Text>
        </View>
        <View className="text-[#46291e] dark:text-[#d7ccc8] mx-2 px-4 py-3 flex items-center gap-3 dark:hover:bg-[#ffb74d]/10">
          <MaterialIcons className="" name={"settings" as MaterialIconName} />
          <Text className="font-sans text-sm font-medium Manrope">
            {"Workshop Settings"}
          </Text>
        </View>
      </View>
      <View className="p-6">
        <View className="text-[#46291e] dark:text-[#d7ccc8] font-serif italic text-2xl">
          <Text>{" Artisan Registry "}</Text>
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full flex justify-around items-center h-16 px-4 pb-4 bg-[#f1edea]/90 dark:bg-[#1a1614]/90 border-t border-[#46291e]/5 shadow-[0_-4px_24px_rgba(70,41,30,0.06)] md:hidden z-50">
      <View className="flex flex-col items-center justify-center text-[#964900] dark:text-[#ffb74d] font-bold scale-110">
        <MaterialIcons className="" name={"list_alt" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope">
          {"Applications"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/50">
        <MaterialIcons className="" name={"chat_bubble" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope">
          {"Messages"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/50">
        <MaterialIcons className="" name={"person" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope">
          {"Profile"}
        </Text>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="flex-1 md:ml-72 pb-24 md:pb-0">
        <View className="absolute top-0 w-full z-50 bg-[#f1edea]/80 dark:bg-[#1a1614]/80 shadow-sm dark:shadow-none flex items-center justify-between px-6 py-4 md:static md:bg-transparent md:backdrop-blur-none md:shadow-none">
          <View className="flex items-center gap-4">
            <MaterialIcons className="text-[#46291e] md:hidden" name={"menu" as MaterialIconName} />
            <Text className="font-serif font-bold text-2xl Newsreader text-[#46291e] dark:text-[#d7ccc8]">
              {" KYC Approval "}
            </Text>
          </View>
          <View className="flex items-center gap-4">
            <View className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxamhfIl1LvmjtPTgBBDFsB4K_LlnGm4LIiCxbkWYM_zACwgGmzk35dhb20azpEM3Sxc-A3UGffVNwoM0Ee5KDa2P0KmTs4m8UxdP4V7ASZ2zUIOeyd-MVg-f647lDfqdNJTuIg9xVrG92m1BUYMDe0p1uGyHBRkry95RvBsdKmca0Fc4ldG4jFbDOpGkT36YBlNTwXPVaSQoIqMPwo-PX4Cj1IBIFGfM7serSZc5Nv3EHnvsMU0ISAosADecCMeGHIz27tunu-CAl" }} accessibilityLabel="Admin User Profile" />
            </View>
          </View>
        </View>
        <View className="mt-20 md:mt-0 px-6 py-10 max-w-5xl mx-auto space-y-12">
          <View className="flex lg:grid-cols-12 gap-10 items-start flex-col">
            <View className="lg:col-span-8 space-y-8">
              <View>
                <Text className="text-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                  {"Application #88421"}
                </Text>
                <Text className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                  {" Arjun Varma "}
                </Text>
                <Text className="text-on-surface-variant text-lg mt-2 font-serif italic">
                  {" Third Generation Cordwainer, Kanpur District "}
                </Text>
              </View>
              <View className="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary shadow-sm">
                <Text className="text-primary font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                  <MaterialIcons className="text-sm" name={"person" as MaterialIconName} />
                  {" Profile Information "}
                </Text>
                <View className="flex md:grid-cols-2 gap-y-8 gap-x-12 flex-col">
                  <View className="space-y-1 border-b border-outline-variant/20 pb-2">
                    <Text className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      {" Full Name "}
                    </Text>
                    <Text className="text-on-surface text-lg font-medium">
                      {" Arjun Kumar Varma "}
                    </Text>
                  </View>
                  <View className="space-y-1 border-b border-outline-variant/20 pb-2">
                    <Text className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      {" Father's Name "}
                    </Text>
                    <Text className="text-on-surface text-lg font-medium">
                      {" Rajesh Varma "}
                    </Text>
                  </View>
                  <View className="space-y-1 border-b border-outline-variant/20 pb-2">
                    <Text className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      {" Gender "}
                    </Text>
                    <Text className="text-on-surface text-lg font-medium">
                      {"Male"}
                    </Text>
                  </View>
                  <View className="space-y-1 border-b border-outline-variant/20 pb-2">
                    <Text className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      {" Date of Birth "}
                    </Text>
                    <Text className="text-on-surface text-lg font-medium">
                      {" 12th August 1988 "}
                    </Text>
                  </View>
                  <View className="md:col-span-2 space-y-1">
                    <Text className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      {" Registered Address "}
                    </Text>
                    <Text className="text-on-surface text-lg font-medium leading-relaxed">
                      {" 42, Leather Artisan Block, Industrial Area Phase II, Jajmau, Kanpur, Uttar Pradesh - 208010 "}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="lg:col-span-4 space-y-6">
              <View className="bg-surface-container-highest p-6 rounded-xl space-y-6">
                <View className="flex items-center justify-between">
                  <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {"Status"}
                  </Text>
                  <Text className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {"Pending Audit"}
                  </Text>
                </View>
                <View className="space-y-2">
                  <Text className="text-xs text-on-surface-variant leading-relaxed">
                    {" Submitted 48 hours ago by regional node coordinator. "}
                  </Text>
                </View>
                <View className="h-px bg-outline-variant/30" />
                <View className="space-y-4">
                  <View className="flex items-center gap-3 text-tertiary">
                    <MaterialIcons className="text-lg" name={"check_circle" as MaterialIconName} />
                    <Text className="text-sm font-medium">
                      {"Aadhaar verified via API"}
                    </Text>
                  </View>
                  <View className="flex items-center gap-3 text-tertiary">
                    <MaterialIcons className="text-lg" name={"check_circle" as MaterialIconName} />
                    <Text className="text-sm font-medium">
                      {"Locality confirmed"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="space-y-6">
            <View className="flex items-baseline justify-between border-b border-outline-variant/30 pb-4">
              <Text className="text-2xl font-serif text-primary">
                {" Verification Documents "}
              </Text>
              <Text className="text-xs text-on-surface-variant">
                {" Click to enlarge documents "}
              </Text>
            </View>
            <View className="flex md:grid-cols-2 gap-8 flex-col">
              <View className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                <View className="p-4 bg-surface-container-low flex items-center justify-between">
                  <View className="flex items-center gap-3">
                    <MaterialIcons className="text-primary" name={"id_card" as MaterialIconName} />
                    <Text className="text-sm font-bold text-primary">
                      {"Aadhaar Card"}
                    </Text>
                  </View>
                  <MaterialIcons className="text-on-surface-variant text-sm" name={"open_in_full" as MaterialIconName} />
                </View>
                <View className="aspect-[1.6/1] bg-surface-container relative">
                  <Image className="w-full h-full object-cover opacity-80" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3dDhdtO1PqLzU8ddZX4Tr76oYU8IhJR1jptKHVp7tam93M3oO33GBHOpWM-TLxvqa_IboA4ECErqOxtMV__rkPn-mbF9wnq-PoBujSiY88OCKvj0zXiLME2N_n752NyeVbQtshfbnqyR0ZoXQwDFhhT6h3wdQc0fwCDmeYp9ohTMsIoCH3BXjBoVte0FfYMZs6A13YO9Z2wUAxN0mgIkadiWtkjrVYTLDCukT0gKt-YYb5Bg_QmDNZm-YwiXcLtkO1KPm8v0I8jPs" }} accessibilityLabel="Aadhaar Card" />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </View>
              </View>
              <View className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                <View className="p-4 bg-surface-container-low flex items-center justify-between">
                  <View className="flex items-center gap-3">
                    <MaterialIcons className="text-primary" name={"description" as MaterialIconName} />
                    <Text className="text-sm font-bold text-primary">
                      {"Caste Certificate"}
                    </Text>
                  </View>
                  <MaterialIcons className="text-on-surface-variant text-sm" name={"open_in_full" as MaterialIconName} />
                </View>
                <View className="aspect-[1.6/1] bg-surface-container relative">
                  <Image className="w-full h-full object-cover opacity-80" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzYA3A18r0bTUSo-xZWuLoVqUlUhyS2CfzwF4FSL_vTJxwko_NaXNxGTmxD0SQdnQIzFFYmiY2qq8OX9ns9QYB4_QlwX2x_hnEcg3l8C3h8FwjmS5gu_pdA5A8tsxcEGK3TN3pUhs4ai82qJTRX6uCzMoZCQ4JWKnHc_urT7208GYxGTzGkPNDNKWWTZjejRjbbvzWINDYHyl9yYbmvuLrydH5npJP-bGocz8_ucvIm7LFYz6M01L_MKIF2jk0A0uwmNlvUUw9m4hV" }} accessibilityLabel="Caste Certificate" />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </View>
              </View>
            </View>
          </View>
          <View className="bg-surface-container p-10 rounded-2xl space-y-8 border border-outline-variant/20">
            <View className="max-w-2xl">
              <Text className="text-2xl font-serif text-primary mb-2">
                {" Final Review Action "}
              </Text>
              <Text className="text-on-surface-variant text-sm">
                {" Ensure all document details match the digital profile before confirming artisan credentials. "}
              </Text>
            </View>
            <View className="space-y-4">
              <View className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <Text>{"Reason for Rejection (Optional if approving)"}</Text>
              </View>
              <TextInput className="w-full bg-surface-container-low border-b-2 border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant/40 rounded-t-lg p-4 font-body" placeholder="Detail the discrepancy found in documents..." multiline />
            </View>
            <View className="flex flex-col md:flex-row gap-4 pt-4">
              <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold py-4 rounded-lg uppercase tracking-wider text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"close" as MaterialIconName} />
                <Text>{" Reject with Reason "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-[1.5] flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/10 uppercase tracking-wider text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"verified" as MaterialIconName} />
                <Text>{" Approve Member "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
