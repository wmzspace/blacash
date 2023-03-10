import * as React from 'react';
import {serverIPP} from '../values/strings';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  HelperText,
  Searchbar,
  Text,
  TextInput,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import ScreenWrapper from '../@components/ScreenWrapper';
import {globalVal, userInfo} from '../values/global';
import {getNftImgs} from '../apis/api';
import styles from '../styles';
import {readFile, uploadFile, write_file, writeFile} from '../apis/ProcessFile';
import {useCallback, useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {theme} from '../ui/themes_old';
import {PreferencesContext} from '../context/preference';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {length} from 'deepmerge';

export const UploadScreen = () => {
  const [url, setUrl] = React.useState('');
  const [nftName, setNftName] = React.useState('');
  const [nftDescription, setNftDescription] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [fee, setFee] = React.useState(0);
  const [remark, setRemark] = React.useState('');
  const [uploadPercentage, setUploadPercentage] = React.useState(0);

  const uploadData = () => {
    fetch('http://' + serverIPP + '/upload', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        url: globalVal.uploadUrl,
        nftName: nftName,
        nftDescription: nftDescription,
        owner: userInfo.email,
        fee: fee,
        remark: remark,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(_res => {
      if (_res.ok) {
        _res.text().then(_resData => {
          // console.log(resData);
          let _resDataConverted = JSON.parse(_resData);
          console.log(_resData);
          Alert.alert(
            '???????????????',
            '????????????:' +
              _resDataConverted.nftName +
              '\n' +
              '????????????:' +
              _resDataConverted.nftDescription +
              '\n' +
              '??????:' +
              _resDataConverted.fee +
              '\n' +
              '??????:' +
              _resDataConverted.remark,
          );
          // Alert.alert('???????????????', resData.fileName);
          console.log('FINISH: ' + globalVal.uploadUrl);
          console.log('');
          console.log('');
        });
      } else {
        Alert.alert('????????????', 'error', [
          {text: '??????', onPress: () => console.log('OK Pressed!')},
        ]);
      }
    });
  };

  const [fileResponse, setFileResponse] = useState([]);
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });

      // RNFS.readFile(response[0].uri, 'base64')
      //   .then(content => {
      //     // data:image/jpeg;base64,
      //     // ???????????????????????? ??????????????? ???????????????????????????????????????????????????????????????
      //     // params.idImage = content;
      //     //TODO:
      //     // ??????????????????, content??? base64 ?????????????????????
      //     fetch('http://' + serverIPP + '/uploadImg', {
      //       method: 'POST',
      //       mode: 'cors',
      //       body: content,
      //       headers: {
      //         Accept: 'application/json',
      //         // 'Content-Type': 'application/x-www-form-urlencoded',
      //         'Content-Type': 'image/png',
      //         // 'Content-Type': 'image/jpeg',
      //       },
      //     });
      //   })
      //   .catch(err => {
      //     // toastShort('??????????????????');
      //     console.log(err);
      //   });

      console.log(response);
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const theme = useTheme();
  const {toggleTheme, isThemeDark} = React.useContext(PreferencesContext);

  return (
    <ScrollView>
      <View style={[styles.innerContainer, {marginVertical: 30}]}>
        <Text style={{fontSize: 25}}>????????????</Text>
        <View style={{marginVertical: 30}}>
          <TextInput
            mode="outlined"
            label="????????????"
            style={{width: 300}}
            placeholder={
              fileResponse[0]?.name.length > 15
                ? fileResponse[0]?.name.substring(0, 15) + '...'
                : fileResponse[0]?.name
            }
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            clearButtonMode="always"
            selectionColor="skyblue"
            maxLength={50}
            onChangeText={_nftName => {
              setNftName(_nftName);
              // setUserName(_userName);
              // setUserNameValidation(_userName.length >= 6);
              // dispatch({type: 'userName', userName: userName});
            }}
            // left={<TextInput.Icon icon="account" />}
            // left={<TextInput.Affix text="1" />}
          />

          <TextInput
            mode="outlined"
            label="????????????"
            style={{width: 300}}
            // placeholder={
            //   fileResponse[0]?.name.length > 15
            //     ? fileResponse[0]?.name.substring(0, 15) + '...'
            //     : fileResponse[0]?.name
            // }
            placeholder="????????????"
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            clearButtonMode="always"
            selectionColor="skyblue"
            maxLength={50}
            onChangeText={_nftDescription => {
              setNftDescription(_nftDescription);
              // setUserName(_userName);
              // setUserNameValidation(_userName.length >= 6);
              // dispatch({type: 'userName', userName: userName});
            }}
            // left={<TextInput.Icon icon="account" />}
            // left={<TextInput.Affix text="1" />}
          />

          <TextInput
            mode="outlined"
            label="??????"
            style={{width: 300}}
            // placeholder={
            //   fileResponse[0]?.name.length > 15
            //     ? fileResponse[0]?.name.substring(0, 15) + '...'
            //     : fileResponse[0]?.name
            // }
            placeholder="????????????"
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            clearButtonMode="always"
            selectionColor="skyblue"
            maxLength={50}
            onChangeText={_fee => {
              setFee(parseInt(_fee, 10));
              // setUserName(_userName);
              // setUserNameValidation(_userName.length >= 6);
              // dispatch({type: 'userName', userName: userName});
            }}
            // left={<TextInput.Icon icon="account" />}
            // left={<TextInput.Affix text="1" />}
          />

          <TextInput
            mode="outlined"
            label="??????"
            style={{width: 300}}
            // placeholder={
            //   fileResponse[0]?.name.length > 15
            //     ? fileResponse[0]?.name.substring(0, 15) + '...'
            //     : fileResponse[0]?.name
            // }
            placeholder="????????????????????????"
            placeholderTextColor={isThemeDark ? 'gray' : 'gray'}
            underlineColor={isThemeDark ? 'gray' : 'rgba(47,100,125,0.26)'}
            clearButtonMode="always"
            selectionColor="skyblue"
            maxLength={50}
            onChangeText={_remark => {
              setRemark(_remark);
              // setUserName(_userName);
              // setUserNameValidation(_userName.length >= 6);
              // dispatch({type: 'userName', userName: userName});
            }}
            // left={<TextInput.Icon icon="account" />}
            // left={<TextInput.Affix text="1" />}
          />
        </View>

        {/*<HelperText type="error" style={{display: true ? 'none' : 'flex'}}>*/}
        {/*  ??????????????????6?????????*/}
        {/*</HelperText>*/}

        <View
          style={[
            // styles.inlineFlex,
            {marginVertical: 20, justifyContent: 'space-evenly'},
          ]}>
          <Button
            onPress={handleDocumentSelection}
            // style={{marginRight: 60}}
            labelStyle={{fontSize: 18}}>
            ????????????
          </Button>

          {/*<Button*/}
          {/*  labelStyle={{fontSize: 18}}*/}
          {/*  onPress={() => {*/}
          {/*    fetch('http://' + serverIPP + '/upload', {*/}
          {/*      method: 'POST',*/}
          {/*      mode: 'cors',*/}
          {/*      body: JSON.stringify({*/}
          {/*        url: 'http://waa.cool:4000/public/nft_img/1676822586623-2134.jpg',*/}
          {/*        nftName: '????????????',*/}
          {/*        nftDescription: '??????????????????????????????',*/}
          {/*        owner: userInfo.email,*/}
          {/*        fee: 2.0,*/}
          {/*      }),*/}
          {/*      headers: {*/}
          {/*        Accept: 'application/json',*/}
          {/*        'Content-Type': 'application/x-www-form-urlencoded',*/}
          {/*      },*/}
          {/*    }).then(res => {*/}
          {/*      if (res.ok) {*/}
          {/*        res.text().then(resData => {*/}
          {/*          // console.log(resData);*/}
          {/*          Alert.alert('???????????????', resData);*/}
          {/*        });*/}
          {/*      } else {*/}
          {/*        Alert.alert('????????????', 'error', [*/}
          {/*          {text: '??????', onPress: () => console.log('OK Pressed!')},*/}
          {/*        ]);*/}
          {/*      }*/}
          {/*    });*/}
          {/*  }}>*/}
          {/*  ??????*/}
          {/*</Button>*/}

          <Button
            labelStyle={{fontSize: 18}}
            onPress={() => {
              write_file(fileResponse[0]);
            }}>
            ??????WriteFile
          </Button>
          <Button
            labelStyle={{fontSize: 18}}
            onPress={() => {
              readFile();
            }}>
            ??????ReadFile
          </Button>
          <Button
            labelStyle={{fontSize: 18}}
            onPress={async () => {
              if (!userInfo.email.length) {
                Alert.alert('??????????????????', '????????????');
                return;
              }
              // write_file(fileResponse[0]);
              console.log(fileResponse[0]);
              setUploadPercentage(0);
              let temp = setInterval(async () => {
                try {
                  const value = await AsyncStorage.getItem('@uploadPercentage');
                  if (value !== null) {
                    // value previously stored
                    let pValue = JSON.parse(value);
                    // console.log(pValue.value);
                    setUploadPercentage(pValue.value);
                    if (pValue.value === 1) {
                      clearTimeout(temp);
                    }
                  }
                } catch (e) {
                  // error reading value
                  console.log(e);
                }
              }, 1);

              await write_file(fileResponse[0]);

              uploadFile(fileResponse[0]).then(() => {
                if (fileResponse.length) {
                  uploadData();
                  setTimeout(() => {
                    clearTimeout(temp);
                  }, 3000);
                } else {
                  clearTimeout(temp);
                }
              });
            }}>
            ??????
          </Button>

          {/*<Button labelStyle={{fontSize: 18}} onPress={getPercentage}>*/}
          {/*  ??????*/}
          {/*</Button>*/}
          <ProgressBar progress={uploadPercentage} indeterminate={false} />
          {/*<ProgressBar*/}
          {/*  progress={parseInt()}*/}
          {/*/>*/}
        </View>
        {fileResponse.map((file, index) => (
          <View key={index.toString()}>
            <Text
              style={{paddingBottom: 20}}
              numberOfLines={1}
              ellipsizeMode={'middle'}
              // style={styles.uri}
            >
              {file?.name}
            </Text>
            <Image
              source={{uri: file?.uri}}
              // style={{width: 330, height: 450}}
              style={{width: 300, height: 500, alignSelf: 'center'}}
              resizeMode="contain"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
