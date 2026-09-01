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

export default function DashboardWithAdPopupScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen overflow-hidden">
    <View className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <View className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in">
        <TouchableOpacity className="absolute top-3 right-3 z-10 p-2 bg-black/20 text-white rounded-full" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="block" name={"close" as MaterialIconName} />
        </TouchableOpacity>
        <View className="relative aspect-[4/3] w-full overflow-hidden">
          <Image className="h-full w-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB" }} accessibilityLabel="Premium Leather Supplies Ad" />
          <View className="absolute top-4 left-4">
            <Text className="px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
              <MaterialIcons className="text-[10px]" name={"campaign" as MaterialIconName} />
              {" Sponsored "}
            </Text>
          </View>
        </View>
        <View className="p-6">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {" Exclusive Member Discount "}
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            {" Get up to 30% off on all premium leather tools and raw hides this festive season. Only for registered ICC members. Limited time offer! "}
          </Text>
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Shop Now "}</Text>
            <MaterialIcons className="text-sm" name={"arrow_forward" as MaterialIconName} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View className="absolute top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
      <View className="flex items-center p-4 justify-between max-w-2xl mx-auto">
        <View className="flex items-center gap-3">
          <MaterialIcons className="text-primary text-3xl" name={"shield_person" as MaterialIconName} />
          <Text className="text-lg font-bold leading-tight tracking-tight">
            {" ICC Digital ID "}
          </Text>
        </View>
        <View className="flex items-center gap-2">
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"notifications" as MaterialIconName} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"menu" as MaterialIconName} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 pb-4 pt-2 z-50">
      <View className="max-w-2xl mx-auto flex justify-between">
        <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"home" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Home"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"groups" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Directory"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"handyman" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Services"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"account_circle" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-2xl mx-auto pb-24">
        <View className="px-4 pt-4">
          <View className="relative overflow-hidden rounded-xl border border-primary/20 bg-white dark:bg-slate-800/50 p-4 shadow-sm">
            <View className="flex items-center justify-between mb-2">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <MaterialIcons className="text-xs" name={"info" as MaterialIconName} />
                {" Sponsored "}
              </Text>
              <TouchableOpacity className="text-[10px] text-primary font-bold" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Learn More "}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex gap-4 items-center">
              <View className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                <Image className="h-full w-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOFlvgbn6TNNOqEgec2A_oXMmeA_ZoHLGwKG5JzqbnXCgh9BDlmtdLJDjw-3ekRb_GB4cvHK-W8rRINMxuOe_uhJaMQhlVP2WP1x7UmtLY3QuI-eWzx71lK_bsUW564aXaTBMPnHZS5R49GCIDbzghV231tNwOQEWCoR8mLkbfa2_utfb_hp7mJdSdGlCEQap8AwPBk8ieIilesnX0QuSL0fvvxkBB2fP7RcMCpH5qSZZR6lknw4eKjSLkXYw3QAjCHqo47xR1sula" }} accessibilityLabel="Sponsored Ad" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold leading-tight">
                  {" Premium Leather Supplies "}
                </Text>
                <Text className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {" Get 20% off on bulk orders of authentic full-grain leather. Certified quality for ICC members. "}
                </Text>
              </View>
              <TouchableOpacity className="bg-primary text-white p-2 rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"open_in_new" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="px-4 pt-6">
          <Text className="text-xl font-bold mb-4">
            {"Digital Membership Card"}
          </Text>
          <View className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#d6660a] p-6 shadow-xl text-white">
            <View className="flex justify-between items-start mb-6">
              <View className="flex flex-col">
                <Text className="text-xs uppercase tracking-widest opacity-80">
                  {"Indian Cobbler Community"}
                </Text>
                <Text className="text-sm font-semibold">
                  {"Official Member"}
                </Text>
              </View>
              <MaterialIcons className="text-4xl opacity-50" name={"contactless" as MaterialIconName} />
            </View>
            <View className="flex gap-4 items-center">
              <View className="h-24 w-24 rounded-lg bg-white p-1 shrink-0 overflow-hidden">
                <Image className="h-full w-full object-cover rounded-md" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcTdiOPDFjB0DIG6ekJmydxKptp_AKtUY16EjP9JCuLZYwa-fdfH48OI1asmtP4RTU3E45Muq36kU4TuPc1ppDyympPbZY5FhgXEqmPhKsIC_ZdY21lYRrRK06RsbgH1MBaXXXP5tXi0uU2U2n_90x-G_mqpzQ5VxeXLxWlkRDrz-4C6mFxPatuU1QBa-FsEv9PlFfeZcjweOkW6Rhgadcs6krvBlRwAKU-ZN_cShw6PwgAW5oE4kEZYvAklE75L9J3aPyI_OR9inX" }} accessibilityLabel="Member profile photo" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold leading-none">
                  {"Rajesh Kumar"}
                </Text>
                <Text className="text-sm opacity-90 mt-1">
                  {"ID: IC-2024-8839"}
                </Text>
                <View className="mt-3 flex flex-col gap-1 text-xs">
                  <View className="flex items-center gap-1">
                    <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                    <Text>
                      {"Mumbai, Maharashtra"}
                    </Text>
                  </View>
                  <View className="flex items-center gap-1">
                    <MaterialIcons className="text-xs" name={"event_available" as MaterialIconName} />
                    <Text>
                      {"Valid thru: Dec 2030"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="mt-6 flex justify-between items-end border-t border-white/20 pt-4">
              <View className="bg-white p-2 rounded-lg">
                <Image className="h-12 w-12" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_NQ8t26AbRvCgZ3RZC1OfRIuu86GwJnKa5qlryBtDBAeI52PY0ugDkPAVgekUW2Pgv3mk42jBL1S7VrWt9ZLGVLfas1hOk1JW1NwKUMl9gzz_Y9xoPNrGg6moTcX1UVMjkaI6dqozojsU7YYzCqIocqkeB7yCQZXm0QeLE3X0og5kbGivGmR8lCtVKmhg3y1WqAyPj4wcCdv7E7rtEvbbuk4eKncK4bmwhD8ST1ewFAV1NsZXsM9mC8jAgqZ4h9c_n0Hi6ss-qd2V" }} accessibilityLabel="Member QR Code" />
              </View>
              <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"qr_code_scanner" as MaterialIconName} />
                <Text>{" Verify Card "}</Text>
              </TouchableOpacity>
            </View>
            <View className="absolute -right-10 -bottom-10 opacity-10">
              <MaterialIcons className="text-[160px]" name={"identity_platform" as MaterialIconName} />
            </View>
          </View>
        </View>
        <View className="px-4 mt-8">
          <Text className="text-lg font-bold mb-4">
            {"Community Dashboard"}
          </Text>
          <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
            <TouchableOpacity className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/10 shadow-sm flex flex-col gap-3 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcons className="" name={"person" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold">
                  {"My Profile"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Manage details "}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/10 shadow-sm flex flex-col gap-3 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcons className="" name={"family_restroom" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold">
                  {"Family"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" 4 Registered "}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/10 shadow-sm flex flex-col gap-3 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcons className="" name={"calendar_month" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold">
                  {"Events"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Next: Annual Meet "}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/10 shadow-sm flex flex-col gap-3 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold">
                  {"Donations"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" History & Support "}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/10 shadow-sm flex flex-col gap-3 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcons className="" name={"newspaper" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold">
                  {"News"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Community updates "}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-primary/10 shadow-sm flex flex-col gap-3 w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
              <View className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcons className="" name={"favorite" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold">
                  {"Matrimony"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Find matches "}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 mt-8">
          <View className="flex justify-between items-center mb-4">
            <Text className="text-lg font-bold">
              {"Recent Updates"}
            </Text>
            <TouchableOpacity className="text-primary text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"View All"}</Text>
            </TouchableOpacity>
          </View>
          <View className="space-y-4">
            <View className="flex gap-4 p-3 bg-white dark:bg-slate-800/30 rounded-lg border border-primary/5">
              <View className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                <Image className="h-full w-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB" }} accessibilityLabel="Workshop update" />
              </View>
              <View>
                <Text className="text-sm font-semibold">
                  {"Skill Workshop in Mumbai"}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" 2 days ago • Community Center "}
                </Text>
              </View>
            </View>
            <View className="flex gap-4 p-3 bg-white dark:bg-slate-800/30 rounded-lg border border-primary/5">
              <View className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MaterialIcons className="" name={"campaign" as MaterialIconName} />
              </View>
              <View>
                <Text className="text-sm font-semibold">
                  {" Health Insurance Drive Started "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" 5 days ago • Welfare Board "}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
