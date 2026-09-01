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

export default function CommunityHubScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-24">
    <View className="absolute top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
      <View className="flex items-center p-4 justify-between max-w-2xl mx-auto">
        <View className="text-primary flex size-10 shrink-0 items-center justify-center">
          <MaterialIcons className="text-3xl" name={"menu" as MaterialIconName} />
        </View>
        <Text className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          {" Indian Cobbler Community "}
        </Text>
        <View className="flex w-10 items-center justify-end">
          <TouchableOpacity className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"notifications" as MaterialIconName} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 pb-4 z-50">
      <View className="flex justify-between items-center max-w-2xl mx-auto px-4 py-2">
        <TouchableOpacity className="flex flex-col items-center gap-1 text-primary p-2 flex-1" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"home" as MaterialIconName} />
          <Text className="text-[10px] font-bold">
            {"Home"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 p-2 flex-1" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"event" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Events"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 p-2 flex-1" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"forum" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Forum"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 p-2 flex-1" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"group" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Directory"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 p-2 flex-1" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"person" as MaterialIconName} />
          <Text className="text-[10px] font-medium">
            {"Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-2xl mx-auto">
        <View className="flex w-full overflow-x-auto px-4 py-6 no-scrollbar">
          <View className="flex flex-row items-start justify-start gap-6">
            <View className="flex flex-col items-center gap-2 min-w-[72px]">
              <View className="w-16 h-16 bg-primary/20 p-1 rounded-full border-2 border-primary">
                <View className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full" />
              </View>
              <Text className="text-[12px] font-semibold">
                {"Spotlight"}
              </Text>
            </View>
            <View className="flex flex-col items-center gap-2 min-w-[72px]">
              <View className="w-16 h-16 bg-primary/5 p-1 rounded-full border border-primary/20">
                <View className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full" />
              </View>
              <Text className="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                {" Tools "}
              </Text>
            </View>
            <View className="flex flex-col items-center gap-2 min-w-[72px]">
              <View className="w-16 h-16 bg-primary/5 p-1 rounded-full border border-primary/20">
                <View className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full" />
              </View>
              <Text className="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                {" Techniques "}
              </Text>
            </View>
            <View className="flex flex-col items-center gap-2 min-w-[72px]">
              <View className="w-16 h-16 bg-primary/5 p-1 rounded-full border border-primary/20">
                <View className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full" />
              </View>
              <Text className="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                {" Leather "}
              </Text>
            </View>
            <View className="flex flex-col items-center gap-2 min-w-[72px]">
              <View className="w-16 h-16 bg-primary/5 p-1 rounded-full border border-primary/20">
                <View className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full" />
              </View>
              <Text className="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                {" Meetup "}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-4 py-4">
          <View className="flex items-center justify-between mb-4">
            <Text className="text-xl font-bold tracking-tight">
              {"Monthly Publication"}
            </Text>
            <Text className="text-primary text-sm font-semibold">
              {"View Archive"}
            </Text>
          </View>
          <View className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10 flex gap-4">
            <View className="w-24 h-32 flex-shrink-0 bg-white rounded shadow-md overflow-hidden border border-slate-200">
              <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
            </View>
            <View className="flex flex-col justify-center flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                {"Issue #42 • October 2023"}
              </Text>
              <Text className="text-base font-bold mb-2">
                {" The Future of Sustainable Soling "}
              </Text>
              <Text className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {" Featuring interviews with master craftsmen from Kanpur and Kolhapur. "}
              </Text>
              <TouchableOpacity className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 self-start" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"download" as MaterialIconName} />
                <Text>{" Download PDF "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="py-6">
          <View className="px-4 flex items-center justify-between mb-4">
            <Text className="text-xl font-bold tracking-tight">
              {"Upcoming Events"}
            </Text>
            <MaterialIcons className="text-slate-400" name={"calendar_month" as MaterialIconName} />
          </View>
          <View className="flex overflow-x-auto px-4 gap-4 no-scrollbar">
            <View className="flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <View className="h-40 bg-center bg-no-repeat bg-cover relative">
                <View className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 rounded-lg px-2 py-1 text-center min-w-[45px]">
                  <Text className="text-[10px] font-bold uppercase text-primary leading-none">
                    {" Oct "}
                  </Text>
                  <Text className="text-lg font-bold leading-none">
                    {"15"}
                  </Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="font-bold text-base mb-1">
                  {"National Meetup Delhi"}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-3">
                  <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                  <Text>
                    {"Pragati Maidan, New Delhi"}
                  </Text>
                </View>
                <View className="flex flex-wrap gap-2 mb-4">
                  <Text className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <MaterialIcons className="text-[12px]" name={"restaurant" as MaterialIconName} />
                    {" Lunch Included "}
                  </Text>
                  <Text className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <MaterialIcons className="text-[12px]" name={"workspace_premium" as MaterialIconName} />
                    {" Certificate "}
                  </Text>
                </View>
                <TouchableOpacity className="w-full py-2 bg-primary/10 text-primary font-bold rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Register Now "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <View className="h-40 bg-center bg-no-repeat bg-cover relative">
                <View className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 rounded-lg px-2 py-1 text-center min-w-[45px]">
                  <Text className="text-[10px] font-bold uppercase text-primary leading-none">
                    {" Oct "}
                  </Text>
                  <Text className="text-lg font-bold leading-none">
                    {"22"}
                  </Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="font-bold text-base mb-1">
                  {"Workshop Mumbai"}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-3">
                  <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                  <Text>
                    {"Dharavi Design Hub"}
                  </Text>
                </View>
                <View className="flex flex-wrap gap-2 mb-4">
                  <Text className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <MaterialIcons className="text-[12px]" name={"dinner_dining" as MaterialIconName} />
                    {" Dinner Gala "}
                  </Text>
                </View>
                <TouchableOpacity className="w-full py-2 bg-primary/10 text-primary font-bold rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Register Now "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="px-4 py-4">
          <Text className="text-xl font-bold tracking-tight mb-4">
            {"Community News"}
          </Text>
          <View className="space-y-6">
            <View className="flex gap-4">
              <View className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ_-zobhxSf-3C7kXlAixZEfay89qZndbMXjaHIfeGUBnnZyOLQJi_-afIpQrCD7rl3onysp7GcxSNaAE-uSc368EPTVPhq7bk99xUpwjySN8bQNz8bLtuMU3BXE6O8IDZ25Ku-0YinocGHxHYPCGeyLN48xe825OWwv0fOdnPqbpop-IVY3msKnBTX4U6W4cg7ZgnsRztfJYZCga7MolFPh7nC6kvA9XEKz2CTWXt6aTqX13ahxKnhhsEV5QKmsa-EOXyKlv5u7Tg" }} accessibilityLabel="Close up of a luxury leather watch strap" />
              </View>
              <View className="flex-1">
                <View className="flex items-center justify-between mb-1">
                  <Text className="text-[10px] font-bold text-primary uppercase">
                    {"Innovation"}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {"2 hours ago"}
                  </Text>
                </View>
                <Text className="text-sm font-bold leading-snug mb-1">
                  {" New export guidelines for handmade leather accessories announced by Ministry. "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {" The new policy aims to double exports from small-scale artisanal clusters by 2025... "}
                </Text>
              </View>
            </View>
            <View className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <View className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDexiqcJL8WlMg223SsF-3lQB1_BoH9GwWfWhpej3A22OEw1LwEcSapZKB86lBeuxMfhYYQ7PAGOfxS1IkUKB5X1Ebqt9E7vetFmgk1gKAJ_e_mwZudupF1pI1nRIeQpxv0riuk1NdnS_6AzJJ5HuGvV9MxJ66mHt8aXOu5kBLnxg3yZP75-5gKRKIV-AoSsJATvGt-6_ByFqTDfnPdyizJpxxibvPpvidCZ0nA-Po4gmyQxmwtcnSoR3QljBlcAcInQ-6XKi60iuXP" }} accessibilityLabel="Group of workers in a leather factory" />
              </View>
              <View className="flex-1">
                <View className="flex items-center justify-between mb-1">
                  <Text className="text-[10px] font-bold text-primary uppercase">
                    {"Success Story"}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {"Yesterday"}
                  </Text>
                </View>
                <Text className="text-sm font-bold leading-snug mb-1">
                  {" Kolhapur Chappal cooperative expands to international European markets. "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {" A local group of 50 cobblers has successfully fulfilled their first order to Paris... "}
                </Text>
              </View>
            </View>
            <View className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <View className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOZgHsrboLrlHOYEyG8oDRREw2RZd2ZnwLqylLJllEjnSgmkjGHXAVX58shSUHn0D_WtzCEuAeNi3LgLXt8eHNC8F-B7QOCI1Jne0ky6XQsNNDuefO5gS4H5kyRQt1rLiDdhqCX-5zOKWfSYHPo3BZfophCgcMfMmKpHpB5s3X6x1LxSydRCV7Pau0hTo4OdA1XzSpmWKfQzTmrIR1Wx_cQSUjzvOZC3ecX5kUO197uT5fO05fAtEMnmISoKa8sJlO2Hn-Jb50ujwu" }} accessibilityLabel="Old leather ledger and pen" />
              </View>
              <View className="flex-1">
                <View className="flex items-center justify-between mb-1">
                  <Text className="text-[10px] font-bold text-primary uppercase">
                    {"Education"}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {"2 days ago"}
                  </Text>
                </View>
                <Text className="text-sm font-bold leading-snug mb-1">
                  {" Digital Literacy Program for senior cobblers starts next month. "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {" Learn how to manage your business orders using WhatsApp and UPI safely... "}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="w-full mt-8 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-sm" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Load More News "}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
