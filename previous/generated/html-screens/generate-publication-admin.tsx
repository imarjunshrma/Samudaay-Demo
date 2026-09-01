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

export default function GeneratePublicationAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
    <View className="absolute bottom-0 left-0 right-0 border-t border-primary/10 bg-white/80 dark:bg-background-dark/80 px-4 pb-4 pt-2 flex justify-around items-center z-50">
      <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
        <Text className="text-[10px] font-bold uppercase tracking-wider">
          {"Dashboard"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"file_open" as MaterialIconName} />
        <Text className="text-[10px] font-bold uppercase tracking-wider">
          {"Generate"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"settings" as MaterialIconName} />
        <Text className="text-[10px] font-bold uppercase tracking-wider">
          {"Settings"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-2xl mx-auto pb-24">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 absolute top-0 z-10 border-b border-primary/10">
          <View className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight flex-1 ml-2">
            {" Generate Monthly Publication "}
          </Text>
        </View>
        <View className="p-4 space-y-8">
          <View>
            <Text className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-4">
              {" Select Publication Month "}
            </Text>
            <View className="flex flex-wrap items-end gap-4">
              <View className="flex flex-col min-w-full sm:min-w-[240px] flex-1">
                <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-2">
                  {" Month and Year "}
                </Text>
                <View className="relative">
                  <TextInput className="appearance-none w-full rounded-lg text-slate-900 dark:text-white border border-primary/20 bg-white dark:bg-background-dark h-14 px-4 text-base font-normal leading-normal" />
                  <MaterialIcons className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary" name={"calendar_month" as MaterialIconName} />
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-4">
              {" Content to Include "}
            </Text>
            <View className="flex gap-3 flex-col">
              <View className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-white dark:bg-white/5">
                <TextInput className="size-5 rounded border-primary/30 text-primary" />
                <Text className="text-slate-800 dark:text-slate-200 font-medium">
                  {"Community News Articles"}
                </Text>
              </View>
              <View className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-white dark:bg-white/5">
                <TextInput className="size-5 rounded border-primary/30 text-primary" />
                <Text className="text-slate-800 dark:text-slate-200 font-medium">
                  {"Active Advertisements"}
                </Text>
              </View>
              <View className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-white dark:bg-white/5">
                <TextInput className="size-5 rounded border-primary/30 text-primary" />
                <Text className="text-slate-800 dark:text-slate-200 font-medium">
                  {"Featured Matrimony Profiles"}
                </Text>
              </View>
              <View className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-white dark:bg-white/5">
                <TextInput className="size-5 rounded border-primary/30 text-primary" />
                <Text className="text-slate-800 dark:text-slate-200 font-medium">
                  {"Recent Event Highlights"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"picture_as_pdf" as MaterialIconName} />
            <Text>{" Generate & Preview PDF "}</Text>
          </TouchableOpacity>
          <View className="pt-4">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                {" Recently Generated PDFs "}
              </Text>
              <TouchableOpacity className="text-primary text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" View All "}</Text>
              </TouchableOpacity>
            </View>
            <View className="space-y-3">
              <View className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-primary/5">
                <View className="flex items-center gap-3">
                  <View className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <MaterialIcons className="" name={"description" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-slate-900 dark:text-white text-sm">
                      {" December 2023 Edition "}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {" Generated on Dec 28, 2023 "}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center gap-4">
                  <Text className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase rounded tracking-wider">
                    {"Ready"}
                  </Text>
                  <TouchableOpacity className="text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"download" as MaterialIconName} />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-primary/5">
                <View className="flex items-center gap-3">
                  <View className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <MaterialIcons className="" name={"description" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-slate-900 dark:text-white text-sm">
                      {" January 2024 Draft "}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {"Started 5 mins ago"}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center gap-4">
                  <Text className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase rounded tracking-wider">
                    {"In Progress"}
                  </Text>
                  <MaterialIcons className="text-slate-300 dark:text-slate-700" name={"download" as MaterialIconName} />
                </View>
              </View>
              <View className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-primary/5">
                <View className="flex items-center gap-3">
                  <View className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <MaterialIcons className="" name={"description" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-slate-900 dark:text-white text-sm">
                      {" November 2023 Final "}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {" Generated on Nov 25, 2023 "}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center gap-4">
                  <Text className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase rounded tracking-wider">
                    {"Ready"}
                  </Text>
                  <TouchableOpacity className="text-primary" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="" name={"download" as MaterialIconName} />
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
