import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { Link } from 'expo-router';
import React from 'react';

import { FocusAwareStatusBar, SafeAreaView, Text, View } from '@/components/ui';

export interface Data {
  from: string;
  to: string;
  depart: string;
  arrival: string;
}

const data: Data[] = [
  {
    from: '123 Main St, UNH',
    to: 'NEW Haven',
    depart: '10:00 AM',
    arrival: '11:00 AM',
  },
  {
    from: '456 Elm St, UNH',
    to: 'Boston',
    depart: '12:00 PM',
    arrival: '2:00 PM',
  },
  {
    from: '789 Maple St, UNH',
    to: 'New York',
    depart: '3:00 PM',
    arrival: '6:00 PM',
  },
  {
    from: '101 Pine St, UNH',
    to: 'Hartford',
    depart: '7:00 AM',
    arrival: '8:30 AM',
  },
  {
    from: '202 Oak St, UNH',
    to: 'Providence',
    depart: '9:00 AM',
    arrival: '10:30 AM',
  },
  {
    from: '303 Birch St, UNH',
    to: 'Philadelphia',
    depart: '1:00 PM',
    arrival: '4:00 PM',
  },
  {
    from: '404 Cedar St, UNH',
    to: 'Washington D.C.',
    depart: '5:00 PM',
    arrival: '9:00 PM',
  },
  {
    from: '505 Spruce St, UNH',
    to: 'Baltimore',
    depart: '6:00 AM',
    arrival: '10:00 AM',
  },
  {
    from: '606 Willow St, UNH',
    to: 'Albany',
    depart: '8:00 AM',
    arrival: '11:00 AM',
  },
  {
    from: '707 Ash St, UNH',
    to: 'Buffalo',
    depart: '2:00 PM',
    arrival: '6:00 PM',
  },
  {
    from: '808 Fir St, UNH',
    to: 'Rochester',
    depart: '4:00 PM',
    arrival: '8:00 PM',
  },
  {
    from: '909 Redwood St, UNH',
    to: 'Syracuse',
    depart: '6:00 PM',
    arrival: '10:00 PM',
  },
];

const renderRequestsItem = ({ item }: { item: (typeof data)[0] }) => (
  <Link href={'/request/1'} className="mb-4 w-full ">
    <View className="relative w-full rounded-lg bg-gray-100 p-4">
      <Text className="text-lg font-bold text-gray-900">From: {item.from}</Text>
      <Text className="text-lg font-bold text-gray-900">To: {item.to}</Text>
      <View className="absolute inset-y-0 right-0 flex justify-center bg-red-50 p-2">
        <Text className="text-gray-700">{item.depart}</Text>
        <Text className="text-gray-700">{item.arrival}</Text>
      </View>
    </View>
  </Link>
);

export default function Feed() {
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
