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

export default function CreateNewExpenseAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl">
        <View className="absolute top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 border-b border-primary/10">
          <TouchableOpacity className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="ml-2 text-lg font-bold leading-tight tracking-tight flex-1">
            {" Create New Expense "}
          </Text>
        </View>
        <View className="flex-1 overflow-y-auto pb-24">
          <View className="flex flex-col gap-5 p-4">
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Expense Amount"}</Text>
              </View>
              <View className="flex w-full items-stretch">
                <View className="flex items-center justify-center px-4 bg-primary/10 border border-primary/20 border-r-0 rounded-l-lg text-primary font-bold">
                  <Text>{" ₹ "}</Text>
                </View>
                <TextInput className="flex-1 border border-primary/20 bg-white dark:bg-slate-800 rounded-r-lg px-4 py-3 outline-none text-lg font-medium" placeholder="0.00" />
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Vendor / Payee Name"}</Text>
              </View>
              <TextInput className="w-full border border-primary/20 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 outline-none" placeholder="e.g. Ramesh Catering Services" />
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Date of Expense"}</Text>
              </View>
              <View className="relative">
                <TextInput className="w-full border border-primary/20 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 outline-none appearance-none" multiline />
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Expense Category"}</Text>
              </View>
              <View className="relative">
                <TextInput className="w-full border border-primary/20 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 outline-none appearance-none" />
                <MaterialIcons className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" name={"expand_more" as MaterialIconName} />
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Link to Event"}</Text>
              </View>
              <View className="relative">
                <TextInput className="w-full border border-primary/20 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 outline-none appearance-none" />
                <MaterialIcons className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" name={"event" as MaterialIconName} />
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Payment Mode"}</Text>
              </View>
              <View className="flex gap-2">
                <View className="flex-1">
                  <TextInput className="hidden peer" />
                  <View className="flex flex-col items-center justify-center p-3 border border-primary/20 rounded-lg bg-white dark:bg-slate-800 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary">
                    <MaterialIcons className="mb-1" name={"payments" as MaterialIconName} />
                    <Text className="text-xs font-medium">
                      {"Cash"}
                    </Text>
                  </View>
                </View>
                <View className="flex-1">
                  <TextInput className="hidden peer" />
                  <View className="flex flex-col items-center justify-center p-3 border border-primary/20 rounded-lg bg-white dark:bg-slate-800 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary">
                    <MaterialIcons className="mb-1" name={"account_balance" as MaterialIconName} />
                    <Text className="text-xs font-medium">
                      {"Bank"}
                    </Text>
                  </View>
                </View>
                <View className="flex-1">
                  <TextInput className="hidden peer" />
                  <View className="flex flex-col items-center justify-center p-3 border border-primary/20 rounded-lg bg-white dark:bg-slate-800 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary">
                    <MaterialIcons className="mb-1" name={"description" as MaterialIconName} />
                    <Text className="text-xs font-medium">
                      {"Cheque"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Description / Notes"}</Text>
              </View>
              <TextInput className="w-full border border-primary/20 bg-white dark:bg-slate-800 rounded-lg px-4 py-3 outline-none" placeholder="Add additional details about the expense..." multiline />
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Text>{"Upload Receipt"}</Text>
              </View>
              <View className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <View className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                  <MaterialIcons className="" name={"add_a_photo" as MaterialIconName} />
                </View>
                <Text className="text-sm font-medium">
                  {"Click to upload photo or PDF"}
                </Text>
                <Text className="text-xs text-slate-500 mt-1">
                  {"Max file size: 5MB"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 p-4 flex gap-3 border-t border-primary/10">
          <TouchableOpacity className="flex-1 px-6 py-3 border border-primary/30 text-primary font-bold rounded-xl" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Cancel "}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-[2] px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Save Expense "}</Text>
          </TouchableOpacity>
        </View>
        <View className="hidden">
          <View className="flex gap-2 border-t border-primary/10 bg-background-light px-4 pb-3 pt-2">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"house" as MaterialIconName} />
              <Text className="text-xs font-medium">
                {"Home"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="fill-1" name={"receipt_long" as MaterialIconName} />
              <Text className="text-xs font-medium">
                {"Expenses"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
              <Text className="text-xs font-medium">
                {"Events"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"person" as MaterialIconName} />
              <Text className="text-xs font-medium">
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
