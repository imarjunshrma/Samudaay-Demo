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

export default function SplashScreen1Screen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-between antialiased">
    <View className="absolute top-0 right-0 -z-10 opacity-10">
      <View className="w-64 h-64 bg-primary blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
    </View>
    <View className="absolute bottom-0 left-0 -z-10 opacity-10">
      <View className="w-64 h-64 bg-primary blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="w-full flex items-center justify-between p-4 max-w-md mx-auto">
        <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center">
          <MaterialIcons className="text-2xl" name={"menu" as MaterialIconName} />
        </View>
        <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          <View />
        </Text>
        <View className="size-12" />
      </View>
      <View className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 text-center">
        <View className="w-full @container mb-8">
          <View className="@[480px]:px-4">
            <View className="w-full aspect-square max-w-[280px] mx-auto rounded-full flex items-center justify-center relative overflow-hidden bg-white shadow-inner">
              <Image className="absolute inset-0 w-full h-full object-cover scale-110 object-contain p-4" source={{ uri: "https://lh3.googleusercontent.com/aida/ADBb0ui91TcnXdBUV3HyuHBhE9jXGgCmxBpelyWpiJq4KhI4AmDUJedjA4_iSbsoKCxQQKhlZFOcXBAYEE4VmHdgKahPkEx9u6zeeqNsQrEAlcs8G5-3bNGqamrHGrHZfFDmAQl8sGxJ0uwLvyT8o2vZ3aBlc4ANwJMAfD2HcruYeYn_BvAeJBZcd5SJBEe9std_R_rAWNNXl3EVhaqCdjokVmt5bcXEa4K2tWW7-0j5ju2lGXNKb-36HWUjYPmZCMvOd4EyBZgMfkxV41g" }} accessibilityLabel="ICC Community Logo" />
              <View className="absolute inset-4 rounded-full border-2 border-white/20 z-30" />
            </View>
          </View>
        </View>
        <View className="space-y-4">
          <Text className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold tracking-tight leading-tight">
            {" Mochi Ekta Cheritable Trust "}
          </Text>
          <View className="h-1 w-16 bg-primary mx-auto rounded-full" />
          <Text className="text-primary text-xl font-semibold tracking-tight">
            {" Empowering our Community "}
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
            {" Connecting People "}
          </Text>
        </View>
      </View>
      <View className="w-full max-w-md p-8 flex flex-col gap-4">
        <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
          <Text>{" Get Started "}</Text>
          <MaterialIcons className="" name={"arrow_forward" as MaterialIconName} />
        </TouchableOpacity>
        <Text className="text-slate-400 dark:text-slate-500 text-sm text-center">
          {" By continuing, you agree to our Terms of Service "}
        </Text>
        <View className="flex justify-center mt-4">
          <View className="flex gap-1">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <View className="w-2 h-2 rounded-full bg-primary/30" />
            <View className="w-2 h-2 rounded-full bg-primary/30" />
          </View>
        </View>
      </View>
      <View className="hidden">
        <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuARcQRUFTY4dUgf4KkihD_7SfELaDyQTqUDNTt50zOhfiKsbYCOBRb_9eYoDNKTuUY1MQShDIHq_3fxTuBwtwGsY85etD8_Zq1C1U5JDtcrEMg-KCFKd1sv9XrEuZJcnPd61QOXMm8r2TnEJCvImJqGcz-TYfsLxur4d7AFBf2ihasYZDKBK4wsVFt4H532woJRnlw3R0QMBjcBRvLbmTojsvc839Yfs6-ZLxNAv9-QfWdg9UCcfKTeoYGcso7BLJOLSEFa5Bk5MOQJ" }} accessibilityLabel="Abstract orange and white gradient pattern background" />
      </View>
      </ScrollView>
    </View>
  );
}
