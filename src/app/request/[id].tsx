import dayjs from 'dayjs';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import MapBox from 'react-native-maps';

import { useRequest } from '@/api';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Input,
  Text,
  View,
} from '@/components/ui';

export default function Request() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = useRequest({
    //@ts-ignore
    variables: { id: local.id },
  });

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading request</Text>
      </View>
    );
  }

  console.log(data);
  return (
    <>
      <MapBox style={{ width: '100%', height: '30%' }} />
      <View className="flex-1 bg-gray-50 p-4">
        <Stack.Screen options={{ title: 'Request', headerBackTitle: 'Feed' }} />
        <Text className="text-gray-90x0 mb-4 text-2xl font-bold">
          Request Creator: {data.creator_type}
        </Text>
        <View className="space-y-4">
          <View className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800">
              From: {data.start_location}
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              To: {data.end_location}
            </Text>
          </View>
          <View className="flex-row justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <View>
              <Text className="text-sm font-medium text-gray-600">Depart</Text>
              <Text className="text-lg font-bold text-gray-800">
                {dayjs(data.start_time).format('MMM D, YYYY')}
              </Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-600">Arrival</Text>
              <Text className="text-lg font-bold text-gray-800">
                {dayjs(data.end_time).format('MMM D, YYYY')}
              </Text>
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
    </>
  );
}
