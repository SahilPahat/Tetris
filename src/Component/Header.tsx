import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ViewProps,
} from 'react-native';
import React from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../Constants';

export type Props = ViewProps & {
  header: string;
  backButton?: boolean | true;
  pauseButton?: boolean | false;
  onPause?: () => void
};

const Header = ({header, backButton, pauseButton, onPause}: Props) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        style.container,
        {
          height:
            Platform.OS == 'ios'
              ? (SCREEN_HEIGHT * 13) / 100
              : (SCREEN_HEIGHT * 10) / 100,
        //   left: 1,
          paddingTop: Platform.OS == 'android' ? SCREEN_HEIGHT * 0.03 : 0.01,
        },
      ]}>
      {backButton ? (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons name={'chevron-left'} size={45} color={COLORS.BLACK} />
        </TouchableOpacity>
      ) : (
        <View style={{width: 20}}></View>
      )}

      <Text
        style={[
          style.headerstyle,
          {
            color: COLORS.BLACK,
            fontFamily: 'Verdana',
            width: SCREEN_WIDTH * 0.6,
            textAlign: 'center',
          },
        ]}>
        {header}
      </Text>
      {pauseButton ? (
        <TouchableOpacity onPress={onPause}>
          <Icons name={'play'} size={45} color={COLORS.BLACK} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPause}>
          <Icons name={'pause'} size={45} color={COLORS.BLACK} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerstyle: {
    fontWeight: '700',
    fontSize: 19,
  },
});
export default Header;
