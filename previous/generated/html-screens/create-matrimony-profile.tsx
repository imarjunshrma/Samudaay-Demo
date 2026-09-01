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

export default function CreateMatrimonyProfileScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
    <View className="absolute top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
      <View className="flex items-center p-4 gap-4">
        <TouchableOpacity className="flex items-center justify-center size-10 rounded-full text-slate-900 dark:text-slate-100" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
        </TouchableOpacity>
        <Text className="text-lg font-bold leading-tight tracking-tight">
          {" Create Matrimony Profile "}
        </Text>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 border-t border-primary/10 max-w-md mx-auto">
      <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
        <Text>
          {"Create Profile"}
        </Text>
        <MaterialIcons className="" name={"chevron_right" as MaterialIconName} />
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-md mx-auto pb-24">
        <View className="p-4">
          <Text className="text-base font-bold mb-3">
            {"Upload Photos (Max 5)"}
          </Text>
          <View className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <View className="relative flex-shrink-0">
              <View className="size-24 rounded-xl bg-center bg-cover border border-primary/20" />
              <TouchableOpacity className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center border-2 border-background-light" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-xs" name={"close" as MaterialIconName} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="flex-shrink-0 size-24 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-3xl" name={"add_a_photo" as MaterialIconName} />
            </TouchableOpacity>
            <View className="flex-shrink-0 size-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <MaterialIcons className="" name={"add" as MaterialIconName} />
            </View>
            <View className="flex-shrink-0 size-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <MaterialIcons className="" name={"add" as MaterialIconName} />
            </View>
            <View className="flex-shrink-0 size-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <MaterialIcons className="" name={"add" as MaterialIconName} />
            </View>
          </View>
        </View>
        <View className="p-4 space-y-4">
          <Text className="text-base font-bold text-primary">
            {"Personal Details"}
          </Text>
          <View className="space-y-4">
            <View className="block">
              <Text className="text-sm font-medium mb-1 block">
                {"Full Name"}
              </Text>
              <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" placeholder="e.g. Rahul Sharma" />
            </View>
            <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
              <View className="block w-full md:w-[48%]">
                <Text className="text-sm font-medium mb-1 block">
                  {"Date of Birth"}
                </Text>
                <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" multiline />
              </View>
              <View className="block w-full md:w-[48%]">
                <Text className="text-sm font-medium mb-1 block">
                  {"Gender"}
                </Text>
                <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" />
              </View>
            </View>
            <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
              <View className="block w-full md:w-[48%]">
                <Text className="text-sm font-medium mb-1 block">
                  {"Height"}
                </Text>
                <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" placeholder="5' 7\\" />
              </View>
              <View className="block w-full md:w-[48%]">
                <Text className="text-sm font-medium mb-1 block">
                  {"Religion / Caste"}
                </Text>
                <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-slate-100 dark:bg-slate-800" placeholder="Hindu / Cobbler Community" />
              </View>
            </View>
          </View>
        </View>
        <View className="p-4 space-y-4">
          <Text className="text-base font-bold text-primary">
            {" Professional & Educational "}
          </Text>
          <View className="space-y-4">
            <View className="block">
              <Text className="text-sm font-medium mb-1 block">
                {"Highest Education"}
              </Text>
              <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" />
            </View>
            <View className="block">
              <Text className="text-sm font-medium mb-1 block">
                {"Occupation / Profession"}
              </Text>
              <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" placeholder="e.g. Software Engineer" />
            </View>
            <View className="block">
              <Text className="text-sm font-medium mb-1 block">
                {"Annual Income (Optional)"}
              </Text>
              <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" placeholder="e.g. ₹ 8,00,000" />
            </View>
          </View>
        </View>
        <View className="p-4 space-y-4">
          <Text className="text-base font-bold text-primary">
            {"Location"}
          </Text>
          <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
            <View className="block w-full md:w-[48%]">
              <Text className="text-sm font-medium mb-1 block">
                {"Current City"}
              </Text>
              <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" placeholder="e.g. Mumbai" />
            </View>
            <View className="block w-full md:w-[48%]">
              <Text className="text-sm font-medium mb-1 block">
                {"State"}
              </Text>
              <TextInput className="w-full h-12 px-4 rounded-lg border-primary/20 bg-white dark:bg-slate-900" placeholder="e.g. Maharashtra" />
            </View>
          </View>
        </View>
        <View className="p-4 space-y-4">
          <Text className="text-base font-bold text-primary">
            {"About Me / Bio"}
          </Text>
          <View className="block">
            <TextInput className="w-full p-4 rounded-xl border-primary/20 bg-white dark:bg-slate-900 resize-none" placeholder="Tell us about yourself, your hobbies, and what you're looking for..." multiline />
          </View>
        </View>
        <View className="p-4">
          <View className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-semibold">
                {"Contact Privacy"}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {" Hide contact details until approval "}
              </Text>
            </View>
            <View className="relative inline-flex items-center">
              <TextInput className="sr-only peer" />
              <View className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
