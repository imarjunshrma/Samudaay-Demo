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

export default function MatrimonyAnalyticsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-white dark:bg-background-dark/50 border-b border-primary/10 p-4 justify-between absolute top-0 z-10">
          <View className="flex items-center gap-3">
            <View className="bg-primary/10 p-2 rounded-lg text-primary">
              <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
            </View>
            <View>
              <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
                {" Community Admin "}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {" Indian Cobbler Matrimony "}
              </Text>
            </View>
          </View>
          <View className="flex gap-2">
            <TouchableOpacity className="p-2 text-slate-500 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"notifications" as MaterialIconName} />
            </TouchableOpacity>
            <View className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi4nmbHAWb7ke7eCVyds9YoDO7XEG2SrLLMf6b7qNTk6pynAObYdRwkhh3PLmOs6DE8IwVcd2JDTUFrCpHr1tnWfyoppAuEGk9-mrIQGDt_87iIs56Zgcahfvxee7RzaStYuY6g6VWllBkRlKD47_aD7mIeqkyu23VbAw0zRrbtxnqfknXKaZdHi1maIzr418JWKRvBZwektH60es0XEh2cu1GvzLhZLICpgmxocWzEPtRqHo-0PPYWikkGSa0y-_2uxwOgHnFubvV" }} accessibilityLabel="Admin Profile" />
            </View>
          </View>
        </View>
        <View className="flex-1 pb-24">
          <View className="p-4">
            <Text className="text-2xl font-bold mb-1">
              {"Analytics Overview"}
            </Text>
            <Text className="text-slate-500 text-sm mb-6">
              {" Real-time performance of the matrimony platform "}
            </Text>
            <View className="flex md:grid-cols-3 gap-4 flex-col">
              <View className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-primary/10 shadow-sm">
                <View className="flex justify-between items-start">
                  <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {" Active Profiles "}
                  </Text>
                  <MaterialIcons className="text-primary bg-primary/10 p-2 rounded-lg" name={"group" as MaterialIconName} />
                </View>
                <Text className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl font-bold leading-tight">
                  {" 12,450 "}
                </Text>
                <View className="flex items-center gap-1 mt-1">
                  <MaterialIcons className="text-green-600 text-sm" name={"trending_up" as MaterialIconName} />
                  <Text className="text-green-600 text-sm font-semibold">
                    {" +12% "}
                    <Text className="text-slate-400 font-normal ml-1">
                      {"vs last month"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-primary/10 shadow-sm">
                <View className="flex justify-between items-start">
                  <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {" New This Month "}
                  </Text>
                  <MaterialIcons className="text-primary bg-primary/10 p-2 rounded-lg" name={"person_add" as MaterialIconName} />
                </View>
                <Text className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl font-bold leading-tight">
                  {" 840 "}
                </Text>
                <View className="flex items-center gap-1 mt-1">
                  <MaterialIcons className="text-green-600 text-sm" name={"trending_up" as MaterialIconName} />
                  <Text className="text-green-600 text-sm font-semibold">
                    {" +5% "}
                    <Text className="text-slate-400 font-normal ml-1">
                      {"vs last week"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-primary/10 shadow-sm">
                <View className="flex justify-between items-start">
                  <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {" Subscription Revenue "}
                  </Text>
                  <MaterialIcons className="text-primary bg-primary/10 p-2 rounded-lg" name={"payments" as MaterialIconName} />
                </View>
                <Text className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl font-bold leading-tight">
                  {" ₹4.2L "}
                </Text>
                <View className="flex items-center gap-1 mt-1">
                  <MaterialIcons className="text-green-600 text-sm" name={"trending_up" as MaterialIconName} />
                  <Text className="text-green-600 text-sm font-semibold">
                    {" +18% "}
                    <Text className="text-slate-400 font-normal ml-1">
                      {"vs last month"}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-8 bg-white dark:bg-background-dark border border-primary/10 rounded-xl p-6 shadow-sm">
              <View className="flex items-center justify-between mb-6">
                <View>
                  <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">
                    {" Revenue Analytics "}
                  </Text>
                  <Text className="text-slate-500 text-sm font-normal">
                    {" Monthly growth analysis "}
                  </Text>
                </View>
                <View className="flex gap-2">
                  <TouchableOpacity className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-white" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" Monthly "}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-background-light/10 text-slate-600" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" Weekly "}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex flex-col gap-2">
                <View className="flex min-h-[220px] grid-flow-col gap-4 md:gap-8 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
                  <View className="relative flex flex-col items-center w-full">
                    <View className="bg-primary/20 rounded-t-lg w-8 md:w-12" />
                    <Text className="text-slate-500 text-[11px] md:text-xs font-bold mt-2">
                      {" JAN "}
                    </Text>
                  </View>
                  <View className="relative flex flex-col items-center w-full">
                    <View className="bg-primary/20 rounded-t-lg w-8 md:w-12" />
                    <Text className="text-slate-500 text-[11px] md:text-xs font-bold mt-2">
                      {" FEB "}
                    </Text>
                  </View>
                  <View className="relative flex flex-col items-center w-full">
                    <View className="bg-primary/20 rounded-t-lg w-8 md:w-12" />
                    <Text className="text-slate-500 text-[11px] md:text-xs font-bold mt-2">
                      {" MAR "}
                    </Text>
                  </View>
                  <View className="relative flex flex-col items-center w-full">
                    <View className="bg-primary/20 rounded-t-lg w-8 md:w-12" />
                    <Text className="text-slate-500 text-[11px] md:text-xs font-bold mt-2">
                      {" APR "}
                    </Text>
                  </View>
                  <View className="relative flex flex-col items-center w-full">
                    <View className="bg-primary/20 rounded-t-lg w-8 md:w-12" />
                    <Text className="text-slate-500 text-[11px] md:text-xs font-bold mt-2">
                      {" MAY "}
                    </Text>
                  </View>
                  <View className="relative flex flex-col items-center w-full">
                    <View className="bg-primary/80 rounded-t-lg w-8 md:w-12" />
                    <Text className="text-primary text-[11px] md:text-xs font-bold mt-2">
                      {" JUN "}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="mt-8">
              <Text className="text-xl font-bold mb-4">
                {"Recent Profile Approvals"}
              </Text>
              <View className="bg-white dark:bg-background-dark border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                <View className="divide-y divide-primary/5">
                  <View className="p-4 flex items-center gap-4 dark:hover:bg-primary/5">
                    <View className="size-12 rounded-lg bg-slate-100 flex-shrink-0">
                      <Image className="w-full h-full object-cover rounded-lg" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmJHfev4IgLlWlFQHpoNr3lTyaVJieAzz0IbDAUHY08MH2kK0J74C6_aiBQA40ejaCVIbys0jA-QZy3Mf6aokHXKrBExhu_tKGmKMa4OAmWcqWTJFBSnkmgtEdkNcgUHlpDLkTkmfrWodXdP8MrocSQ7E-mSinIedJIbrcNlBs5tn52jZFQObPYQ3uHpmu2PnQ8SSwxLnB1WTcEsMpsL1pBDivm78cjyqbrMMGiqVEg61jkEyIRlRyvIEHJLRLDIeBP495lJTbtOw4" }} accessibilityLabel="Community member profile" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {" Rajesh Kumar "}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {" Agra, Uttar Pradesh • 28 yrs "}
                      </Text>
                    </View>
                    <Text className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                      {"Approved"}
                    </Text>
                  </View>
                  <View className="p-4 flex items-center gap-4 dark:hover:bg-primary/5">
                    <View className="size-12 rounded-lg bg-slate-100 flex-shrink-0">
                      <Image className="w-full h-full object-cover rounded-lg" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsObRfnNG2NKOdtjuWxYp35mRfoYVnCO_wpaDH2zgBZHgvaYDb0VKKKVpGi852mpopS0B2VPaP3X6Z0RoGQXn2j9e31ZLbjU3PFddHk_FHhgdFCOorXEoQxyHu396bOI_HXXQXhZweHLYSdW3JxqxxPIZhG6_kWraAVeV8FPH_m-S-sZL5qBht1U7fTpXc8xRYFVQRev7-rwevrl9lc_SgrPg6CooPtirPyBo4V5ujkkxKqhlgNi5P9E2lPPA4bvaUvU-J60U9JinL" }} accessibilityLabel="Community member profile" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {" Priya Varma "}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {" Kanpur, Uttar Pradesh • 24 yrs "}
                      </Text>
                    </View>
                    <Text className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">
                      {"Pending"}
                    </Text>
                  </View>
                  <View className="p-4 flex items-center gap-4 dark:hover:bg-primary/5">
                    <View className="size-12 rounded-lg bg-slate-100 flex-shrink-0">
                      <Image className="w-full h-full object-cover rounded-lg" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpgp5827KyKV1Z6_-vW9n5N5CwRaeNN6b25IIlxvmI4KoESOPtavy07e9JrhaGMmuAy9i1edUmBre7XqT79baQLfeNuxL940Mu3ANluE0rmF-yIPi43iiMAO7q9pB6awVsG7T9VCpQfYT8_vrpxc4A3O-ratLKwdTMDzsT7rs9sjq1e4tojgTG09yBPLE5rY-XOIFdMMKZ72Zf90fsL5t18yr7_EnQKMTeCySlU8xTTkEPpa854Eg-TxdrvGfntYjxzrmgX6qvrkgh" }} accessibilityLabel="Community member profile" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {" Amit Jaiswal "}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {" Meerut, Uttar Pradesh • 30 yrs "}
                      </Text>
                    </View>
                    <Text className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                      {"Approved"}
                    </Text>
                  </View>
                </View>
                <View className="p-4 bg-slate-50 dark:bg-primary/5 text-center">
                  <TouchableOpacity className="text-primary text-sm font-bold" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" View All Requests "}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-primary/10 px-4 pb-4 pt-2 z-20">
          <View className="flex max-w-lg mx-auto gap-2">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="active-icon" name={"home" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-wider">
                {"Home"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"group" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-wider">
                {" Profiles "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"analytics" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-wider">
                {" Revenue "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"settings" as MaterialIconName} />
              <Text className="text-[10px] font-bold uppercase tracking-wider">
                {" Settings "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
