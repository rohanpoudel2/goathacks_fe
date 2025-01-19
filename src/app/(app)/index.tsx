import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';

import { useRequests } from '@/api';
import type { Request } from '@/api/request';
import RoleSelectionSplashScreen from '@/components/splash-screen';
import { FocusAwareStatusBar, SafeAreaView, Text, View } from '@/components/ui';
import { translate } from '@/lib';
import { useAppState } from '@/lib/hooks/open-first-time';
import { useThemeConfig } from '@/lib/use-theme-config';

export interface Data {
  from: string;
  to: string;
  depart: string;
  arrival: string;
}

export default function Feed() {
  const { data, isPending, isError } = useRequests();
  const theme = useThemeConfig();
  const { isFirstTimeOpen } = useAppState();

  const renderRequestsItem = ({ item }: { item: Request }) => (
    <Link href={`/request/${item.request_id}`} className="mb-4 w-full ">
      <View
        className={`relative w-full rounded-lg ${
          theme.dark ? 'bg-gray-800' : 'bg-gray-100'
        } p-4`}
      >
        <View className="w-[280px] gap-5">
          <Text className="text-lg text-gray-900">
            <Text className="font-bold">{translate('request.from')}:</Text>{' '}
            {item.start_location.split(',').slice(1, -1).join(', ') ||
              item.start_location}
          </Text>
          <Text className="text-lg text-gray-900">
            <Text className="font-bold">{translate('request.to')}:</Text>{' '}
            {item.destination_location.split(',').slice(1, -1).join(', ') ||
              item.destination_location}
          </Text>
        </View>
        <View
          className={`absolute inset-y-0 right-0 flex justify-center ${
            theme.dark ? 'bg-orange-500' : 'bg-orange-100'
          }  p-2`}
        >
          <Text className="text-center text-gray-700">
            {translate('request.time')}{' '}
            {`\n ${dayjs(item.start_time).format('h:mm A')}`}
          </Text>
        </View>
      </View>
    </Link>
  );

  if (isFirstTimeOpen) {
    return <RoleSelectionSplashScreen />;
  }

  if (isPending) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (isError) {
    return (
      <SafeAreaView>
        <Text>Error</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="mx-5 flex-1">
      <FocusAwareStatusBar />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold">
            {translate('home.greetings_first')}
          </Text>
          <Text className="font-normal text-gray-700">
            {translate('home.greetings_second')}
          </Text>
        </View>
        <Link href="/request/add-request">
          <Ionicons name="add-circle" size={32} color="darkorange" />
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
