import React from 'react';

import { Pressable, SafeAreaView, Text, View } from '@/components/ui';
import { useAppState } from '@/lib/hooks/open-first-time';
import { useThemeConfig } from '@/lib/use-theme-config';

const RoleSelectionSplashScreen = () => {
  const { setFirstTimeOpen, setSessionType } = useAppState();

  const handleRoleSelection = (role: 'driver' | 'passenger') => {
    setFirstTimeOpen(false);
    setSessionType(role);
  };

  const theme = useThemeConfig();

  return (
    <SafeAreaView
      className={`flex-1 ${theme.dark ? 'bg-black' : 'bg-gray-100 '} items-center justify-center p-6`}
    >
      <Text className="mb-6 text-2xl font-bold text-gray-900">
        Who will you be today?
      </Text>
      <View className="w-full flex-row justify-between gap-5 space-y-4">
        <Pressable
          onPress={() => handleRoleSelection('driver')}
          className="h-32 w-full flex-1 items-center justify-center  rounded-lg bg-orange-600 text-center font-semibold text-white shadow-md"
        >
          <Text className="text-center text-2xl font-bold text-white">
            Driver
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleRoleSelection('passenger')}
          className="items-enter h-32 w-full flex-1 justify-center  rounded-lg bg-blue-600 text-center font-semibold text-white shadow-md"
        >
          <Text className="text-center text-2xl font-bold text-white">
            Rider
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelectionSplashScreen;
