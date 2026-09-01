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

export default function DonationManagementScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
    <View className="flex items-center bg-background-light dark:bg-background-dark p-4 absolute top-0 z-10 border-b border-primary/10">
      <TouchableOpacity className="text-slate-900 dark:text-slate-100 p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
      </TouchableOpacity>
      <Text className="text-xl font-bold ml-2">
        {"Donations"}
      </Text>
    </View>
    <View className="absolute bottom-0 left-0 right-0 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-3 pt-2">
      <View className="flex gap-2 max-w-2xl mx-auto">
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
          <View className="flex h-8 items-center justify-center">
            <MaterialIcons className="" name={"home" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-medium leading-normal">
            {"Home"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
          <View className="flex h-8 items-center justify-center">
            <MaterialIcons className="" name={"groups" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-medium leading-normal">
            {"Family"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-primary" accessibilityRole="button" activeOpacity={0.85}>
          <View className="flex h-8 items-center justify-center">
            <MaterialIcons className="text-primary" name={"volunteer_activism" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-medium leading-normal">
            {"Donations"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
          <View className="flex h-8 items-center justify-center">
            <MaterialIcons className="" name={"work" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-medium leading-normal">
            {"Jobs"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
          <View className="flex h-8 items-center justify-center">
            <MaterialIcons className="" name={"person" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-medium leading-normal">
            {"Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="flex-grow overflow-y-auto">
        <View className="p-4 @container">
          <View className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-sm border border-primary/10 bg-white dark:bg-slate-800/50 overflow-hidden">
            <View className="w-full bg-center bg-no-repeat aspect-[21/9] bg-cover" />
            <View className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-5">
              <Text className="text-primary text-sm font-semibold uppercase tracking-wider">
                {" Your Impact "}
              </Text>
              <Text className="text-3xl font-bold leading-tight tracking-tight">
                {" ₹45,000 "}
              </Text>
              <View className="flex items-end gap-3 justify-between">
                <Text className="text-slate-500 dark:text-slate-400 text-base font-normal">
                  {" Total Community Contributions "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="px-4 py-2">
          <View className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-between">
            <View className="flex items-center gap-3">
              <View className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <MaterialIcons className="" name={"post_add" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-800 dark:text-slate-100">
                  {" Record Offline Donation "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Log manual cash or check contributions "}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-white dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold py-2 px-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-sm" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Add Record "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 py-6">
          <Text className="text-[22px] font-bold leading-tight tracking-tight mb-4">
            {" Make a New Donation "}
          </Text>
          <View className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-primary/10 shadow-sm space-y-6">
            <View className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              <View className="flex flex-1 items-center justify-center rounded-md py-2 text-sm font-medium has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:text-primary has-[:checked]:shadow-sm text-slate-500">
                <Text>
                  {"Self"}
                </Text>
                <TextInput className="hidden" />
              </View>
              <View className="flex flex-1 items-center justify-center rounded-md py-2 text-sm font-medium has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:text-primary has-[:checked]:shadow-sm text-slate-500">
                <Text>
                  {"On behalf of others"}
                </Text>
                <TextInput className="hidden" />
              </View>
            </View>
            <View className="space-y-4">
              <View className="flex md:grid-cols-2 gap-4 flex-col">
                <View className="space-y-1">
                  <View className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Text>{"Donor Name"}</Text>
                  </View>
                  <TextInput className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-slate-900" placeholder="Enter name" />
                </View>
                <View className="space-y-1">
                  <View className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Text>{"Relation"}</Text>
                  </View>
                  <TextInput className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-slate-900" placeholder="e.g. Spouse, Parent" />
                </View>
              </View>
              <View className="space-y-2">
                <View className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Text>{"Select Amount"}</Text>
                </View>
                <View className="flex gap-3 flex-col md:flex-row md:flex-wrap">
                  <TouchableOpacity className="py-2 px-4 rounded-lg border border-primary/30 bg-primary/5 text-primary font-bold w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" ₹500 "}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2 px-4 rounded-lg border border-primary/30 bg-primary/5 text-primary font-bold w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" ₹1000 "}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2 px-4 rounded-lg border border-primary/30 bg-primary/5 text-primary font-bold w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" ₹2000 "}</Text>
                  </TouchableOpacity>
                </View>
                <View className="relative mt-2">
                  <Text className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {"₹"}
                  </Text>
                  <TextInput className="w-full pl-8 rounded-lg border-primary/20 bg-background-light dark:bg-slate-900" placeholder="Enter custom amount" />
                </View>
              </View>
              <View className="space-y-1">
                <View className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Text>{"Message (Optional)"}</Text>
                </View>
                <TextInput className="w-full rounded-lg border-primary/20 bg-background-light dark:bg-slate-900" placeholder="Leave a message for the community..." multiline />
              </View>
              <TouchableOpacity className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 mt-4" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
                <Text>{" Donate Now "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="px-4 py-2">
          <View className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-between">
            <View className="flex items-center gap-3">
              <View className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <MaterialIcons className="" name={"post_add" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-800 dark:text-slate-100">
                  {" Record Offline Donation "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Log manual cash or check contributions "}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-white dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold py-2 px-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-sm" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Add Record "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 py-6 mb-20">
          <View className="flex items-center justify-between mb-4">
            <Text className="text-xl font-bold">
              {"Recent Donations"}
            </Text>
            <TouchableOpacity className="text-primary text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"View All"}</Text>
            </TouchableOpacity>
          </View>
          <View className="space-y-3">
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MaterialIcons className="" name={"history_edu" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-bold">
                    {"₹5,000"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Oct 12, 2023 • Self"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="p-2 text-primary rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"picture_as_pdf" as MaterialIconName} />
              </TouchableOpacity>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MaterialIcons className="" name={"history_edu" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-bold">
                    {"₹10,000"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Sep 28, 2023 • Ramesh Kumar (Father) "}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="p-2 text-primary rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"picture_as_pdf" as MaterialIconName} />
              </TouchableOpacity>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MaterialIcons className="" name={"history_edu" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-bold">
                    {"₹2,500"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Aug 15, 2023 • Self"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="p-2 text-primary rounded-full" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"picture_as_pdf" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
