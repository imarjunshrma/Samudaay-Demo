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

export default function RecordManualDonationScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-2xl mx-auto min-h-screen flex flex-col bg-white dark:bg-stone-900 shadow-xl">
        <View className="flex items-center p-4 border-b border-stone-200 dark:border-stone-800 absolute top-0 bg-white/80 dark:bg-stone-900/80 z-10">
          <TouchableOpacity className="p-2 dark:hover:bg-stone-800 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-stone-600 dark:text-stone-400" name={"arrow_back" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-2 flex-1">
            {"Manual Donation Entry"}
          </Text>
          <TouchableOpacity className="p-2 dark:hover:bg-stone-800 rounded-full text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"help_outline" as MaterialIconName} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          <View className="space-y-4">
            <View className="flex items-center gap-2">
              <MaterialIcons className="text-primary" name={"person" as MaterialIconName} />
              <Text className="text-lg font-semibold">
                {"Donor Information"}
              </Text>
            </View>
            <View className="space-y-3">
              <View className="block">
                <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1 block">
                  {"Search Registered Member"}
                </Text>
                <View className="relative">
                  <MaterialIcons className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary" name={"search" as MaterialIconName} />
                  <TextInput className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-stone-800 border-transparent rounded-lg dark:focus:bg-stone-700 text-sm outline-none" placeholder="Search by name or member ID" />
                </View>
              </View>
              <View className="flex items-center py-2">
                <View className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                <Text className="px-3 text-xs font-bold text-stone-400 uppercase tracking-widest">
                  {"OR"}
                </Text>
                <View className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
              </View>
              <View className="block">
                <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1 block">
                  {"Manual Donor Name (Unregistered)"}
                </Text>
                <TextInput className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm outline-none" placeholder="Enter full name" />
              </View>
            </View>
          </View>
          <View className="space-y-4">
            <View className="flex items-center gap-2">
              <MaterialIcons className="text-primary" name={"payments" as MaterialIconName} />
              <Text className="text-lg font-semibold">
                {"Transaction Details"}
              </Text>
            </View>
            <View className="flex md:grid-cols-2 gap-4 flex-col">
              <View className="block">
                <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1 block">
                  {"Amount (₹)"}
                </Text>
                <TextInput className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm outline-none font-mono" placeholder="0.00" />
              </View>
              <View className="block">
                <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1 block">
                  {"Date of Donation"}
                </Text>
                <TextInput className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm outline-none" multiline />
              </View>
            </View>
            <View className="space-y-3">
              <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 block">
                {"Payment Mode"}
              </Text>
              <View className="flex gap-2 flex-col md:flex-row md:flex-wrap">
                <TouchableOpacity className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-primary bg-primary/10 text-primary w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"payments" as MaterialIconName} />
                  <Text className="text-xs font-semibold mt-1">
                    {"Cash"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-stone-200 dark:border-stone-800 w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"account_balance" as MaterialIconName} />
                  <Text className="text-xs font-semibold mt-1 text-stone-600 dark:text-stone-400">
                    {"Transfer"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-stone-200 dark:border-stone-800 w-full md:w-[31%]" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"style" as MaterialIconName} />
                  <Text className="text-xs font-semibold mt-1 text-stone-600 dark:text-stone-400">
                    {"Cheque"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="block">
              <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1 block">
                {"Reference/Transaction Number"}
              </Text>
              <TextInput className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm outline-none" placeholder="e.g. UPI ID or Cheque No." />
            </View>
          </View>
          <View className="space-y-4">
            <View className="flex items-center gap-2">
              <MaterialIcons className="text-primary" name={"cloud_upload" as MaterialIconName} />
              <Text className="text-lg font-semibold">
                {"Verification Proof"}
              </Text>
            </View>
            <View className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-8 flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-800/50 dark:hover:bg-stone-800">
              <View className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MaterialIcons className="text-primary text-3xl" name={"add_a_photo" as MaterialIconName} />
              </View>
              <Text className="text-sm font-semibold">
                {"Upload Transaction Screenshot"}
              </Text>
              <Text className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                {" PNG, JPG or PDF up to 5MB "}
              </Text>
              <TextInput className="hidden" />
            </View>
          </View>
        </View>
        <View className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 absolute bottom-16">
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"save" as MaterialIconName} />
            <Text>{" Save Donation Record "}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex gap-2 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pb-3 pt-2 absolute bottom-0">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-stone-400 dark:text-stone-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"home" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Home"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Donations"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-stone-400 dark:text-stone-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Members"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-stone-400 dark:text-stone-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"settings" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
