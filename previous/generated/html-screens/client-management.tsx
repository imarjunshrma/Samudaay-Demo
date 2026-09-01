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

export default function ClientManagementScreen() {
  return (
    <View className="flex-1 text-on-surface antialiased mb-24 md:mb-0 md:pt-20">
    <View className="absolute top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80">
      <View className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <View className="flex items-center gap-4">
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-[#46291e]" name={"grid_view" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-2xl font-serif italic text-[#46291e]">
            {" The Digital Atelier "}
          </Text>
        </View>
        <View className="hidden md:flex items-center gap-8">
          <TouchableOpacity className="text-[#964900] font-bold text-sm tracking-wide" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Clients"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 text-sm tracking-wide" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Configs"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 text-sm tracking-wide" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Billing"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 text-sm tracking-wide" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Audit"}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20">
            <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWvEoIhDQJv3HUjk3_eimjlmV2Z37P5Nbm2mi6gEY_772cIcZkPTxzGg0N3i1cpJGtk8TZjBiLzTQPIzlkpQMS1fxKr-FqV-hHTnlquU2NPjLBKYwWXMgXzoxQOLyvaKeFQklIyocdqUZjVwwSN2VteAxHHp4lWsfIHQiLYBE3583k1b6uhIu668qKSIiEYIVbGDF82mh59A8y8CcEvQQYadu9VSjP5jW1_U19o_U4JZoNZ4Ubf3bXGHTrm8VBIDdNunRMfzn9UZNE" }} accessibilityLabel="Superadmin Profile" />
          </View>
        </View>
      </View>
    </View>
    <TouchableOpacity className="absolute bottom-24 right-8 md:bottom-12 md:right-12 h-16 w-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50" accessibilityRole="button" activeOpacity={0.85}>
      <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
      <Text className="absolute right-full mr-4 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold opacity-0 whitespace-nowrap shadow-lg">
        {"Add New Client"}
      </Text>
    </TouchableOpacity>
    <View className="md:hidden absolute bottom-0 left-0 w-full bg-stone-100 dark:bg-stone-950 flex justify-around items-center px-4 pb-4 pt-2 z-50 rounded-t-xl border-t border-stone-200/30 shadow-[0_-4px_24px_rgba(70,41,30,0.06)]">
      <TouchableOpacity className="flex flex-col items-center justify-center bg-[#603f33] text-stone-50 rounded-lg px-4 py-1.5 translate-y-0.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="mb-1" name={"corporate_fare" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Clients"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/40 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="mb-1" name={"settings_input_component" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Configs"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/40 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="mb-1" name={"payments" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Billing"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#d7ccc8]/40 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="mb-1" name={"receipt_long" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Audit"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-7xl mx-auto px-6 py-12">
        <View className="mb-20 pt-8">
          <View className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <View className="max-w-2xl">
              <Text className="text-secondary text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
                {"Registry"}
              </Text>
              <Text className="text-6xl md:text-7xl font-serif text-primary leading-tight">
                {" Master Directory of "}
                <Text className="italic">
                  {"Client Guilds"}
                </Text>
              </Text>
              <Text className="text-on-surface-variant text-lg mt-6 max-w-lg leading-relaxed">
                {" Oversee the artisanal communities flourishing within the ecosystem. Monitor scale, status, and integrity across the collective. "}
              </Text>
            </View>
            <View className="w-full md:w-96">
              <View className="relative">
                <MaterialIcons className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary" name={"search" as MaterialIconName} />
                <TextInput className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 py-4 pl-12 pr-4 text-primary font-body placeholder:text-outline-variant/60" placeholder="Search communities..." />
              </View>
            </View>
          </View>
        </View>
        <View className="flex md:grid-cols-12 gap-8 items-start flex-col">
          <View className="md:col-span-8">
            <View className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-transparent relative overflow-hidden">
              <View className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -mr-16 -mt-16 rounded-full blur-3xl" />
              <View className="flex justify-between items-start mb-12">
                <View className="flex gap-4">
                  <View className="h-16 w-16 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
                    <MaterialIcons className="text-3xl" name={"token" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="text-3xl font-serif text-primary">
                      {" Stitch & Sole Collective "}
                    </Text>
                    <View className="flex items-center gap-2 mt-1">
                      <Text className="h-2 w-2 rounded-full bg-tertiary" />
                      <Text className="text-xs font-bold text-tertiary uppercase tracking-widest">
                        {"Active Community"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex gap-2">
                  <TouchableOpacity className="p-2 rounded-full text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"edit" as MaterialIconName} />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2 rounded-full text-error" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"block" as MaterialIconName} />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex gap-8 mb-8 border-t border-outline-variant/10 pt-8 flex-col md:flex-row md:flex-wrap">
                <View className="w-full md:w-[31%]">
                  <Text className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">
                    {" Total Artisans "}
                  </Text>
                  <Text className="text-3xl font-headline text-primary">
                    {"1,284"}
                  </Text>
                </View>
                <View className="w-full md:w-[31%]">
                  <Text className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">
                    {" Last Sync "}
                  </Text>
                  <Text className="text-xl font-body text-on-surface-variant">
                    {"2h ago"}
                  </Text>
                </View>
                <View className="w-full md:w-[31%]">
                  <Text className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">
                    {" Tier "}
                  </Text>
                  <Text className="text-xl font-body text-secondary">
                    {"Foundry Pro"}
                  </Text>
                </View>
              </View>
              <View className="h-48 w-full rounded-lg overflow-hidden grayscale">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqXIpGhlS-Qj06EHXe381vEy8WZtrFa7n9Sam9x3WA38GiXrJC5WGGLcvU0o0TgXV3Nqzg1ZWwKBCYHCkRdRSZ5filnHqFtqZvFHx6RvWScW6D4rOUYcSejRcfTr2Yyk0C2TbyC1SeSHjPfcPZca-fxYCOcXYicX8GiisMptpLJmDB1O6BLXhwvEZqLm_oiytpoIoFiSo7k9oMl1oVBdwgxf5hMQ57quUHhMCI9qXZqpVnNc3dY-ubG9UEGrEVK2ubr0inxZ33fKYq" }} accessibilityLabel="aerial view of a bright modern open-plan workshop space with wooden tables and large windows" />
              </View>
            </View>
          </View>
          <View className="md:col-span-4 flex flex-col gap-6">
            <View className="bg-surface-container p-6 rounded-xl">
              <View className="flex justify-between items-center mb-6">
                <Text className="text-xl font-serif text-primary">
                  {" The Tanner's Guild "}
                </Text>
                <Text className="bg-tertiary-container/30 text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  {"Verified"}
                </Text>
              </View>
              <View className="flex justify-between items-end">
                <View>
                  <Text className="text-2xl font-headline text-primary">
                    {" 842 "}
                    <Text className="text-sm font-body text-on-surface-variant/60 italic font-normal">
                      {"users"}
                    </Text>
                  </Text>
                  <View className="flex gap-3 mt-4">
                    <TouchableOpacity className="text-[10px] font-bold text-primary border-b border-primary/20 pb-0.5" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Edit Guild "}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="text-[10px] font-bold text-error border-b border-error/20 pb-0.5" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Inactivate "}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="h-12 w-12 bg-surface-container-lowest rounded-full flex items-center justify-center text-outline shadow-sm">
                  <MaterialIcons className="" name={"groups" as MaterialIconName} />
                </View>
              </View>
            </View>
            <View className="bg-surface-container p-6 rounded-xl">
              <View className="flex justify-between items-center mb-6">
                <Text className="text-xl font-serif text-primary">
                  {"Waxed Thread Co."}
                </Text>
                <Text className="bg-error-container/30 text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  {"Inactive"}
                </Text>
              </View>
              <View className="flex justify-between items-end opacity-60">
                <View>
                  <Text className="text-2xl font-headline text-primary">
                    {" 0 "}
                    <Text className="text-sm font-body text-on-surface-variant/60 italic font-normal">
                      {"users"}
                    </Text>
                  </Text>
                  <View className="flex gap-3 mt-4">
                    <TouchableOpacity className="text-[10px] font-bold text-primary border-b border-primary/20 pb-0.5" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Reactivate "}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="text-[10px] font-bold text-on-surface-variant/40 border-b border-transparent pb-0.5" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Settings "}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="h-12 w-12 bg-surface-container-lowest rounded-full flex items-center justify-center text-outline shadow-sm">
                  <MaterialIcons className="" name={"lock" as MaterialIconName} />
                </View>
              </View>
            </View>
          </View>
          <View className="md:col-span-12 mt-8">
            <View className="flex items-center justify-between mb-8">
              <Text className="text-xs font-bold text-outline uppercase tracking-[0.3em]">
                {" All Communities "}
              </Text>
              <View className="h-[1px] flex-grow bg-outline-variant/20 mx-6" />
              <View className="flex gap-2">
                <TouchableOpacity className="text-xs font-bold text-primary" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" View All "}</Text>
                </TouchableOpacity>
                <MaterialIcons className="text-sm text-outline" name={"chevron_right" as MaterialIconName} />
              </View>
            </View>
            <View className="space-y-4">
              <View className="flex md:grid-cols-5 items-center p-6 bg-surface-container-low rounded-xl flex-col md:flex-row md:flex-wrap">
                <View className="flex items-center gap-4 col-span-1 md:col-span-2 w-full md:w-[48%]">
                  <View className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-outline-variant/10">
                    <MaterialIcons className="text-secondary" name={"palette" as MaterialIconName} />
                  </View>
                  <Text className="text-lg font-headline text-primary">
                    {"Bespoke Finishes Ltd"}
                  </Text>
                </View>
                <View className="hidden md:block">
                  <Text className="text-xs font-bold text-outline-variant uppercase tracking-widest block mb-1">
                    {"Users"}
                  </Text>
                  <Text className="font-body text-on-surface">
                    {"312"}
                  </Text>
                </View>
                <View className="hidden md:block">
                  <Text className="text-xs font-bold text-outline-variant uppercase tracking-widest block mb-1">
                    {"Status"}
                  </Text>
                  <Text className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">
                    {"ACTIVE"}
                  </Text>
                </View>
                <View className="text-right flex justify-end gap-4 w-full md:w-[48%]">
                  <TouchableOpacity className="text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"settings_input_component" as MaterialIconName} />
                  </TouchableOpacity>
                  <TouchableOpacity className="text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"open_in_new" as MaterialIconName} />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex md:grid-cols-5 items-center p-6 bg-surface-container-low rounded-xl flex-col md:flex-row md:flex-wrap">
                <View className="flex items-center gap-4 col-span-1 md:col-span-2 w-full md:w-[48%]">
                  <View className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-outline-variant/10">
                    <MaterialIcons className="text-secondary" name={"auto_fix" as MaterialIconName} />
                  </View>
                  <Text className="text-lg font-headline text-primary">
                    {"The Lasting Studio"}
                  </Text>
                </View>
                <View className="hidden md:block">
                  <Text className="text-xs font-bold text-outline-variant uppercase tracking-widest block mb-1">
                    {"Users"}
                  </Text>
                  <Text className="font-body text-on-surface">
                    {"194"}
                  </Text>
                </View>
                <View className="hidden md:block">
                  <Text className="text-xs font-bold text-outline-variant uppercase tracking-widest block mb-1">
                    {"Status"}
                  </Text>
                  <Text className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">
                    {"ACTIVE"}
                  </Text>
                </View>
                <View className="text-right flex justify-end gap-4 w-full md:w-[48%]">
                  <TouchableOpacity className="text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"settings_input_component" as MaterialIconName} />
                  </TouchableOpacity>
                  <TouchableOpacity className="text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"open_in_new" as MaterialIconName} />
                  </TouchableOpacity>
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
