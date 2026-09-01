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

export default function CreateAdvertisementAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-2xl mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-xl">
        <View className="flex items-center p-4 border-b border-primary/10 bg-white dark:bg-slate-900 absolute top-0 z-10">
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-primary" name={"arrow_back" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-4 text-slate-900 dark:text-slate-100">
            {" Create Advertisement "}
          </Text>
          <View className="ml-auto">
            <MaterialIcons className="text-primary" name={"campaign" as MaterialIconName} />
          </View>
        </View>
        <View className="flex-1 p-4 pb-24">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {" Ad Campaign Details "}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-sm">
              {" Promote your services to the community "}
            </Text>
          </View>
          <View className="space-y-6">
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Ad Title"}</Text>
              </View>
              <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 outline-none" placeholder="e.g. Special Discount on Leather Repairs" />
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Advertisement Type"}</Text>
              </View>
              <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 outline-none appearance-none" />
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Ad Description"}</Text>
              </View>
              <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 outline-none resize-none" placeholder="Describe the offer or information you want to share..." multiline />
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Content Type"}</Text>
              </View>
              <View className="flex gap-3 flex-col md:flex-row md:flex-wrap">
                <View className="flex items-center justify-center gap-2 p-3 border border-primary/20 rounded-xl bg-white dark:bg-slate-800 has-[:checked]:bg-primary/10 has-[:checked]:border-primary w-full md:w-[31%]">
                  <TextInput className="hidden" />
                  <MaterialIcons className="text-sm" name={"article" as MaterialIconName} />
                  <Text className="text-sm font-medium">
                    {"Text"}
                  </Text>
                </View>
                <View className="flex items-center justify-center gap-2 p-3 border border-primary/20 rounded-xl bg-white dark:bg-slate-800 has-[:checked]:bg-primary/10 has-[:checked]:border-primary w-full md:w-[31%]">
                  <TextInput className="hidden" />
                  <MaterialIcons className="text-sm" name={"image" as MaterialIconName} />
                  <Text className="text-sm font-medium">
                    {"Image"}
                  </Text>
                </View>
                <View className="flex items-center justify-center gap-2 p-3 border border-primary/20 rounded-xl bg-white dark:bg-slate-800 has-[:checked]:bg-primary/10 has-[:checked]:border-primary w-full md:w-[31%]">
                  <TextInput className="hidden" />
                  <MaterialIcons className="text-sm" name={"videocam" as MaterialIconName} />
                  <Text className="text-sm font-medium">
                    {"Video"}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Media URL or Upload"}</Text>
              </View>
              <View className="relative">
                <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 pr-12 outline-none" placeholder="https://youtube.com/v/..." />
                <TouchableOpacity className="absolute right-3 top-1/2 -translate-y-1/2 text-primary p-1 rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"upload_file" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
              <View className="flex flex-col gap-2 w-full md:w-[48%]">
                <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Text>{"Start Date"}</Text>
                </View>
                <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 outline-none" multiline />
              </View>
              <View className="flex flex-col gap-2 w-full md:w-[48%]">
                <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Text>{"End Date"}</Text>
                </View>
                <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 outline-none" multiline />
              </View>
            </View>
            <View className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/10 space-y-4">
              <View className="flex flex-col gap-3">
                <View className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <Text>{"Plan Type"}</Text>
                </View>
                <View className="flex gap-6">
                  <View className="flex items-center gap-2">
                    <TextInput className="w-5 h-5 text-primary border-primary/30 bg-white dark:bg-slate-800" placeholder="free" />
                    <Text className="text-slate-700 dark:text-slate-300 font-medium">
                      {"Free Ad"}
                    </Text>
                  </View>
                  <View className="flex items-center gap-2">
                    <TextInput className="w-5 h-5 text-primary border-primary/30 bg-white dark:bg-slate-800" placeholder="chargeable" />
                    <Text className="text-slate-700 dark:text-slate-300 font-medium">
                      {"Chargeable (Premium)"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex flex-col gap-2">
                <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Text>{"Price (INR)"}</Text>
                </View>
                <View className="relative">
                  <Text className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">
                    {"₹"}
                  </Text>
                  <TextInput className="w-full rounded-xl border border-primary/20 bg-white dark:bg-slate-800 p-4 pl-10 outline-none font-bold" placeholder="499" />
                </View>
                <Text className="text-xs text-slate-500">
                  {" Premium ads appear at the top of the feed and community newsletters. "}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"publish" as MaterialIconName} />
              <Text>{" Publish Advertisement "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 max-w-2xl mx-auto flex gap-2 border-t border-primary/10 bg-white dark:bg-slate-900 px-4 pb-6 pt-2">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"home" as MaterialIconName} />
            <Text className="text-[10px] font-medium leading-normal tracking-wide">
              {" Home "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"campaign" as MaterialIconName} />
            <Text className="text-[10px] font-bold leading-normal tracking-wide">
              {"Ads"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"bar_chart" as MaterialIconName} />
            <Text className="text-[10px] font-medium leading-normal tracking-wide">
              {" Reports "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"person" as MaterialIconName} />
            <Text className="text-[10px] font-medium leading-normal tracking-wide">
              {" Profile "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
