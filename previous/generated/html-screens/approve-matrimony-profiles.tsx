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

export default function ApproveMatrimonyProfilesScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
    <View className="absolute top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
      <View className="flex items-center justify-between p-4 max-w-2xl mx-auto">
        <View className="flex items-center gap-3">
          <MaterialIcons className="text-primary" name={"arrow_back" as MaterialIconName} />
          <Text className="text-xl font-bold tracking-tight">
            {"Profile Moderation"}
          </Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-slate-700 dark:text-slate-300" name={"filter_list" as MaterialIconName} />
        </TouchableOpacity>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 pb-4 pt-2 z-50">
      <View className="flex max-w-2xl mx-auto gap-2">
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal tracking-tight">
            {" Dashboard "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"group" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal tracking-tight">
            {" Profiles "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"shield_person" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal tracking-tight">
            {" Moderation "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"settings" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal tracking-tight">
            {" Settings "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-2xl mx-auto pb-24">
        <View className="p-4 flex flex-col gap-4">
          <View className="flex items-center justify-between">
            <Text className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {" Pending Review (12) "}
            </Text>
            <View className="flex gap-2">
              <TouchableOpacity className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Newest "}</Text>
                <MaterialIcons className="text-xs" name={"expand_more" as MaterialIconName} />
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Urgent "}</Text>
                <MaterialIcons className="text-xs text-primary" name={"priority_high" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-6 px-4">
          <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
            <View className="relative">
              <View className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJrEnOvnXHiWthC_ybWGT86lgbRBg2fnynl9YBbvP31vSwkJV8BtLgel842eIJCfmWtS_DYoPJm90hnEXpxSzLHInSO1PVv0BNNygPzDiKhKfPJYCjJsXSqVDWfGJT4Z4zh3vBm6nMJ66cadryaYR0UGmQ80uJHB0Kaji4RcehAm9Bm_88X3UYiGtLYyoRW5TEOKhzX7Kh63hNoI93YJvZAfD9cMgltRUrjKiQQh6Y26X1SZ27lsBhBUKWWS9e_Ce7uQm1I5skj-Zw" }} accessibilityLabel="Profile Photo" />
              </View>
              <View className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                <View className="w-8 h-1 bg-primary rounded-full" />
                <View className="w-2 h-1 bg-white/50 rounded-full" />
                <View className="w-2 h-1 bg-white/50 rounded-full" />
                <View className="w-2 h-1 bg-white/50 rounded-full" />
                <View className="w-2 h-1 bg-white/50 rounded-full" />
              </View>
              <View className="absolute top-4 right-4 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full">
                <Text>{" 1/5 Photos "}</Text>
              </View>
            </View>
            <View className="p-4">
              <View className="flex justify-between items-start mb-2">
                <View>
                  <Text className="text-lg font-bold">
                    {"Rajesh Kumar, 28"}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MaterialIcons className="text-xs" name={"work" as MaterialIconName} />
                    {" Leather Artisan (Footwear Designer) "}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                    {" Kanpur, Uttar Pradesh "}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-full mt-3 py-2 border border-primary/20 text-primary text-sm font-semibold rounded-lg flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" View Full Details "}</Text>
                <MaterialIcons className="text-sm" name={"open_in_new" as MaterialIconName} />
              </TouchableOpacity>
              <View className="flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex-col md:flex-row md:flex-wrap">
                <TouchableOpacity className="flex items-center justify-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 py-3 rounded-lg font-bold w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"close" as MaterialIconName} />
                  <Text>{" Reject "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold shadow-md shadow-green-200 dark:shadow-none w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"check" as MaterialIconName} />
                  <Text>{" Approve "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border-2 border-red-200 dark:border-red-900/50">
            <View className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-red-50/50 dark:bg-red-900/10">
              <View className="flex items-center gap-2">
                <MaterialIcons className="text-red-500" name={"warning" as MaterialIconName} />
                <Text className="text-sm font-bold text-red-700 dark:text-red-400">
                  {"Rejecting: Sunita Chauhan"}
                </Text>
              </View>
              <TouchableOpacity className="text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" close "}</Text>
              </TouchableOpacity>
            </View>
            <View className="p-4">
              <Text className="text-sm font-medium mb-3">
                {"Select Reason for Rejection:"}
              </Text>
              <View className="space-y-2">
                <View className="flex items-center justify-between p-3 border rounded-lg dark:hover:bg-slate-700/50 border-red-100 dark:border-red-900/30">
                  <Text className="text-sm">
                    {"Inappropriate content"}
                  </Text>
                  <TextInput className="text-primary h-4 w-4" />
                </View>
                <View className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg dark:hover:bg-slate-700/50">
                  <Text className="text-sm">
                    {"Blurry/Poor quality photo"}
                  </Text>
                  <TextInput className="text-primary h-4 w-4" />
                </View>
                <View className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg dark:hover:bg-slate-700/50">
                  <Text className="text-sm">
                    {"Incomplete profile details"}
                  </Text>
                  <TextInput className="text-primary h-4 w-4" />
                </View>
                <View className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg dark:hover:bg-slate-700/50">
                  <Text className="text-sm">
                    {"Duplicate profile"}
                  </Text>
                  <TextInput className="text-primary h-4 w-4" />
                </View>
              </View>
              <TouchableOpacity className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-red-200 dark:shadow-none" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Confirm Rejection "}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 opacity-80">
            <View className="relative">
              <View className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7pygBTXktsBzMlNCPzSch1lGp3GMlMZTedCBDBM4hq-7BhiDOLnlBSRqPjI0JPnXHJ15wvd_YIwMwmxuhw3yqU5RUpokWknn0_R4CCkKIJrHkIQPhjsKpANuZZKzQyaCp1FRj1xu1X0lgDBwcoys89XubtYIfJfA0EdJ9tgTWuEA7niRRtScfupfy1kRv1nl0i9RFXEt-g7qHKlbi4cI_r6mGIVDGEpu-IchLH8mFupdO3bd4ao51zGhOizuFjfhCDBUo0xl9M0mh" }} accessibilityLabel="Profile Photo" />
              </View>
            </View>
            <View className="p-4">
              <Text className="text-lg font-bold">
                {"Priya Verma, 25"}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                {" Boutique Owner • Mumbai, MH "}
              </Text>
              <View className="flex gap-3 mt-4 flex-col md:flex-row md:flex-wrap">
                <TouchableOpacity className="bg-red-50 text-red-600 py-3 rounded-lg font-bold text-sm w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Reject "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-green-600 text-white py-3 rounded-lg font-bold text-sm w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Approve "}</Text>
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
