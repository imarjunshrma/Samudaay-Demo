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

export default function TransactionAnalyticsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 absolute top-0 z-10 border-b border-primary/10">
          <View className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MaterialIcons className="" name={"analytics" as MaterialIconName} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              {" Transaction Analytics "}
            </Text>
            <Text className="text-xs text-slate-500">
              {"Indian Cobbler Community Admin"}
            </Text>
          </View>
          <TouchableOpacity className="flex size-10 items-center justify-center rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"notifications" as MaterialIconName} />
          </TouchableOpacity>
        </View>
        <View className="flex gap-4 p-4 flex-col md:flex-row md:flex-wrap">
          <View className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5 w-full md:w-[48%]">
            <View className="flex items-center gap-2 text-primary">
              <MaterialIcons className="text-sm" name={"volunteer_activism" as MaterialIconName} />
              <Text className="text-sm font-medium">
                {"Total Donations"}
              </Text>
            </View>
            <Text className="text-2xl font-bold">
              {"₹8,45,200"}
            </Text>
            <View className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <MaterialIcons className="text-xs" name={"trending_up" as MaterialIconName} />
              <Text>
                {"+14.2%"}
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5 w-full md:w-[48%]">
            <View className="flex items-center gap-2 text-primary">
              <MaterialIcons className="text-sm" name={"favorite" as MaterialIconName} />
              <Text className="text-sm font-medium">
                {"Matrimony Revenue"}
              </Text>
            </View>
            <Text className="text-2xl font-bold">
              {"₹2,12,500"}
            </Text>
            <View className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <MaterialIcons className="text-xs" name={"trending_up" as MaterialIconName} />
              <Text>
                {"+8.4%"}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-4 py-2">
          <View className="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-primary/5">
            <View className="flex items-center justify-between mb-6">
              <View>
                <Text className="font-bold text-slate-900 dark:text-white">
                  {" Revenue Trends "}
                </Text>
                <Text className="text-xs text-slate-500">
                  {" Monthly breakdown of all collections "}
                </Text>
              </View>
              <TextInput className="text-xs bg-background-light dark:bg-slate-700 border-none rounded-lg" />
            </View>
            <View className="h-40 w-full">
              <View className="w-full h-full">
                <View />
                <View />
                <View>
                  <View>
                    <View />
                    <View />
                  </View>
                </View>
              </View>
            </View>
            <View className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Text>
                {"Jan"}
              </Text>
              <Text>
                {"Feb"}
              </Text>
              <Text>
                {"Mar"}
              </Text>
              <Text>
                {"Apr"}
              </Text>
              <Text>
                {"May"}
              </Text>
              <Text>
                {"Jun"}
              </Text>
            </View>
          </View>
        </View>
        <View className="p-4">
          <View className="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-primary/5">
            <Text className="font-bold text-slate-900 dark:text-white mb-4">
              {" Top Donation Pincodes "}
            </Text>
            <View className="space-y-4">
              <View className="flex items-center gap-3">
                <View className="flex-1">
                  <View className="flex justify-between text-xs mb-1">
                    <Text className="font-medium">
                      {"400001 (Mumbai South)"}
                    </Text>
                    <Text className="text-primary font-bold">
                      {"₹1.2L"}
                    </Text>
                  </View>
                  <View className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <View className="bg-primary h-full rounded-full" />
                  </View>
                </View>
              </View>
              <View className="flex items-center gap-3">
                <View className="flex-1">
                  <View className="flex justify-between text-xs mb-1">
                    <Text className="font-medium">
                      {"110001 (Connaught Place)"}
                    </Text>
                    <Text className="text-primary font-bold">
                      {"₹85K"}
                    </Text>
                  </View>
                  <View className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <View className="bg-primary h-full rounded-full" />
                  </View>
                </View>
              </View>
              <View className="flex items-center gap-3">
                <View className="flex-1">
                  <View className="flex justify-between text-xs mb-1">
                    <Text className="font-medium">
                      {"560001 (Bangalore Central)"}
                    </Text>
                    <Text className="text-primary font-bold">
                      {"₹72K"}
                    </Text>
                  </View>
                  <View className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <View className="bg-primary h-full rounded-full" />
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity className="mt-4 w-full text-xs font-bold text-primary py-2 border border-primary/20 rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" VIEW FULL HEATMAP "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 mb-4">
          <View className="flex items-center justify-between mb-3">
            <Text className="font-bold text-slate-900 dark:text-white">
              {" Recent Transactions "}
            </Text>
            <TouchableOpacity className="text-xs font-bold text-primary uppercase" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"View All"}</Text>
            </TouchableOpacity>
          </View>
          <View className="space-y-3">
            <View className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
                  <MaterialIcons className="" name={"person" as MaterialIconName} />
                </View>
                <View>
                  <Text className="text-sm font-bold">
                    {"Rajesh Kumar"}
                  </Text>
                  <Text className="text-[10px] text-slate-500">
                    {" Matrimony Subscription • 10:45 AM "}
                  </Text>
                </View>
              </View>
              <View className="text-right">
                <Text className="text-sm font-bold text-slate-900 dark:text-white">
                  {" ₹1,100 "}
                </Text>
                <Text className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-bold">
                  {"SUCCESS"}
                </Text>
              </View>
            </View>
            <View className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
                </View>
                <View>
                  <Text className="text-sm font-bold">
                    {"Anonymous Donor"}
                  </Text>
                  <Text className="text-[10px] text-slate-500">
                    {" Education Fund • 09:20 AM "}
                  </Text>
                </View>
              </View>
              <View className="text-right">
                <Text className="text-sm font-bold text-slate-900 dark:text-white">
                  {" ₹5,000 "}
                </Text>
                <Text className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-bold">
                  {"SUCCESS"}
                </Text>
              </View>
            </View>
            <View className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
                  <MaterialIcons className="" name={"person" as MaterialIconName} />
                </View>
                <View>
                  <Text className="text-sm font-bold">
                    {"Sunita Verma"}
                  </Text>
                  <Text className="text-[10px] text-slate-500">
                    {" Matrimony Subscription • Yesterday "}
                  </Text>
                </View>
              </View>
              <View className="text-right">
                <Text className="text-sm font-bold text-slate-900 dark:text-white">
                  {" ₹1,100 "}
                </Text>
                <Text className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full font-bold">
                  {"PENDING"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pb-6 pt-3 flex justify-between items-center z-50">
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {"Home"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="fill-1" name={"receipt_long" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {"Txns"}
            </Text>
          </TouchableOpacity>
          <View className="relative -top-8">
            <TouchableOpacity className="size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-background-light dark:border-background-dark" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {"Members"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"settings" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {"Setup"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
