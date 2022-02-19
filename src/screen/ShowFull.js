import React, { Fragment, useLayoutEffect, useState } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

const ShowFull = ({ navigation, route }) => {
  const { img, name } = route.params;
  const [showHeader, setshowHeader] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
      headerShown: showHeader,
    });
  }, [navigation]);
  return (
    <Fragment>
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          captureEvent={true}>
          <Image resizeMode="contain" style={{ flex: 1 }} source={{ uri: img }} />
        </ReactNativeZoomableView>
      </View>
    </Fragment>
  );
};
export default ShowFull;
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'black',
    top: 0,
    right: 0,
    left: 0,
    alignItems: 'flex-end',
    position: 'absolute',
  },
});
