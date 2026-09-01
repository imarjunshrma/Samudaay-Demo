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

export default function RegistrationAndKycScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden">
        <View className="flex items-center p-4 pb-2 justify-between">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
            <MaterialIcons className="text-3xl" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {" Registration "}
          </Text>
        </View>
        <View className="flex w-full flex-row items-center justify-center gap-4 py-5">
          <View className="h-2 w-12 rounded-full bg-primary" />
          <View className="h-2 w-12 rounded-full bg-primary/20" />
          <View className="h-2 w-12 rounded-full bg-primary/20" />
        </View>
        <View className="px-4">
          <Text className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight pb-2 pt-5">
            {" Welcome "}
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-6">
            {" Join the Cobbler Community. Please enter your mobile number to get started. "}
          </Text>
          <View className="space-y-6">
            <View className="flex flex-col gap-2">
              <View className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">
                <Text>{"Mobile Number"}</Text>
              </View>
              <View className="relative flex items-center">
                <Text className="absolute left-4 text-slate-500 font-medium border-r border-primary/20 pr-3">
                  {"+91"}
                </Text>
                <TextInput className="form-input flex w-full rounded-xl border border-primary/20 bg-white dark:bg-background-dark/50 h-14 pl-16 pr-4 text-lg font-medium placeholder:text-slate-400" placeholder="00000 00000" />
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">
                <Text>{"OTP Code"}</Text>
              </View>
              <View className="flex gap-2 justify-between">
                <TextInput className="w-12 h-12 text-center rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-xl font-bold" placeholder="4" />
                <TextInput className="w-12 h-12 text-center rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-xl font-bold" placeholder="2" />
                <TextInput className="w-12 h-12 text-center rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-xl font-bold" placeholder="0" />
                <TextInput className="w-12 h-12 text-center rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-xl font-bold" placeholder="-" />
                <TextInput className="w-12 h-12 text-center rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-xl font-bold" placeholder="-" />
                <TextInput className="w-12 h-12 text-center rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-xl font-bold" placeholder="-" />
              </View>
              <Text className="text-xs text-primary font-medium mt-2 text-right">
                {" Resend OTP in 0:45 "}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-auto p-4 space-y-4">
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Verify & Continue "}</Text>
          </TouchableOpacity>
          <Text className="text-center text-xs text-slate-500 px-8">
            {" By continuing, you agree to the community terms and privacy policy. "}
          </Text>
        </View>
        <View className="h-8" />
      </View>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden mt-12">
        <View className="flex items-center p-4 pb-2 justify-between">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
            <MaterialIcons className="text-3xl" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {" Profile Details "}
          </Text>
        </View>
        <View className="flex w-full flex-row items-center justify-center gap-4 py-5">
          <View className="h-2 w-12 rounded-full bg-primary" />
          <View className="h-2 w-12 rounded-full bg-primary" />
          <View className="h-2 w-12 rounded-full bg-primary/20" />
        </View>
        <View className="px-4 pb-8 space-y-4">
          <View className="flex flex-col gap-1">
            <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              <Text>{"Full Name"}</Text>
            </View>
            <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" placeholder="Enter full name" />
          </View>
          <View className="flex flex-col gap-1">
            <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              <Text>{"Father's / Guardian's Name"}</Text>
            </View>
            <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" placeholder="Enter father's name" />
          </View>
          <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
            <View className="flex flex-col gap-1 w-full md:w-[48%]">
              <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                <Text>{"Gender"}</Text>
              </View>
              <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" />
            </View>
            <View className="flex flex-col gap-1 w-full md:w-[48%]">
              <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                <Text>{"Date of Birth"}</Text>
              </View>
              <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" multiline />
            </View>
          </View>
          <View className="flex flex-col gap-1">
            <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              <Text>{"Full Address"}</Text>
            </View>
            <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" placeholder="Shop/House No, Street, Landmark" multiline />
          </View>
          <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
            <View className="flex flex-col gap-1 w-full md:w-[48%]">
              <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                <Text>{"City"}</Text>
              </View>
              <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" placeholder="City name" />
            </View>
            <View className="flex flex-col gap-1 w-full md:w-[48%]">
              <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                <Text>{"Pincode"}</Text>
              </View>
              <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" placeholder="6 digits" />
            </View>
          </View>
          <View className="flex flex-col gap-1">
            <View className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              <Text>{"Occupation Type"}</Text>
            </View>
            <TextInput className="w-full rounded-lg border border-primary/10 bg-white dark:bg-background-dark/50 p-3" />
          </View>
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg mt-4" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Save & Continue "}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden mt-12 mb-12">
        <View className="flex items-center p-4 pb-2 justify-between">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
            <MaterialIcons className="text-3xl" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {" KYC Verification "}
          </Text>
        </View>
        <View className="flex w-full flex-row items-center justify-center gap-4 py-5">
          <View className="h-2 w-12 rounded-full bg-primary" />
          <View className="h-2 w-12 rounded-full bg-primary" />
          <View className="h-2 w-12 rounded-full bg-primary" />
        </View>
        <View className="px-4 space-y-6 pb-10">
          <View>
            <Text className="text-lg font-bold">
              {"Document Upload"}
            </Text>
            <Text className="text-sm text-slate-500">
              {" Please upload clear photos of your documents for verification. "}
            </Text>
          </View>
          <View className="bg-white dark:bg-background-dark/50 rounded-xl border-2 border-dashed border-primary/30 p-6 flex flex-col items-center text-center gap-3">
            <View className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MaterialIcons className="" name={"badge" as MaterialIconName} />
            </View>
            <View>
              <Text className="font-bold">
                {"Aadhaar Card"}
              </Text>
              <Text className="text-xs text-slate-500">
                {" Upload Front & Back (PDF/JPG) "}
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-2 border border-primary text-primary text-sm font-semibold rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Select File "}</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white dark:bg-background-dark/50 rounded-xl border-2 border-dashed border-primary/30 p-6 flex flex-col items-center text-center gap-3">
            <View className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MaterialIcons className="" name={"description" as MaterialIconName} />
            </View>
            <View>
              <Text className="font-bold">
                {"Caste Certificate"}
              </Text>
              <Text className="text-xs text-slate-500">
                {" Mandatory for community benefits "}
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-2 border border-primary text-primary text-sm font-semibold rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Select File "}</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white dark:bg-background-dark/50 rounded-xl border-2 border-dashed border-primary/30 p-6 flex flex-col items-center text-center gap-3">
            <View className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MaterialIcons className="" name={"add_a_photo" as MaterialIconName} />
            </View>
            <View>
              <Text className="font-bold">
                {"Selfie / Profile Photo"}
              </Text>
              <Text className="text-xs text-slate-500">
                {" Ensure your face is clearly visible "}
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-2 border border-primary text-primary text-sm font-semibold rounded-lg" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Take Photo "}</Text>
            </TouchableOpacity>
          </View>
          <View className="pt-4">
            <View className="flex items-start gap-3 mb-6">
              <TextInput className="mt-1 rounded text-primary" />
              <Text className="text-xs text-slate-600 dark:text-slate-400">
                {" I hereby declare that all information and documents provided are true and correct to the best of my knowledge. "}
              </Text>
            </View>
            <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Complete Registration "}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
