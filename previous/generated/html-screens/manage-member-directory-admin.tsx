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

export default function ManageMemberDirectoryAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden">
        <View className="absolute top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
          <View className="flex items-center p-4 justify-between">
            <View className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
            </View>
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
              {" Manage Directory "}
            </Text>
            <View className="size-10 flex items-center justify-center">
              <MaterialIcons className="text-primary" name={"admin_panel_settings" as MaterialIconName} />
            </View>
          </View>
          <View className="px-4 py-3">
            <View className="flex flex-col min-w-40 h-12 w-full">
              <View className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                <View className="text-primary flex border-none bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                  <MaterialIcons className="" name={"search" as MaterialIconName} />
                </View>
                <TextInput className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 dark:text-slate-100 border-none bg-white dark:bg-slate-800 h-full placeholder:text-slate-400 px-4 pl-2 text-base font-normal" placeholder="Search for members to edit..." />
              </View>
            </View>
          </View>
          <View className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
            <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-4 shadow-md shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-medium">
                {"State"}
              </Text>
              <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-primary/20 px-4 text-slate-700 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-medium">
                {"City"}
              </Text>
              <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-primary/20 px-4 text-slate-700 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-medium">
                {"Role"}
              </Text>
              <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <View className="flex items-center justify-between">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight">
              {" Community Members "}
            </Text>
            <Text className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {"1,248 Total"}
            </Text>
          </View>
          <View className="flex gap-4">
            <View className="relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="absolute top-2 right-2 flex gap-1">
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="relative size-16 shrink-0">
                <Image className="size-16 rounded-full object-cover border-2 border-primary/20" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAST3OehLKpOvus-yLkhjx5q7Fy-w2Cix7kNhFZxK-kpP4RM9Gk-06Z22RVaj4l_7pHT8BGBbbDhdEhlxS_Oj0XHN4qAjqYBurRMfrybLRX-XAGiKiZNq9ItPwFQlCZKb5ZlPrwQH_RJcqVN64lZFxkk327Hww7lyePbVixzY2qtnozQyOg1EsjJjStSqOqGc6vXQOWSaer_DRqGoY3H0B_tF4Y8u3M9XCCMYY4N4MVS3LAsZoKIOJGulONFrvQaBpe4fLB5pNFexsX" }} accessibilityLabel="Member profile photo" />
                <View className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
              </View>
              <View className="flex flex-col flex-1 min-w-0 pr-12">
                <Text className="text-slate-900 dark:text-slate-100 font-bold truncate">
                  {" Rajesh Kumar "}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                  <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                  <Text className="truncate">
                    {"Dharavi, Mumbai"}
                  </Text>
                </View>
                <Text className="text-primary text-xs font-semibold mt-1">
                  {" Master Artisan • 15 Years Exp. "}
                </Text>
              </View>
            </View>
            <View className="relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="absolute top-2 right-2 flex gap-1">
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="relative size-16 shrink-0">
                <Image className="size-16 rounded-full object-cover border-2 border-primary/20" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT6URtYbcKTABNUPVbE1TcXq7xv5HdQ2YwsjVoc34rUuc0CGQUXkizj9RyfSDzzsUT7l-Mgpa_FDVB017worLZoTfECnmsqMw316SX1mmxYEveccK2z21eiIwnkVrZ3FCOQEaxmYEo3BZ_z8LL16cbCImNwXMzk_QyYo_uBzfkArzIskbqdynD8OP8g76glME_qnsNPBUHiazusoq6qUiTkscpszz9jo_ctM3K0dmTOdNJ_CXB88JhdUj16iuVWULZqn52yZdYbyvE" }} accessibilityLabel="Member profile photo" />
              </View>
              <View className="flex flex-col flex-1 min-w-0 pr-12">
                <Text className="text-slate-900 dark:text-slate-100 font-bold truncate">
                  {" Sunita Devi "}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                  <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                  <Text className="truncate">
                    {"Agra, Uttar Pradesh"}
                  </Text>
                </View>
                <Text className="text-primary text-xs font-semibold mt-1">
                  {" Footwear Designer "}
                </Text>
              </View>
            </View>
            <View className="relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="absolute top-2 right-2 flex gap-1">
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="relative size-16 shrink-0">
                <Image className="size-16 rounded-full object-cover border-2 border-primary/20" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2tgepGANWp5_KFYbuoytlxjwLb0TMARUqXUa8RQNOnxjzO313efsJdn-9jxKnghxlIxr6nOn_Bbfb517J0JpS3_-8M4vg4U-ZdMgjrMP9cDoHjtkUmuUDU9h0sGXQj1WLSm6F6sif4CPE1W9ZVdMjw-LawlaT5zrU0Gt9PI-8w91Dg9tNsE5jXV7PM0yl_PhbelFf2Bg7FfOruP4oZSxZHxWTDbRjVDbOzuaLfnrGqDhgYv_VCKeZ_s63-g0RZoTkTN3dlx2DUUY0" }} accessibilityLabel="Member profile photo" />
              </View>
              <View className="flex flex-col flex-1 min-w-0 pr-12">
                <Text className="text-slate-900 dark:text-slate-100 font-bold truncate">
                  {" Mohammad Arif "}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                  <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                  <Text className="truncate">
                    {"Chandni Chowk, Delhi"}
                  </Text>
                </View>
                <Text className="text-primary text-xs font-semibold mt-1">
                  {" Orthopedic Specialist "}
                </Text>
              </View>
            </View>
            <View className="relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="absolute top-2 right-2 flex gap-1">
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="relative size-16 shrink-0">
                <Image className="size-16 rounded-full object-cover border-2 border-primary/20" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxCDb1gbDo05NBnBfentL8m7Bs5tACTt7uvEah7JerzbcN9ramvsW7mR4Huzde5xZityVm8Mlx_rc4N8xMM2S4-k4K0lRZ827CMbJkpm4osqmU-hLOqANFrgtqo0vcr2_Z9rUjFZFj-xMIJ8frPl1QaNqBk_Kunm4ORfDVADN5_DiKMBzKZmFWiD1hQO59CSP_Xg1RE5ar6pxWfjhLG00Uy4UDadRiNtdzE1jMfjV9-VM06ks8WxJR9U6As9VlmjA5rivFKq3JHLEN" }} accessibilityLabel="Member profile photo" />
                <View className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
              </View>
              <View className="flex flex-col flex-1 min-w-0 pr-12">
                <Text className="text-slate-900 dark:text-slate-100 font-bold truncate">
                  {" Amit Saxena "}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                  <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                  <Text className="truncate">
                    {"Indiranagar, Bengaluru"}
                  </Text>
                </View>
                <Text className="text-primary text-xs font-semibold mt-1">
                  {" Premium Repair Service "}
                </Text>
              </View>
            </View>
            <View className="relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <View className="absolute top-2 right-2 flex gap-1">
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-base" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="relative size-16 shrink-0">
                <View className="size-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <MaterialIcons className="text-primary text-3xl" name={"person" as MaterialIconName} />
                </View>
              </View>
              <View className="flex flex-col flex-1 min-w-0 pr-12">
                <Text className="text-slate-900 dark:text-slate-100 font-bold truncate">
                  {" Gopal Varma "}
                </Text>
                <View className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                  <MaterialIcons className="text-xs" name={"location_on" as MaterialIconName} />
                  <Text className="truncate">
                    {"Ameerpet, Hyderabad"}
                  </Text>
                </View>
                <Text className="text-primary text-xs font-semibold mt-1">
                  {" Raw Material Supplier "}
                </Text>
              </View>
            </View>
          </View>
          <View className="pt-4 pb-24 flex justify-center">
            <TouchableOpacity className="text-primary font-bold text-sm flex items-center gap-1 px-6 py-2 rounded-full border border-primary/20 bg-primary/5" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Load More Members "}</Text>
              <MaterialIcons className="text-base" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="absolute bottom-20 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
        </TouchableOpacity>
        <View className="absolute bottom-0 left-0 right-0 max-w-md mx-auto z-30 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <View className="flex h-16 w-full items-center justify-around px-2">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"home" as MaterialIconName} />
              <Text className="text-[10px] font-semibold uppercase tracking-wider">
                {" Home "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"groups" as MaterialIconName} />
              <Text className="text-[10px] font-semibold uppercase tracking-wider">
                {" Directory "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"event" as MaterialIconName} />
              <Text className="text-[10px] font-semibold uppercase tracking-wider">
                {" Events "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"person_pin" as MaterialIconName} />
              <Text className="text-[10px] font-semibold uppercase tracking-wider">
                {" Profile "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
