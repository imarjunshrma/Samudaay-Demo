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

export default function FamilyManagementScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between absolute top-0 z-10 border-b border-primary/10">
          <View className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            {" Family Management "}
          </Text>
          <View className="flex w-10 items-center justify-end">
            <TouchableOpacity className="flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"group" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 overflow-y-auto pb-24">
          <View className="p-4">
            <View className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <View className="flex items-center justify-between">
                <View>
                  <Text className="text-sm text-primary font-medium">
                    {"Total Members"}
                  </Text>
                  <Text className="text-2xl font-bold">
                    {"04"}
                  </Text>
                </View>
                <TouchableOpacity className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-sm" name={"add" as MaterialIconName} />
                  <Text>{" Add Member "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold px-4 pt-4 pb-2">
            {" Your Family "}
          </Text>
          <View className="space-y-4 p-4">
            <View className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <View className="flex justify-between items-start">
                <View className="flex gap-3">
                  <View className="size-14 rounded-lg bg-cover bg-center" />
                  <View>
                    <Text className="font-bold text-base">
                      {"Rajesh Kumar"}
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400">
                      {" Self • 42 Years "}
                    </Text>
                    <Text className="text-xs font-medium text-primary mt-1">
                      {" Occupation: Master Cobbler "}
                    </Text>
                  </View>
                </View>
                <Text className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase">
                  {"Primary"}
                </Text>
              </View>
              <View className="flex border-t border-slate-100 dark:border-slate-700 pt-3 gap-2">
                <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{" Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-red-500" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{" Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <View className="flex justify-between items-start">
                <View className="flex gap-3">
                  <View className="size-14 rounded-lg bg-cover bg-center" />
                  <View>
                    <Text className="font-bold text-base">
                      {"Sunita Devi"}
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400">
                      {" Spouse • 38 Years "}
                    </Text>
                    <Text className="text-xs font-medium text-primary mt-1">
                      {" Education: 10th Pass "}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex border-t border-slate-100 dark:border-slate-700 pt-3 gap-2">
                <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{" Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-red-500" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{" Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <View className="flex justify-between items-start">
                <View className="flex gap-3">
                  <View className="size-14 rounded-lg bg-cover bg-center" />
                  <View>
                    <Text className="font-bold text-base">
                      {"Anjali Kumar"}
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400">
                      {" Daughter • 14 Years "}
                    </Text>
                    <View className="mt-1 space-y-0.5">
                      <Text className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        {" Schooling "}
                      </Text>
                      <Text className="text-xs font-medium text-primary">
                        {" Class 9 • Govt. Girls School "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="flex border-t border-slate-100 dark:border-slate-700 pt-3 gap-2">
                <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{" Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-red-500" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{" Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="mx-4 my-6 p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-primary/30">
            <View className="flex items-center gap-3 mb-6">
              <View className="bg-primary text-white p-2 rounded-lg">
                <MaterialIcons className="" name={"person_add" as MaterialIconName} />
              </View>
              <Text className="text-lg font-bold">
                {"Add Family Member"}
              </Text>
            </View>
            <View className="space-y-4">
              <View className="flex gap-4 flex-col">
                <View>
                  <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    <Text>{"Full Name"}</Text>
                  </View>
                  <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" placeholder="e.g. Rahul Kumar" />
                </View>
                <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
                  <View className="w-full md:w-[48%]">
                    <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      <Text>{"Relation"}</Text>
                    </View>
                    <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                  </View>
                  <View className="w-full md:w-[48%]">
                    <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      <Text>{"Gender"}</Text>
                    </View>
                    <View className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                      <TouchableOpacity className="flex-1 py-1.5 text-xs font-bold rounded-md bg-primary text-white" accessibilityRole="button" activeOpacity={0.85}>
                        <Text>{" Male "}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 py-1.5 text-xs font-bold rounded-md text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
                        <Text>{" Female "}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
                  <View className="w-full md:w-[48%]">
                    <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      <Text>{"Date of Birth"}</Text>
                    </View>
                    <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" multiline />
                  </View>
                  <View className="w-full md:w-[48%]">
                    <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      <Text>{"Education"}</Text>
                    </View>
                    <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" placeholder="e.g. 8th Standard" />
                  </View>
                </View>
                <View className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-4">
                  <Text className="text-[10px] font-bold text-primary uppercase">
                    {" Education Details (For Children) "}
                  </Text>
                  <View>
                    <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      <Text>{"School Name"}</Text>
                    </View>
                    <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" placeholder="e.g. Modern High School" />
                  </View>
                  <View>
                    <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      <Text>{"Current Class"}</Text>
                    </View>
                    <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" placeholder="e.g. 5th Grade" />
                  </View>
                </View>
                <View>
                  <View className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    <Text>{"Occupation"}</Text>
                  </View>
                  <TextInput className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" placeholder="e.g. Student / Unemployed" />
                </View>
              </View>
              <View className="flex gap-3 pt-2">
                <TouchableOpacity className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Cancel "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-[2_2_0%] py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Save Member "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 max-w-md mx-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
          <View className="flex justify-between items-center">
            <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"home" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-widest">
                {"Home"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"group" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-widest">
                {"Family"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"work" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-widest">
                {"Jobs"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"person" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-widest">
                {"Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
