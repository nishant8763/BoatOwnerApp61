// import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-crop-picker';
// import Share from 'react-native-share';


class mediaProvider {

  ShareImage= async (file_url,message1,subject)=>{
    let dirs = RNFetchBlob.fs.dirs
    let imagePath = null;
    RNFetchBlob.config({
        fileCache: true  
    })
    .fetch("GET", file_url)
    // the image is now dowloaded to device's storage
    .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile("base64");
    })
    .then(async base64Data => {
        var base64Data = `data:image/png;base64,` + base64Data;
        // here's base64 encoded image
        await Share.open({ url: base64Data,title:message1,subject:subject ,message:message1});
        // remove the file from storage
        // return dirs.unlink(imagePath);
    });
  }

  //     launchImageLibrary (){

  //       const options = {
  //             storageOptions: {
  //               skipBackup: true,
  //               path: 'images',
  //             },
  //             mediaType: 'photo',
  //             quality: 1,
  //         };

  //       ImagePicker.launchImageLibrary(options, (response) => {
  //         //Alert.alert('Response = ', JSON.stringify(response));

  //         if (response.didCancel) {
  //           //Alert.alert('User cancelled image picker');
  //         } else if (response.error) {
  //           //Alert.alert('ImagePicker Error: ', response.error);
  //         } else if (response.customButton) {
  //           //Alert.alert('User tapped custom button: ', response.customButton);
  //           //Alert.alert(response.customButton);
  //         } else {
  //           Alert.alert('response', JSON.stringify(response));
  //           return response;
  //         }
  //       });

  //     }
  // }

  launchCamera = async () => {
    let result = 3
    let resultt = await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }

  }

  launchGellery = async () => {
    let result = 3
    let resultt = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }
  }
  vedioRecorder = async () => {
    let result = 3
    let resultt = await ImagePicker.openCamera({
      mediaType: 'video',
      width: 300,
      height: 400,
      includeBase64: true,
      duration: 3,
      cropping: false,
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }
  }
}

export const mediaprovider = new mediaProvider();

