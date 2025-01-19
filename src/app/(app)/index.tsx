import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';

import { useRequests } from '@/api';
import type { Request } from '@/api/request';
import { FocusAwareStatusBar, SafeAreaView, Text, View } from '@/components/ui';

export interface Data {
  from: string;
  to: string;
  depart: string;
  arrival: string;
}

const renderRequestsItem = ({ item }: { item: Request }) => {
  return (
    <Link href={`/request/${item.request_id}`} className="mb-4 w-full ">
      <View className="relative w-full rounded-lg bg-gray-100 p-4">
        <Text className="text-lg font-bold text-gray-900">
          From: {item.start_location}
        </Text>
        <Text className="text-lg font-bold text-gray-900">
          To: {item.end_location}
        </Text>
        <View className="absolute inset-y-0 right-0 flex justify-center bg-red-50 p-2">
          <Text className="text-gray-700">
            Departure: {dayjs(item.start_time).format('MMM D, YYYY')}
          </Text>
          <Text className="text-gray-700">
            Arrival: {dayjs(item.end_time).format('MMM D, YYYY')}
          </Text>
        </View>
      </View>
    </Link>
  );
};

export default function Feed() {
  const { data, isPending, isError } = useRequests();

  // if (isPending) {
  //   return (
  //     <SafeAreaView>
  //       <Text>Loading...</Text>
  //     </SafeAreaView>
  //   );
  // }
  // if (isError) {
  //   return (
  //     <SafeAreaView>
  //       <Text>Error</Text>
  //     </SafeAreaView>
  //   );
  // }
  return (
    <SafeAreaView className="mx-5 flex-1">
      <FocusAwareStatusBar />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold">Hi! There</Text>
          <Text className="font-normal text-gray-700">
            We are glad you're here
          </Text>
        </View>
        <Link href="/request/add-request">
          <Ionicons name="add-circle-outline" size={32} color="black" />
        </Link>
      </View>
      <FlashList
        data={data}
        renderItem={renderRequestsItem}
        keyExtractor={(_, index) => `item-${index}`}
        estimatedItemSize={100}
        className="mt-8"
      />
    </SafeAreaView>
  );
}
