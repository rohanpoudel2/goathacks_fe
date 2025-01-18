import { Stack } from 'expo-router';
import * as React from 'react';

import { Button, Input, Text, View } from '@/components/ui';

export default function Request() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Stack.Screen options={{ title: 'Request', headerBackTitle: 'Feed' }} />

      <Text className="text-gray-90x0 mb-4 text-2xl font-bold">
        Request Creator: John Doe
      </Text>
      <View className="space-y-4">
        <View className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            From: New Haven, 06516
          </Text>
          <Text className="text-lg font-semibold text-gray-800">
            To: University of New Haven
          </Text>
        </View>
        <View className="flex-row justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          <View>
            <Text className="text-sm font-medium text-gray-600">Depart</Text>
            <Text className="text-lg font-bold text-gray-800">11:30</Text>
          </View>
          <View>
            <Text className="text-sm font-medium text-gray-600">Arrival</Text>
            <Text className="text-lg font-bold text-gray-800">11:45</Text>
          </View>
        </View>
      </View>
      <View className="relative my-10">
        <Text className="text-lg">NOTE</Text>
        <Input multiline numberOfLines={5} placeholder="Lorem Ipsum ..." />
      </View>
      <View>
        <Button
          label="I'm Interested"
          size="lg"
          variant="default"
          className="mr-2 bg-green-500"
        />
        <Button
          label="Not Interested"
          size="lg"
          variant="default"
          className="mr-2 bg-red-500"
        />
      </View>
    </View>
  );
}
