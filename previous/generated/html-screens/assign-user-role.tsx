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

export default function AssignUserRoleScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-primary/10">
          <View className="text-primary flex size-12 shrink-0 items-center justify-start">
            <MaterialIcons className="text-[28px]" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {" Assign Role "}
          </Text>
        </View>
        <View className="flex p-6 @container">
          <View className="flex w-full flex-col gap-6 items-center bg-white dark:bg-background-dark/50 rounded-xl p-6 shadow-sm border border-primary/5">
            <View className="flex gap-4 flex-col items-center">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full ring-4 ring-primary/10 min-h-32 w-32" />
              <View className="flex flex-col items-center justify-center">
                <Text className="text-slate-900 dark:text-slate-100 text-[24px] font-bold leading-tight tracking-[-0.015em] text-center">
                  {" Rajesh Kumar "}
                </Text>
                <Text className="text-primary font-semibold text-sm mt-1">
                  {" ID: IC-2024-0891 "}
                </Text>
                <View className="mt-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Text className="text-primary text-xs font-bold uppercase tracking-wider">
                    {" Current Role: Member "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="px-4 py-2">
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
            {" Select New Role "}
          </Text>
          <View className="flex flex-col gap-4">
            <View className="flex items-center gap-4 rounded-xl border-2 border-primary/20 bg-white dark:bg-background-dark/40 p-5">
              <View className="flex items-center justify-center">
                <TextInput className="h-6 w-6 border-2 border-primary/30 bg-transparent text-primary checked:bg-primary" placeholder="trustee" />
              </View>
              <View className="flex grow flex-col">
                <View className="flex items-center gap-2 mb-1">
                  <MaterialIcons className="text-primary text-xl" name={"verified_user" as MaterialIconName} />
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                    {" Trustee "}
                  </Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {" Full administrative access. Can manage community funds, approve new members, and organize regional events. "}
                </Text>
              </View>
            </View>
            <View className="flex items-center gap-4 rounded-xl border-2 border-primary/20 bg-white dark:bg-background-dark/40 p-5">
              <View className="flex items-center justify-center">
                <TextInput className="h-6 w-6 border-2 border-primary/30 bg-transparent text-primary checked:bg-primary" placeholder="member" />
              </View>
              <View className="flex grow flex-col">
                <View className="flex items-center gap-2 mb-1">
                  <MaterialIcons className="text-primary text-xl" name={"person" as MaterialIconName} />
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                    {" Member "}
                  </Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {" Standard access to community forums, basic training resources, job listings, and member benefit programs. "}
                </Text>
              </View>
            </View>
            <View className="flex items-center gap-4 rounded-xl border-2 border-primary/20 bg-white dark:bg-background-dark/40 p-5">
              <View className="flex items-center justify-center">
                <TextInput className="h-6 w-6 border-2 border-primary/30 bg-transparent text-primary checked:bg-primary" placeholder="support" />
              </View>
              <View className="flex grow flex-col">
                <View className="flex items-center gap-2 mb-1">
                  <MaterialIcons className="text-primary text-xl" name={"help_center" as MaterialIconName} />
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                    {" Community Support "}
                  </Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {" Can assist members with technical issues and moderate community discussions without financial access. "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="mt-auto px-4 py-8">
          <TouchableOpacity className="flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="truncate">
              {"Save Changes"}
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-slate-500 dark:text-slate-500 text-xs mt-4">
            {" The user will be notified of their new role via SMS and App Notification. "}
          </Text>
        </View>
        <View className="h-5 bg-background-light dark:bg-background-dark" />
      </View>
      </ScrollView>
    </View>
  );
}
