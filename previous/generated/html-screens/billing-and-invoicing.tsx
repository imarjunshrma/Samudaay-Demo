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

export default function BillingAndInvoicingScreen() {
  return (
    <View className="flex-1 bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
    <View className="absolute top-0 w-full z-50 bg-stone-50/80">
      <View className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <View className="flex items-center gap-4">
          <MaterialIcons className="text-[#46291e]" name={"grid_view" as MaterialIconName} />
          <Text className="text-2xl font-serif italic text-[#46291e]">
            {" The Digital Atelier "}
          </Text>
        </View>
        <View className="hidden md:flex items-center gap-8">
          <TouchableOpacity className="text-[#46291e]/60 font-medium" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Clients"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 font-medium" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Configs"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#964900] font-bold" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Billing"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="text-[#46291e]/60 font-medium" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{"Audit"}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex items-center gap-3">
          <View className="text-right hidden sm:block">
            <Text className="text-xs font-bold text-primary uppercase tracking-tighter">
              {" Superadmin "}
            </Text>
            <Text className="text-[10px] text-on-surface-variant">
              {"Master Artisan"}
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8xXm6to0Tmledrbm6AcUJU-PI4iGty1rmzNgIgFuQ9PWpm44rZxa8ILKfJNU4uUklDJpMK8radkoI6j8L1_GkIglc-l0mLyzdWJ1w9Q6Gpk3SJ12bG6BSoglToN7ni9aq2AfQhvD-2ZvHo_doV9_BVnO0Um-IrAir2LHyEyGTTSHYVKdLm50xRixF2rgunfz7c_8sVjE4b4v1IzEjaizi2d7NcYnBHCf6BSeVroS9siLOO_6HhKrfJyGmFGOdkjh80VKIq8Uc-9Q9" }} accessibilityLabel="Superadmin Profile" />
          </View>
        </View>
      </View>
    </View>
    <View className="md:hidden absolute bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-stone-100 dark:bg-stone-950 z-50 rounded-t-xl shadow-[0_-4px_24px_rgba(70,41,30,0.06)] border-t border-stone-200/30">
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"corporate_fare" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Clients"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"settings_input_component" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Configs"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center bg-[#603f33] text-stone-50 rounded-lg px-4 py-1.5 translate-y-0.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"payments" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Billing"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 px-4 py-1.5" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"receipt_long" as MaterialIconName} />
        <Text className="text-[11px] font-sans tracking-wide uppercase">
          {"Audit"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <View className="mb-16">
          <View className="flex md:grid-cols-12 gap-8 items-end flex-col">
            <View className="md:col-span-8">
              <Text className="text-secondary font-semibold tracking-widest uppercase text-xs mb-4 block">
                {"Financial Ledger"}
              </Text>
              <Text className="text-5xl md:text-7xl font-light leading-tight">
                {" Billing & "}
                <Text className="italic">
                  {"Revenue"}
                </Text>
              </Text>
            </View>
            <View className="md:col-span-4 text-right">
              <Text className="text-on-surface-variant body-md max-w-xs ml-auto">
                {" Precision tracking of atelier subscriptions and service retainers. Managed with the same care as a hand-welted sole. "}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex md:grid-cols-4 gap-6 mb-16 flex-col">
          <View className="md:col-span-2 p-8 bg-primary-container rounded-xl text-stone-50 flex flex-col justify-between relative overflow-hidden">
            <View className="relative z-10">
              <Text className="text-stone-50/60 text-sm font-label uppercase tracking-widest mb-2">
                {" Total Monthly Recurring Revenue "}
              </Text>
              <Text className="text-5xl font-headline italic">
                {"$42,850.00"}
              </Text>
            </View>
            <View className="mt-8 flex items-center gap-2 relative z-10">
              <MaterialIcons className="text-tertiary-fixed-dim" name={"trending_up" as MaterialIconName} />
              <Text className="text-xs font-label">
                {"+12.4% from last month"}
              </Text>
            </View>
            <View className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          </View>
          <View className="p-8 bg-surface-container rounded-xl flex flex-col justify-between border-b-2 border-outline-variant/10">
            <View>
              <Text className="text-on-surface-variant text-sm font-label uppercase tracking-widest mb-2">
                {" Upcoming Renewals "}
              </Text>
              <Text className="text-4xl font-headline">
                {"14"}
              </Text>
            </View>
            <View className="mt-4 text-xs text-secondary font-bold flex items-center gap-1">
              <MaterialIcons className="text-sm" name={"event_repeat" as MaterialIconName} />
              <Text>{" Next 7 Days "}</Text>
            </View>
          </View>
          <View className="p-8 bg-surface-container-high rounded-xl flex flex-col justify-between border-b-2 border-outline-variant/10">
            <View>
              <Text className="text-on-surface-variant text-sm font-label uppercase tracking-widest mb-2">
                {" Outstanding "}
              </Text>
              <Text className="text-4xl font-headline">
                {"$3,210"}
              </Text>
            </View>
            <View className="mt-4 text-xs text-error font-bold flex items-center gap-1">
              <MaterialIcons className="text-sm" name={"error" as MaterialIconName} />
              <Text>{" 3 Overdue Invoices "}</Text>
            </View>
          </View>
        </View>
        <View className="flex lg:grid-cols-3 gap-12 flex-col">
          <View className="lg:col-span-2 space-y-8">
            <View className="flex justify-between items-center">
              <Text className="text-2xl font-headline italic">
                {"Recent Invoices"}
              </Text>
              <TouchableOpacity className="text-xs font-bold uppercase tracking-widest border-b border-primary pb-1" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" View All Ledger "}</Text>
              </TouchableOpacity>
            </View>
            <View className="space-y-4">
              <View className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low rounded-xl">
                <View className="flex items-center gap-4 mb-4 md:mb-0">
                  <View className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary">
                    <MaterialIcons className="" name={"description" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-primary">
                      {"Heritage Leathers Co."}
                    </Text>
                    <Text className="text-xs text-on-surface-variant">
                      {" INV-2023-0842 • Oct 12, 2023 "}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center justify-between md:justify-end gap-8">
                  <View className="text-right">
                    <Text className="font-headline text-xl">
                      {"$1,250.00"}
                    </Text>
                    <Text className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold uppercase rounded tracking-tighter">
                      {"Paid"}
                    </Text>
                  </View>
                  <View className="flex gap-2">
                    <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="" name={"download" as MaterialIconName} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full opacity-30" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="" name={"notification_add" as MaterialIconName} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low rounded-xl">
                <View className="flex items-center gap-4 mb-4 md:mb-0">
                  <View className="w-12 h-12 bg-error-container/20 rounded-lg flex items-center justify-center text-error">
                    <MaterialIcons className="" name={"warning" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-primary">
                      {"Savile Row Bespoke"}
                    </Text>
                    <Text className="text-xs text-on-surface-variant">
                      {" INV-2023-0839 • Oct 05, 2023 "}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center justify-between md:justify-end gap-8">
                  <View className="text-right">
                    <Text className="font-headline text-xl">
                      {"$2,400.00"}
                    </Text>
                    <Text className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold uppercase rounded tracking-tighter">
                      {"Overdue"}
                    </Text>
                  </View>
                  <View className="flex gap-2">
                    <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="" name={"download" as MaterialIconName} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full text-secondary" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="" name={"notification_add" as MaterialIconName} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low rounded-xl">
                <View className="flex items-center gap-4 mb-4 md:mb-0">
                  <View className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary">
                    <MaterialIcons className="" name={"description" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-primary">
                      {"The Lasting Studio"}
                    </Text>
                    <Text className="text-xs text-on-surface-variant">
                      {" INV-2023-0831 • Sep 28, 2023 "}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center justify-between md:justify-end gap-8">
                  <View className="text-right">
                    <Text className="font-headline text-xl">
                      {"$850.00"}
                    </Text>
                    <Text className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold uppercase rounded tracking-tighter">
                      {"Paid"}
                    </Text>
                  </View>
                  <View className="flex gap-2">
                    <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="" name={"download" as MaterialIconName} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full opacity-30" accessibilityRole="button" activeOpacity={0.85}>
                      <MaterialIcons className="" name={"notification_add" as MaterialIconName} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="space-y-12">
            <View className="bg-surface-container p-8 rounded-xl">
              <Text className="text-xl font-headline italic mb-6">
                {"Client Tiers"}
              </Text>
              <View className="space-y-6">
                <View className="flex justify-between items-center">
                  <Text className="text-sm font-label uppercase text-on-surface-variant">
                    {"Master Artisan"}
                  </Text>
                  <Text className="font-bold text-primary">
                    {"12 Clients"}
                  </Text>
                </View>
                <View className="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                  <View className="bg-primary h-full w-[80%] rounded-full" />
                </View>
                <View className="flex justify-between items-center">
                  <Text className="text-sm font-label uppercase text-on-surface-variant">
                    {"Journeyman"}
                  </Text>
                  <Text className="font-bold text-primary">
                    {"28 Clients"}
                  </Text>
                </View>
                <View className="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                  <View className="bg-secondary h-full w-[45%] rounded-full" />
                </View>
                <View className="flex justify-between items-center">
                  <Text className="text-sm font-label uppercase text-on-surface-variant">
                    {"Apprentice"}
                  </Text>
                  <Text className="font-bold text-primary">
                    {"64 Clients"}
                  </Text>
                </View>
                <View className="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                  <View className="bg-tertiary h-full w-[60%] rounded-full" />
                </View>
              </View>
            </View>
            <View className="relative rounded-xl overflow-hidden aspect-[4/5] shadow-xl">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxn353UjBPdoul75d55CiYu3OggYqGV1x068ipoRmQqilFHjMXYnfOxE4I-9AHS8GDTupg_FrEsvh6klva1Dews3uyFp2YfAxqIw5osiMTDMWlLXyi64mC8m5icw-TrbCHxPabnpAb-DyWnwy1lmo5Je5R3SOJMJ7eogS8eZEWJly8CLHrG5TDqcbeHFDfaRBh3OD_iCNs_S8Ao4I4GziD0otrdphBnJtqQsD-jP4PVsVUtL-VSQV_KQMpjnMkSs6aRGKk7vvn9r2M" }} accessibilityLabel="Renewal Context" />
              <View className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-8 text-stone-50">
                <Text className="text-2xl font-headline italic mb-2">
                  {" Renewal Spotlight "}
                </Text>
                <Text className="text-sm text-stone-300 mb-6 font-body">
                  {" Global Cobblers Guild subscription renews in 2 days ($4,500.00) "}
                </Text>
                <TouchableOpacity className="w-full py-3 bg-stone-50 text-primary font-bold uppercase tracking-widest text-[10px] rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Review Contract "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
