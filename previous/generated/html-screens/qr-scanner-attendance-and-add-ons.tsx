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

export default function QrScannerAttendanceAndAddOnsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 justify-between absolute top-0 z-50">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            {" Admin QR Scanner "}
          </Text>
          <View className="flex w-12 items-center justify-end">
            <TouchableOpacity className="flex items-center justify-center rounded-lg h-12 bg-transparent text-slate-900 dark:text-slate-100" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"history" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          <View className="absolute inset-0 opacity-60">
            <View className="w-full h-full bg-gradient-to-br from-slate-800 to-black" />
          </View>
          <View className="relative w-64 h-64 z-10">
            <View className="scanner-frame w-full h-full rounded-xl" />
            <View className="scanner-corner border-t-4 border-l-4 top-0 left-0 rounded-tl-lg" />
            <View className="scanner-corner border-t-4 border-r-4 top-0 right-0 rounded-tr-lg" />
            <View className="scanner-corner border-b-4 border-l-4 bottom-0 left-0 rounded-bl-lg" />
            <View className="scanner-corner border-b-4 border-r-4 bottom-0 right-0 rounded-br-lg" />
            <View className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_#f2780d] animate-pulse" />
          </View>
          <View className="absolute bottom-8 left-0 w-full flex items-center justify-center gap-6 z-20">
            <TouchableOpacity className="flex shrink-0 items-center justify-center rounded-full size-12 bg-black/50 text-white border border-white/20" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"flashlight_on" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex shrink-0 items-center justify-center rounded-full size-16 bg-primary text-white shadow-lg shadow-primary/40" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-4xl" name={"qr_code_scanner" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex shrink-0 items-center justify-center rounded-full size-12 bg-black/50 text-white border border-white/20" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"sync" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-background-light dark:bg-background-dark px-4 py-4 shadow-2xl z-30">
          <View className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary/10 p-1">
            <View className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 bg-white dark:bg-primary shadow-sm text-primary dark:text-white text-sm font-bold">
              <Text className="truncate">
                {"Event Attendance"}
              </Text>
              <TextInput className="hidden" placeholder="attendance" />
            </View>
            <View className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Text className="truncate">
                {"Add-on Verification"}
              </Text>
              <TextInput className="hidden" placeholder="addon" />
            </View>
          </View>
        </View>
        <View className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60">
          <View className="bg-white dark:bg-background-dark rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom">
            <View className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            <View className="flex items-center gap-4 mb-6">
              <View className="size-20 rounded-2xl overflow-hidden border-2 border-primary">
                <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVMkCFB0gq-x-pgREX5Bx2fwCJh-SnyQ0B92eDO9SNh2bCvT7A_R3feQCHrBPI2RC0e3WNshD_oIm-oC8D8Mq8YSSyxlSTSytkucBfrb8RZ2kk6grzicr49tpByQqMnA0bb0BlfAn029mxn7UelWgnUfmUjc5m2DsQAMaefYQoacdcK2sMcA-iJZSbiwqPveOOxfKVuGXzvT4DT46M-x1oolJ-R3AK6uFt6VZlkidysGcYpXMl2LkY1C6FNgRDioz8gj9IHaH2DsUn" }} accessibilityLabel="Profile photo of a smiling Indian man" />
              </View>
              <View>
                <View className="flex items-center gap-2">
                  <Text className="text-xl font-bold">
                    {"Rajesh Kumar"}
                  </Text>
                  <Text className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {"Verified"}
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm">
                  {"Member ID: #ICC-2024-8892"}
                </Text>
                <View className="mt-1 flex items-center gap-1 text-primary">
                  <MaterialIcons className="text-sm" name={"event_available" as MaterialIconName} />
                  <Text className="text-xs font-semibold">
                    {"National Cobbler Meet 2024"}
                  </Text>
                </View>
              </View>
            </View>
            <View className="space-y-4">
              <View className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  {" Service Verification "}
                </Text>
                <View className="space-y-3">
                  <View className="flex items-center justify-between py-2 border-b border-primary/10 last:border-0">
                    <View className="flex items-center gap-3">
                      <View className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <MaterialIcons className="" name={"restaurant" as MaterialIconName} />
                      </View>
                      <View>
                        <Text className="font-bold text-sm">
                          {"Lunch Coupon"}
                        </Text>
                        <Text className="text-xs text-slate-500">
                          {"Traditional Thali"}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Mark as Used "}</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex items-center justify-between py-2 border-b border-primary/10 last:border-0 opacity-60">
                    <View className="flex items-center gap-3">
                      <View className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <MaterialIcons className="" name={"redeem" as MaterialIconName} />
                      </View>
                      <View>
                        <Text className="font-bold text-sm">
                          {"Gift Pack"}
                        </Text>
                        <Text className="text-xs text-slate-500">
                          {"Tool Kit V2"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex items-center gap-1 text-green-600">
                      <MaterialIcons className="text-sm font-bold" name={"check_circle" as MaterialIconName} />
                      <Text className="text-xs font-bold uppercase">
                        {"Redeemed"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex items-center justify-between py-2 border-b border-primary/10 last:border-0">
                    <View className="flex items-center gap-3">
                      <View className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <MaterialIcons className="" name={"dinner_dining" as MaterialIconName} />
                      </View>
                      <View>
                        <Text className="font-bold text-sm">
                          {"Dinner Pass"}
                        </Text>
                        <Text className="text-xs text-slate-500">
                          {"Networking Gala"}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                      <Text>{" Mark as Used "}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold tracking-wide mt-2" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Next Scan "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex gap-2 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-3 pt-2 mt-auto">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"qr_code_scanner" as MaterialIconName} />
            <Text className="text-xs font-bold leading-normal tracking-[0.015em]">
              {" Scan "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Members "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"settings" as MaterialIconName} />
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Settings "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
