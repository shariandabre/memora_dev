import React, { ForwardedRef, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import CreateIdea from '~/components/createIdea';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import { FullWindowOverlay } from 'react-native-screens';
export default function Sheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isDarkColorScheme } = useColorScheme();
  const [snapPoints, setSnapPoints] = useState(['90%']);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        enableContentPanningGesture={false}
        snapPoints={snapPoints}
        backgroundStyle={isDarkColorScheme ? styles.darkBackground : styles.lightBackground}
        style={{
          borderColor: isDarkColorScheme ? NAV_THEME.dark.border : NAV_THEME.light.border,
          borderWidth: 1,
          borderRadius: 15,
        }}
        handleIndicatorStyle={
          isDarkColorScheme ? styles.darkHandleIndicator : styles.lightHandleIndicator
        }>
        <BottomSheetView style={styles.contentContainer}>
          <CreateIdea setSnapPoints={setSnapPoints} />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    display: 'flex',
  },
  darkBackground: {
    backgroundColor: '#1a1b25',
  },
  lightBackground: {
    backgroundColor: '#ffffff',
  },
  darkHandleIndicator: {
    backgroundColor: '#ffffff',
  },
  lightHandleIndicator: {
    backgroundColor: '#1a1b25',
  },
});
