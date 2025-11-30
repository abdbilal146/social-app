import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import CustomizeActionSheet from './components/CustomizeActionSheet';
import { ActionSheetProvider, useActionSheet } from '@/contexts/ActionSheetContext';
import { DrawerProvider, useDrawer } from '@/contexts/DrawerContext';
import CustomizeDrawer from './components/CustomizeDrawer';

function RootLayoutContent() {
  const { isOpen, closeActionSheet, body } = useActionSheet();
  const { isOpen: isDrawerOpen, closeDrawer, body: drawerBody } = useDrawer();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <CustomizeActionSheet children={body} isOpen={isOpen} onClose={closeActionSheet} />
      <CustomizeDrawer children={drawerBody} isOpen={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <ActionSheetProvider>
        <DrawerProvider>
          <RootLayoutContent />
        </DrawerProvider>
      </ActionSheetProvider>
    </GluestackUIProvider>
  );
}

