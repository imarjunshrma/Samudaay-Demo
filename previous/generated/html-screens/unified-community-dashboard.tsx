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

export default function UnifiedCommunityDashboardScreen() {
  return (
    <View className="flex-1 bg-background text-on-background font-body min-h-screen pb-24">
    <View className="absolute top-0 w-full z-50 bg-[#f1edea]/80 shadow-sm flex justify-between items-center px-6 py-4">
      <View className="flex items-center gap-4">
        <MaterialIcons className="text-[#46291e]" name={"menu" as MaterialIconName} />
        <Text className="text-2xl font-bold tracking-tight text-[#46291e] font-headline">
          {" The Atelier "}
        </Text>
      </View>
      <View className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden">
        <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoeFJG0ITg2ZVIKyJcnhVqwC4mjjEnC-zEJKHtEcXedHiROTP3cUw_RBCitQQ4wazO6FHevLUd0y7NqEgR5ZSQPuxmeZS8aHIBnPaX8hyo0-AMyZHmItCa3wv79HJnnj4aY3V_KmyQil1SdqJC5yjwAnWK0I_gIMqdCRkNfi1W8V3nFSQuzon3xRob4Wiwy9-Lz3V6ktNM8z3X7x99Kf_ivTA0_sfoZkbsJSWuwcl_14tMAmuREQVmWy51sUAWdHvykC6bciQHnBLb" }} accessibilityLabel="Cobbler Profile Avatar" />
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#f1edea] dark:bg-[#1b100b] rounded-t-[0.5rem] shadow-[0_-4px_24px_rgba(70,41,41,0.06)]">
      <TouchableOpacity className="flex flex-col items-center justify-center bg-[#46291e] text-[#ffffff] rounded-lg px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"home_app_logo" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-wider mt-1">
          {"Home"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33] dark:text-[#a1887f] px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"import_contacts" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-wider mt-1">
          {"Directory"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33] dark:text-[#a1887f] px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"analytics" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-wider mt-1">
          {"Analytics"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33] dark:text-[#a1887f] px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"settings" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[11px] font-semibold uppercase tracking-wider mt-1">
          {"Settings"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        <View className="mt-8">
          <View className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <View>
              <Text className="text-secondary font-label font-bold uppercase tracking-widest text-xs">
                {"Master Artisan"}
              </Text>
              <Text className="text-5xl font-headline font-medium text-primary mt-2">
                {" Arjun Varma "}
              </Text>
              <Text className="text-on-surface-variant mt-2 max-w-md">
                {" Overseeing the legacy of hand-stitched excellence across the Indian Cobbler Community. "}
              </Text>
            </View>
            <View className="flex gap-4">
              <View className="bg-surface-container-low p-6 rounded-xl min-w-[140px]">
                <Text className="text-on-surface-variant text-xs font-label font-bold uppercase tracking-wider">
                  {"Active Members"}
                </Text>
                <Text className="text-3xl font-headline text-primary mt-1">
                  {"1,284"}
                </Text>
              </View>
              <View className="bg-surface-container-low p-6 rounded-xl min-w-[140px] border-l-4 border-secondary">
                <Text className="text-on-surface-variant text-xs font-label font-bold uppercase tracking-wider">
                  {"Pending Tasks"}
                </Text>
                <Text className="text-3xl font-headline text-primary mt-1">
                  {"12"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View className="flex items-center justify-between mb-8">
            <Text className="text-2xl font-headline text-primary">
              {" Artisan Management "}
            </Text>
            <View className="h-[1px] flex-grow mx-8 bg-outline-variant/30" />
          </View>
          <View className="flex md:grid-cols-2 lg:grid-cols-3 gap-4 flex-col">
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Donation"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Community welfare fund"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"calendar_today" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Event Management"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Workshops & Exhibitions"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="relative flex items-center p-5 bg-surface-container rounded-xl text-left border-l-2 border-secondary" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"verified" as MaterialIconName} />
              </View>
              <View className="absolute top-4 right-4 w-2 h-2 bg-secondary rounded-full" />
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"KYC Approvals"}
                </Text>
                <Text className="text-xs text-secondary font-bold">
                  {"4 Pending verification"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"favorite" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Matrimony"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Community matchmaking"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"receipt_long" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Expense Tracking"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Workshop overheads"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"newspaper" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Publication"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"The Cobbler's Journal"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"campaign" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Advertisements"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Promote artisan tools"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"notifications" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Notifications"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Broadcast alerts"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"person_pin" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Role Management"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Assign master status"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"lock_open" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Permissions"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Access level control"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 bg-surface-container rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-bright text-secondary mr-5 shadow-sm">
                <MaterialIcons className="text-2xl" name={"forum" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-sm uppercase tracking-wide">
                  {"Community Chat"}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {"Guild discussions"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-5 artisan-gradient rounded-xl text-left shadow-lg" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ffffff]/10 text-[#ffffff] mr-5">
                <MaterialIcons className="text-2xl" name={"trending_up" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-[#ffffff] text-sm uppercase tracking-wide">
                  {"Analytics"}
                </Text>
                <Text className="text-xs text-[#d9ab9b]">
                  {"Performance insights"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex md:grid-cols-12 gap-8 items-center flex-col">
          <View className="md:col-span-7 bg-tertiary-container p-8 rounded-2xl relative overflow-hidden">
            <View className="relative z-10">
              <Text className="text-on-tertiary-container text-xs font-bold uppercase tracking-widest">
                {"Featured Guild"}
              </Text>
              <Text className="text-3xl font-headline text-on-tertiary mt-2">
                {" Dharavi Master Craftsmen "}
              </Text>
              <Text className="text-on-tertiary/70 mt-4 leading-relaxed">
                {" Recognized for their exceptional bridle leather work and sustainable practices. A collaborative of 45 artisans. "}
              </Text>
              <TouchableOpacity className="mt-6 px-6 py-2 bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-full text-on-tertiary text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" View Profile "}</Text>
              </TouchableOpacity>
            </View>
            <View className="absolute -right-12 -bottom-12 w-64 h-64 bg-tertiary opacity-20 rounded-full blur-3xl" />
          </View>
          <View className="md:col-span-5 space-y-4">
            <View className="bg-surface-container-low p-6 rounded-xl border-b-2 border-secondary/20">
              <Text className="font-headline text-xl text-primary">
                {"Regional Growth"}
              </Text>
              <Text className="text-sm text-on-surface-variant mt-1">
                {" North Zone is seeing a 12% increase in new apprentices this month. "}
              </Text>
            </View>
            <View className="bg-surface-container-low p-6 rounded-xl border-b-2 border-secondary/20">
              <Text className="font-headline text-xl text-primary">
                {" Craft Preservation "}
              </Text>
              <Text className="text-sm text-on-surface-variant mt-1">
                {" New digital archive for Kolhapuri patterns is now 80% complete. "}
              </Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
