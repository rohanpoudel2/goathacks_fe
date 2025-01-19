/* eslint-disable react/react-in-jsx-scope */
import { Link } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { translate, useAuth } from '@/lib';
import { useAppState } from '@/lib/hooks/open-first-time';

export default function Settings() {
  const signOut = useAuth.use.signOut();
  const { colorScheme } = useColorScheme();
  const { setFirstTimeOpen } = useAppState();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <Text className="text-xl font-bold">
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
            <Link href="/profile">
              <Item text="settings.profile" value={''} />
            </Link>
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item
                text="settings.logout"
                onPress={() => {
                  setFirstTimeOpen(true);
                  signOut();
                }}
              />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
