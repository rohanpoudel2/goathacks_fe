import React from 'react';

import { Button, SafeAreaView, Text, View } from '@/components/ui';
import { useAppState } from '@/lib/hooks/open-first-time';

const RoleSelectionSplashScreen = () => {
  const { setFirstTimeOpen, setSessionType } = useAppState();

  const handleRoleSelection = (role: 'driver' | 'passenger') => {
    setFirstTimeOpen(false);
    setSessionType(role);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="mb-6 text-2xl font-bold text-gray-900">
        Who will you be today?
      </Text>
      <View className="w-full space-y-4">
        <Button
          label="Driver"
          onPress={() => handleRoleSelection('driver')}
          className="w-full rounded-lg bg-blue-600  text-center font-semibold text-white shadow-md"
        />
        <Button
          label="Rider"
          onPress={() => handleRoleSelection('passenger')}
          className="w-full rounded-lg bg-green-600  text-center font-semibold text-white shadow-md"
        />
      </View>
    </SafeAreaView>
  );
};

export default RoleSelectionSplashScreen;
