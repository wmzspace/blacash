import * as React from 'react';
import {serverIPP} from '../values/strings';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import ScreenWrapper from '../@components/ScreenWrapper';
import {globalVal, userInfo} from '../values/global';
import {getNftImgs} from '../apis/api';

export const OwnedGallery = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getNftImgs();
    setTimeout(() => {
      setRefreshing(false), 1000;
    });
    // getNftImgs();
  }, []);

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const [nftImgs, setnftImgs] = React.useState([]);

  // console.log(nftImgs);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        onSubmitEditing={() => {
          Alert.alert('搜索功能暂未启用');
        }}
        // theme={theme}
      />
      <Text style={{textAlign: 'center', marginVertical: 10, fontSize: 20}}>
        Owned Ntfs ({userInfo.ownedNfts?.length})
      </Text>
      <ScreenWrapper contentContainerStyle={styles.content}>
        {userInfo.ownedNfts?.map((nftImg, index) => {
          return (
            <View key={nftImg?.id} style={styles.item}>
              <Image source={{uri: nftImg?.url}} style={styles.photo} />
            </View>
          );
        })}
      </ScreenWrapper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      content: {
        // there is no 'grid' type in RN :(
        display: 'grid' as 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: 8,
      },
      item: {
        width: '100%',
        height: 150,
      },
    },
    default: {
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
        padding: 4,
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
  screen: {
    flex: 1,
  },
});
