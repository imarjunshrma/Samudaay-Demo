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

export default function AdminDashboardScreen() {
  return (
    <View className="flex-1 bg-background text-zinc-900 font-body min-h-screen pb-24">
    <View className="absolute top-0 w-full z-50 bg-background/90 border-b border-outline-variant/30 flex justify-between items-center px-6 py-4">
      <View className="flex items-center gap-4">
        <MaterialIcons className="text-primary !fill-none" name={"menu" as MaterialIconName} />
        <Text className="text-2xl font-bold tracking-tight text-primary font-headline">
          {" The Atelier "}
        </Text>
      </View>
      <View className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden bg-surface-variant">
        <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoeFJG0ITg2ZVIKyJcnhVqwC4mjjEnC-zEJKHtEcXedHiROTP3cUw_RBCitQQ4wazO6FHevLUd0y7NqEgR5ZSQPuxmeZS8aHIBnPaX8hyo0-AMyZHmItCa3wv79HJnnj4aY3V_KmyQil1SdqJC5yjwAnWK0I_gIMqdCRkNfi1W8V3nFSQuzon3xRob4Wiwy9-Lz3V6ktNM8z3X7x99Kf_ivTA0_sfoZkbsJSWuwcl_14tMAmuREQVmWy51sUAWdHvykC6bciQHnBLb" }} accessibilityLabel="Cobbler Profile Avatar" />
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-background border-t border-outline-variant/30 shadow-[0_-8px_32px_rgba(93,64,55,0.08)]">
      <TouchableOpacity className="flex flex-col items-center justify-center bg-primary text-white rounded-2xl px-6 py-3 shadow-md" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="text-xl" name={"home" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider mt-1">
          {"Home"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-primary/60 px-4 py-2 rounded-2xl" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="text-xl !fill-none" name={"menu_book" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider mt-1">
          {"Directory"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-primary/60 px-4 py-2 rounded-2xl" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="text-xl !fill-none" name={"bar_chart" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider mt-1">
          {"Stats"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-primary/60 px-4 py-2 rounded-2xl" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="text-xl !fill-none" name={"settings" as MaterialIconName} />
        <Text className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider mt-1">
          {"Settings"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 px-4 max-w-5xl mx-auto space-y-10">
        <View className="mt-4 px-2">
          <View>
            <Text className="text-secondary font-label font-bold uppercase tracking-widest text-[10px]">
              {"Master Artisan"}
            </Text>
            <Text className="text-5xl font-headline font-medium text-primary mt-1">
              {" Arjun Varma "}
            </Text>
            <Text className="text-zinc-600 mt-3 text-sm leading-relaxed max-w-sm">
              {" Overseeing the legacy of hand-stitched excellence across the Indian Cobbler Community. "}
            </Text>
          </View>
          <View className="flex gap-3 mt-10">
            <View className="flex-1 bg-surface-variant/40 p-6 rounded-card border border-outline-variant/40">
              <Text className="text-secondary text-[10px] font-label font-bold uppercase tracking-wider">
                {"Active Members"}
              </Text>
              <Text className="text-4xl font-headline text-primary mt-2">
                {"1,284"}
              </Text>
            </View>
            <View className="flex-1 bg-white p-6 rounded-card border-2 border-primary shadow-sm">
              <Text className="text-secondary text-[10px] font-label font-bold uppercase tracking-wider">
                {"Pending Tasks"}
              </Text>
              <Text className="text-4xl font-headline text-primary mt-2">
                {"12"}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View className="flex items-center justify-between mb-8 px-2">
            <Text className="text-3xl font-headline text-primary">
              {" Artisan Management "}
            </Text>
            <View className="h-[1px] flex-grow ml-6 bg-outline-variant/30" />
          </View>
          <View className="flex gap-3 flex-col md:flex-row md:flex-wrap">
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Donation"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Welfare fund"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"calendar_today" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Events"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Workshops"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border-2 border-primary rounded-xl text-left relative w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white mb-4">
                <MaterialIcons className="text-lg" name={"verified" as MaterialIconName} />
              </View>
              <View className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"KYC"}
                </Text>
                <Text className="text-[10px] text-primary font-bold leading-tight truncate">
                  {"4 Pending"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"favorite" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Matrimony"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Matchmaking"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"receipt_long" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Expenses"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Overheads"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"newspaper" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Journal"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Publications"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"campaign" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Ads"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Promotions"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"notifications" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Alerts"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Broadcasts"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"person_pin" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Roles"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Assignments"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"lock_open" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Access"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Permissions"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 bg-white border border-outline-variant/40 rounded-xl text-left w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-variant text-primary mb-4">
                <MaterialIcons className="text-lg" name={"forum" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-primary text-[10px] uppercase tracking-wide truncate">
                  {"Chat"}
                </Text>
                <Text className="text-[10px] text-zinc-500 leading-tight truncate">
                  {"Discussions"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col p-4 artisan-gradient rounded-xl text-left shadow-lg w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ffffff]/15 text-[#ffffff] mb-4 border border-white/10">
                <MaterialIcons className="text-lg" name={"trending_up" as MaterialIconName} />
              </View>
              <View>
                <Text className="block font-label font-bold text-white text-[10px] uppercase tracking-wide truncate">
                  {"Analytics"}
                </Text>
                <Text className="text-[10px] text-[#ffffff]/70 leading-tight font-medium truncate">
                  {"Performance"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="space-y-4 px-2">
          <View className="bg-tertiary p-8 rounded-[2.5rem] relative overflow-hidden">
            <View className="relative z-10">
              <Text className="text-[#ffffff]/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                {"Featured Guild"}
              </Text>
              <Text className="text-4xl font-headline text-on-tertiary mt-2">
                {" Dharavi Master Craftsmen "}
              </Text>
              <Text className="text-on-tertiary/80 mt-4 text-sm leading-relaxed">
                {" Recognized for exceptional bridle leather work and sustainable practices. "}
              </Text>
              <TouchableOpacity className="mt-8 px-8 py-3 bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-xl text-on-tertiary text-xs font-semibold tracking-wide" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" View Profile "}</Text>
              </TouchableOpacity>
            </View>
            <View className="absolute -right-8 -bottom-8 w-64 h-64 bg-[#ffffff]/5 rounded-full blur-[80px]" />
          </View>
          <View className="flex gap-4 flex-col">
            <View className="bg-white p-8 rounded-2xl border border-outline-variant/40">
              <Text className="font-headline text-2xl text-primary">
                {"Regional Growth"}
              </Text>
              <Text className="text-sm text-zinc-600 mt-2 leading-relaxed">
                {" North Zone is seeing a 12% increase in new apprentices this month. "}
              </Text>
            </View>
            <View className="bg-white p-8 rounded-2xl border border-outline-variant/40">
              <Text className="font-headline text-2xl text-primary">
                {" Craft Preservation "}
              </Text>
              <Text className="text-sm text-zinc-600 mt-2 leading-relaxed">
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
