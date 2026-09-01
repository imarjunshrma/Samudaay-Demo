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

export default function RoleManagementAndPermissionsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen flex-col overflow-x-hidden">
        <View className="absolute top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 p-4 border-b border-primary/10 justify-between">
          <View className="flex items-center gap-4">
            <View className="text-primary flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
            </View>
            <View>
              <Text className="text-xl font-bold leading-tight tracking-tight">
                {" Role Management "}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {" Configure community access levels "}
              </Text>
            </View>
          </View>
          <View className="flex gap-2">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"search" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"filter_list" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 pb-24">
          <View className="px-4 py-6">
            <View className="flex items-center justify-between mb-6">
              <Text className="text-lg font-bold">
                {"Existing Roles"}
              </Text>
              <Text className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                {"6 Roles Active"}
              </Text>
            </View>
            <View className="space-y-4">
              <View className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5">
                <View className="p-4 border-b border-primary/5 flex justify-between items-start">
                  <View className="flex gap-4 items-center">
                    <View className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white">
                      <MaterialIcons className="text-2xl" name={"admin_panel_settings" as MaterialIconName} />
                    </View>
                    <View>
                      <Text className="font-bold text-lg">
                        {"Super Admin"}
                      </Text>
                      <Text className="text-sm text-slate-500">
                        {" Ultimate access to all modules "}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="text-sm" name={"edit" as MaterialIconName} />
                    <Text>{" Edit "}</Text>
                  </TouchableOpacity>
                </View>
                <View className="p-4 bg-primary/5">
                  <Text className="text-xs font-bold text-primary uppercase mb-3">
                    {" Permissions Summary "}
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    <Text className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10">
                      {"Manage Members"}
                    </Text>
                    <Text className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10">
                      {"Financial Approvals"}
                    </Text>
                    <Text className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10">
                      {"System Settings"}
                    </Text>
                    <Text className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10">
                      {"Content Moderation"}
                    </Text>
                    <Text className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs border border-primary/10">
                      {"+8 more"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5">
                <View className="p-4 border-b border-primary/5 flex justify-between items-start">
                  <View className="flex gap-4 items-center">
                    <View className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <MaterialIcons className="text-2xl" name={"event_available" as MaterialIconName} />
                    </View>
                    <View>
                      <Text className="font-bold text-lg">
                        {"Event Admin"}
                      </Text>
                      <Text className="text-sm text-slate-500">
                        {" Organizes community gatherings "}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="text-sm" name={"edit" as MaterialIconName} />
                    <Text>{" Edit "}</Text>
                  </TouchableOpacity>
                </View>
                <View className="p-4">
                  <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
                    {" Permissions Summary "}
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"Create Events"}
                    </Text>
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"RSVP Management"}
                    </Text>
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"Vendor Contacts"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5">
                <View className="p-4 border-b border-primary/5 flex justify-between items-start">
                  <View className="flex gap-4 items-center">
                    <View className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <MaterialIcons className="text-2xl" name={"volunteer_activism" as MaterialIconName} />
                    </View>
                    <View>
                      <Text className="font-bold text-lg">
                        {"Donation Admin"}
                      </Text>
                      <Text className="text-sm text-slate-500">
                        {" Manages fund collection & relief "}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="text-sm" name={"edit" as MaterialIconName} />
                    <Text>{" Edit "}</Text>
                  </TouchableOpacity>
                </View>
                <View className="p-4">
                  <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
                    {" Permissions Summary "}
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"Approve Donations"}
                    </Text>
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"Financial Auditing"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm border border-primary/5">
                <View className="p-4 border-b border-primary/5 flex justify-between items-start">
                  <View className="flex gap-4 items-center">
                    <View className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <MaterialIcons className="text-2xl" name={"favorite" as MaterialIconName} />
                    </View>
                    <View>
                      <Text className="font-bold text-lg">
                        {"Matrimony Admin"}
                      </Text>
                      <Text className="text-sm text-slate-500">
                        {" Profile verification & matching "}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                    <MaterialIcons className="text-sm" name={"edit" as MaterialIconName} />
                    <Text>{" Edit "}</Text>
                  </TouchableOpacity>
                </View>
                <View className="p-4">
                  <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
                    {" Permissions Summary "}
                  </Text>
                  <View className="flex flex-wrap gap-2">
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"Profile Verification"}
                    </Text>
                    <Text className="px-2 py-1 bg-background-light dark:bg-slate-700 rounded text-xs border border-primary/5">
                      {"Private Messaging"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="mt-8">
              <Text className="text-lg font-bold mb-4">
                {"Quick Permission Reference"}
              </Text>
              <View className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-primary/10">
                <View className="space-y-4">
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-3">
                      <MaterialIcons className="text-primary" name={"group" as MaterialIconName} />
                      <Text className="text-sm">
                        {"Manage Members"}
                      </Text>
                    </View>
                    <View className="flex h-5 w-9 items-center rounded-full bg-primary p-1">
                      <View className="h-3 w-3 translate-x-4 rounded-full bg-white" />
                    </View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-3">
                      <MaterialIcons className="text-primary" name={"campaign" as MaterialIconName} />
                      <Text className="text-sm">
                        {"Create Events"}
                      </Text>
                    </View>
                    <View className="flex h-5 w-9 items-center rounded-full bg-primary p-1">
                      <View className="h-3 w-3 translate-x-4 rounded-full bg-white" />
                    </View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-3">
                      <MaterialIcons className="text-primary" name={"payments" as MaterialIconName} />
                      <Text className="text-sm">
                        {"Approve Donations"}
                      </Text>
                    </View>
                    <View className="flex h-5 w-9 items-center rounded-full bg-slate-300 dark:bg-slate-600 p-1">
                      <View className="h-3 w-3 rounded-full bg-white" />
                    </View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-3">
                      <MaterialIcons className="text-primary" name={"gavel" as MaterialIconName} />
                      <Text className="text-sm">
                        {"Content Moderation"}
                      </Text>
                    </View>
                    <View className="flex h-5 w-9 items-center rounded-full bg-slate-300 dark:bg-slate-600 p-1">
                      <View className="h-3 w-3 rounded-full bg-white" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity className="absolute bottom-24 right-6 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 z-20" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
        </TouchableOpacity>
        <View className="absolute bottom-0 left-0 right-0 z-30 border-t border-primary/10 bg-white/95 dark:bg-background-dark/95 px-4 pb-4 pt-2">
          <View className="mx-auto flex max-w-md gap-2">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"home" as MaterialIconName} />
              <Text className="text-[10px] font-medium leading-none">
                {"Home"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"manage_accounts" as MaterialIconName} />
              <Text className="text-[10px] font-medium leading-none">
                {"Roles"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"group" as MaterialIconName} />
              <Text className="text-[10px] font-medium leading-none">
                {"Users"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"settings" as MaterialIconName} />
              <Text className="text-[10px] font-medium leading-none">
                {"Settings"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
