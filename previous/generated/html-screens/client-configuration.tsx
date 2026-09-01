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

export default function ClientConfigurationScreen() {
  return (
    <View className="flex-1 bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
    <View className="absolute top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80">
      <View className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <View className="flex items-center gap-4">
          <TouchableOpacity className="p-2 text-[#46291e] dark:text-[#d7ccc8] dark:hover:bg-stone-800/50 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"grid_view" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-2xl font-serif italic text-[#46291e] dark:text-[#d7ccc8]">
            {"The Digital Atelier"}
          </Text>
        </View>
        <View className="hidden md:flex items-center gap-8">
          <TouchableOpacity className="text-[#46291e]/60 dark:text-[#d7ccc8]/60 font-label uppercase text-[11px] tracking-widest" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Clients"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#964900] dark:text-[#ffb74d] font-bold font-label uppercase text-[11px] tracking-widest" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Configs"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 dark:text-[#d7ccc8]/60 font-label uppercase text-[11px] tracking-widest" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Billing"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 dark:text-[#d7ccc8]/60 font-label uppercase text-[11px] tracking-widest" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Audit"}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex items-center gap-3">
          <Text className="hidden md:block text-right">
            <Text className="text-[10px] uppercase tracking-tighter text-outline opacity-70">
              {" Superadmin "}
            </Text>
            <Text className="text-xs font-bold text-primary">
              {"Master Artisan"}
            </Text>
          </Text>
          <View className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center overflow-hidden">
            <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUVouIvUhXogPvl35Bg0hXvbYrK8onW5ZJ-ToDaZN072aSrj07fJoPFE-bpvPDC6vD9I_uhMCJ0ocWXefjoKMwY74r5XAWY9FVmksJpISqWEq1jsRsRsd9VKkMwFVLMV7gK40XUHMiEqVQdV-7kEuPQwWi4oMiNR_BDB7Z2p0tA9vV-AtJGwrb4oGOmip_NXx1WU8U0TZ61JsMj1q99fLa0dCl5A6ajqVgjvsOafYgWw9j5Qt1dsZi1cmlJvhbQCp1-JYScSHK7avW" }} accessibilityLabel="Superadmin Profile" />
          </View>
        </View>
      </View>
    </View>
    <View className="md:hidden absolute bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-stone-100 dark:bg-stone-950 border-t border-stone-200/30 dark:border-stone-800/30 shadow-[0_-4px_24px_rgba(70,41,30,0.06)] z-50">
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/40 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"corporate_fare" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase mt-1">
          {"Clients"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center bg-[#603f33] text-stone-50 rounded-lg px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"settings_input_component" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase mt-1">
          {"Configs"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/40 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"payments" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase mt-1">
          {"Billing"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/40 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"receipt_long" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase mt-1">
          {"Audit"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <View className="mb-12">
          <View className="flex items-center gap-2 text-outline text-sm mb-4">
            <Text>
              {"Clients"}
            </Text>
            <MaterialIcons className="text-xs" name={"chevron_right" as MaterialIconName} />
            <Text>
              {"Aurum Leatherworks"}
            </Text>
            <MaterialIcons className="text-xs" name={"chevron_right" as MaterialIconName} />
            <Text className="text-primary font-medium">
              {"Configuration"}
            </Text>
          </View>
          <View className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <View>
              <Text className="text-5xl md:text-6xl font-headline italic tracking-tight text-primary">
                {" Aurum Leatherworks "}
              </Text>
              <Text className="text-on-surface-variant mt-2 max-w-xl">
                {" Bespoke workshop profile and environmental parameters for high-fidelity digital production. "}
              </Text>
            </View>
            <View className="flex gap-4">
              <TouchableOpacity className="px-8 py-3 bg-surface-container-high text-primary font-bold rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Discard "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-xl shadow-primary/10" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Save Changes "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex lg:grid-cols-12 gap-8 flex-col">
          <View className="lg:col-span-7 space-y-8">
            <View className="bg-surface-container-low p-8 rounded-xl space-y-8">
              <View className="flex items-center gap-3 mb-2">
                <MaterialIcons className="text-secondary" name={"verified_user" as MaterialIconName} />
                <Text className="text-xl font-headline font-bold text-primary">
                  {" License & Access "}
                </Text>
              </View>
              <View className="flex md:grid-cols-2 gap-8 flex-col">
                <View className="space-y-2">
                  <View className="block text-[11px] uppercase tracking-widest text-outline font-bold">
                    <Text>{"License Type"}</Text>
                  </View>
                  <View className="relative">
                    <TextInput className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 px-0 appearance-none text-primary font-medium" />
                    <MaterialIcons className="absolute right-0 top-4 pointer-events-none text-outline" name={"expand_more" as MaterialIconName} />
                  </View>
                </View>
                <View className="space-y-2">
                  <View className="block text-[11px] uppercase tracking-widest text-outline font-bold">
                    <Text>{"Max User Count"}</Text>
                  </View>
                  <View className="flex items-center gap-4">
                    <TextInput className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 px-0 text-primary font-medium" placeholder="24" />
                    <Text className="px-3 py-1 bg-tertiary-container/10 text-tertiary text-[10px] font-bold uppercase rounded-full">
                      {"Seats Left: 4"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex items-center justify-between p-6 bg-surface-container rounded-lg border border-outline-variant/10">
                <View className="space-y-1">
                  <Text className="font-bold text-primary">
                    {"Allow Sub-communities"}
                  </Text>
                  <Text className="text-sm text-on-surface-variant max-w-xs">
                    {" Enable creation of nested guild-style departments within this client's workspace. "}
                  </Text>
                </View>
                <TouchableOpacity className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent bg-primary" accessibilityRole="button" activeOpacity={0.85}>
                  <Text className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 translate-x-5" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-surface-container-low p-8 rounded-xl space-y-8">
              <View className="flex items-center gap-3 mb-2">
                <MaterialIcons className="text-secondary" name={"palette" as MaterialIconName} />
                <Text className="text-xl font-headline font-bold text-primary">
                  {" The Visual Identity "}
                </Text>
              </View>
              <View className="space-y-4">
                <View className="block text-[11px] uppercase tracking-widest text-outline font-bold">
                  <Text>{"Client Brand Logo"}</Text>
                </View>
                <View className="flex flex-col md:flex-row items-center gap-8">
                  <View className="w-32 h-32 rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant flex items-center justify-center overflow-hidden relative">
                    <Image className="w-24 h-24 object-contain opacity-80" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO85Fs909FEiy6RJ9URS6UUI50Io1t9AdQBEQkoz-iK-wCND-XbcvYMjhfqAdaB8_nTTnJ7zkSXbZIeL5OnoxmSCQfGLdj39wYacGtfbaeMuJEG0i6X09In4xaeiq7zeewdByJSGpMTVqv7rtk7tCza1W9E7n09hk2Ss-vz8tPIZFEK38p66j0sMKAkZcSdfwhZAt0pkektWzDzEMs4R7gkObw1SzRqIGF_qIxOpuASoHNJakCfMl2qW92vxw0p08wyPAeePOmD3YU" }} accessibilityLabel="Client Logo" />
                    <View className="absolute inset-0 bg-primary/40 opacity-0 flex items-center justify-center">
                      <MaterialIcons className="text-white" name={"upload" as MaterialIconName} />
                    </View>
                  </View>
                  <View className="space-y-2 flex-1">
                    <Text className="text-sm text-primary font-bold">
                      {" aurum_master_v2.svg "}
                    </Text>
                    <Text className="text-xs text-on-surface-variant">
                      {" Recommended: 512x512px SVG or PNG with transparent background. Max 2MB. "}
                    </Text>
                    <TouchableOpacity className="text-xs text-secondary font-bold flex items-center gap-1" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="text-sm" name={"delete" as MaterialIconName} />
                      <Text>{" Remove Logo "}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className="space-y-6">
                <View className="block text-[11px] uppercase tracking-widest text-outline font-bold">
                  <Text>{"Signature Color Palette"}</Text>
                </View>
                <View className="flex md:grid-cols-4 gap-4 flex-col md:flex-row md:flex-wrap">
                  <TouchableOpacity className="p-4 rounded-xl border-2 border-primary bg-surface-container-lowest text-left ring-4 ring-primary/5 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                    <View className="flex gap-1 mb-3">
                      <View className="w-6 h-6 rounded-full bg-[#46291e]" />
                      <View className="w-6 h-6 rounded-full bg-[#964900]" />
                      <View className="w-6 h-6 rounded-full bg-[#fdf9f6] border border-stone-200" />
                    </View>
                    <Text className="text-xs font-bold text-primary">
                      {"Bespoke Tan"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-left w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                    <View className="flex gap-1 mb-3">
                      <View className="w-6 h-6 rounded-full bg-[#1a2e35]" />
                      <View className="w-6 h-6 rounded-full bg-[#5d6d7e]" />
                      <View className="w-6 h-6 rounded-full bg-[#f8f9f9] border border-stone-200" />
                    </View>
                    <Text className="text-xs font-bold text-on-surface-variant">
                      {"Slate & Steel"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-left w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                    <View className="flex gap-1 mb-3">
                      <View className="w-6 h-6 rounded-full bg-[#2d5a27]" />
                      <View className="w-6 h-6 rounded-full bg-[#8fb9a8]" />
                      <View className="w-6 h-6 rounded-full bg-[#f4f7f4] border border-stone-200" />
                    </View>
                    <Text className="text-xs font-bold text-on-surface-variant">
                      {"Forest Path"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="p-4 rounded-xl border border-outline-variant/30 border-dashed bg-surface-container-lowest flex flex-col items-center justify-center gap-1 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="text-outline" name={"add_circle" as MaterialIconName} />
                    <Text className="text-xs font-bold text-outline">
                      {"Custom Hex"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View className="lg:col-span-5 space-y-8">
            <View className="bg-primary text-on-primary p-8 rounded-xl shadow-2xl shadow-primary/20 relative overflow-hidden">
              <View className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <View className="relative z-10">
                <View className="flex items-center gap-2 mb-6">
                  <Text className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {"Active Subscription"}
                  </Text>
                </View>
                <Text className="text-3xl font-headline italic mb-4">
                  {" Enterprise Tallow "}
                </Text>
                <View className="space-y-4">
                  <View className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <Text className="opacity-60">
                      {"Created"}
                    </Text>
                    <Text className="font-medium">
                      {"Jan 12, 2024"}
                    </Text>
                  </View>
                  <View className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <Text className="opacity-60">
                      {"Last Configured"}
                    </Text>
                    <Text className="font-medium">
                      {"2 hours ago"}
                    </Text>
                  </View>
                  <View className="flex justify-between text-sm">
                    <Text className="opacity-60">
                      {"Managed By"}
                    </Text>
                    <Text className="font-medium underline decoration-white/20">
                      {"Julian Vane"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-surface-container border border-outline-variant/20 rounded-xl p-8 space-y-6">
              <Text className="text-[11px] uppercase tracking-widest text-outline font-bold">
                {" Real-time Interface Preview "}
              </Text>
              <View className="aspect-video bg-white rounded-lg shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col">
                <View className="h-4 bg-primary w-full" />
                <View className="flex-1 p-4 space-y-3">
                  <View className="flex items-center gap-3">
                    <View className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                      <View className="w-4 h-4 rounded-sm bg-secondary" />
                    </View>
                    <View className="space-y-1">
                      <View className="h-2 w-24 bg-stone-200 rounded" />
                      <View className="h-1.5 w-16 bg-stone-100 rounded" />
                    </View>
                  </View>
                  <View className="h-24 bg-stone-50 rounded-lg flex items-center justify-center">
                    <Text className="text-[10px] text-outline italic">
                      {"Dashboard Content Placeholder"}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xs text-on-surface-variant italic leading-relaxed">
                {" Changes to the palette and logo will propagate across the client's workspace instantly upon saving. "}
              </Text>
            </View>
            <View className="flex items-center gap-4 p-6 bg-tertiary-container/5 rounded-xl border border-tertiary/10">
              <View className="w-10 h-10 rounded-full bg-tertiary text-white flex items-center justify-center">
                <MaterialIcons className="text-lg" name={"history" as MaterialIconName} />
              </View>
              <View>
                <Text className="text-sm font-bold text-tertiary">
                  {"Audit Trail"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {" View all historical configuration changes for this client. "}
                </Text>
              </View>
              <MaterialIcons className="ml-auto text-tertiary/40" name={"arrow_forward" as MaterialIconName} />
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
