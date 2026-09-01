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

export default function CreateAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-primary/10">
          <View className="text-primary flex size-12 shrink-0 items-center justify-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 px-2">
            {" Add New Admin "}
          </Text>
          <View className="size-12 flex items-center justify-center">
            <MaterialIcons className="text-primary/40" name={"info" as MaterialIconName} />
          </View>
        </View>
        <View className="flex-1 max-w-2xl mx-auto w-full pb-20">
          <View className="mt-4">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold px-4 pb-2">
              {" Step 1: Select Member "}
            </Text>
            <View className="px-4 py-3">
              <View className="flex flex-col w-full">
                <View className="flex w-full items-stretch rounded-lg h-12 bg-primary/5 dark:bg-primary/10 border border-primary/20">
                  <View className="text-primary flex items-center justify-center pl-4">
                    <MaterialIcons className="" name={"search" as MaterialIconName} />
                  </View>
                  <TextInput className="form-input flex w-full border-none bg-transparent text-base font-normal placeholder:text-primary/50" placeholder="Search member by name or ID" />
                </View>
              </View>
            </View>
            <View className="mx-4 flex items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 shadow-sm">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-primary/20" />
              <View className="flex flex-col justify-center flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                  {" Rajesh Kumar "}
                </Text>
                <Text className="text-primary text-sm font-medium">
                  {" Member ID: ICC-54321 "}
                </Text>
              </View>
              <View className="shrink-0">
                <MaterialIcons className="text-green-600" name={"check_circle" as MaterialIconName} />
              </View>
            </View>
          </View>
          <View className="mt-8">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold px-4 pb-2">
              {" Step 2: Assign Role "}
            </Text>
            <View className="px-4 flex gap-3 flex-col">
              <View className="relative flex items-center p-4 rounded-xl border-2 border-primary bg-primary/5">
                <TextInput className="hidden peer" />
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 dark:text-slate-100">
                    {" Super Admin "}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    {" Full access to all modules and system settings "}
                  </Text>
                </View>
                <View className="text-primary">
                  <MaterialIcons className="" name={"radio_button_checked" as MaterialIconName} />
                </View>
              </View>
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800/50">
                <TextInput className="hidden peer" />
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 dark:text-slate-100">
                    {" Event Admin "}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    {" Manage community meetups, workshops, and exhibitions "}
                  </Text>
                </View>
                <View className="text-slate-300">
                  <MaterialIcons className="" name={"radio_button_unchecked" as MaterialIconName} />
                </View>
              </View>
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800/50">
                <TextInput className="hidden peer" />
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 dark:text-slate-100">
                    {" Donation Admin "}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    {" Manage crowdfunding and charity distribution records "}
                  </Text>
                </View>
                <View className="text-slate-300">
                  <MaterialIcons className="" name={"radio_button_unchecked" as MaterialIconName} />
                </View>
              </View>
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800/50">
                <TextInput className="hidden peer" />
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 dark:text-slate-100">
                    {" Matrimony Admin "}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    {" Review profiles and facilitate community matches "}
                  </Text>
                </View>
                <View className="text-slate-300">
                  <MaterialIcons className="" name={"radio_button_unchecked" as MaterialIconName} />
                </View>
              </View>
            </View>
          </View>
          <View className="mt-8">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold px-4 pb-2">
              {" Step 3: Specific Permissions "}
            </Text>
            <View className="px-4 space-y-4">
              <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10">
                <View>
                  <Text className="font-medium text-slate-900 dark:text-slate-100">
                    {" Allow Member Management "}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Can approve or ban community members "}
                  </Text>
                </View>
                <View className="relative flex h-[31px] w-[51px] items-center rounded-full bg-primary/20 p-0.5 has-[:checked]:bg-primary">
                  <TextInput className="invisible absolute peer" />
                  <View className="h-full w-[27px] rounded-full bg-white peer-checked:translate-x-[20px]" />
                </View>
              </View>
              <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10">
                <View>
                  <Text className="font-medium text-slate-900 dark:text-slate-100">
                    {" Content Moderation "}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Can delete posts and comments "}
                  </Text>
                </View>
                <View className="relative flex h-[31px] w-[51px] items-center rounded-full bg-primary/20 p-0.5 has-[:checked]:bg-primary">
                  <TextInput className="invisible absolute peer" />
                  <View className="h-full w-[27px] rounded-full bg-white peer-checked:translate-x-[20px]" />
                </View>
              </View>
              <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/10">
                <View>
                  <Text className="font-medium text-slate-900 dark:text-slate-100">
                    {" Financial Reporting "}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Can view and export donation reports "}
                  </Text>
                </View>
                <View className="relative flex h-[31px] w-[51px] items-center rounded-full bg-primary/20 p-0.5 has-[:checked]:bg-primary">
                  <TextInput className="invisible absolute peer" />
                  <View className="h-full w-[27px] rounded-full bg-white peer-checked:translate-x-[0px]" />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-primary/10 flex gap-4 max-w-2xl mx-auto w-full">
          <TouchableOpacity className="flex-1 h-12 rounded-lg border border-primary/20 text-slate-600 dark:text-slate-300 font-bold text-base" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Cancel "}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-[2] h-12 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Create Admin "}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
