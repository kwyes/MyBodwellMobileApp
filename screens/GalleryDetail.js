import React, { Component } from "react";
import { StyleSheet, TouchableHighlight, Dimensions, Share } from "react-native";
import { Block } from "galio-framework";
import GallerySwiper from "react-native-gallery-swiper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get("screen");

export default class GalleryDetail extends Component {
  constructor(props) {
    super(props);
    this.param = this.props.navigation.state.params;
    this.state = {
      fileUrl: null
    }
  }

  async downloadFile(img) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      const file = await FileSystem.downloadAsync(
        img.uri,
        FileSystem.documentDirectory + img.name
      );

      const assetLink = await MediaLibrary.createAssetAsync(file.uri);
      // console.log(file, assetLink);

      this.setState({ fileUrl: file.uri })
    }
  }

  onShare = async () => {
    try {
      const { product } = this.props;
      const { fileUrl } = this.state;

      const result = await Share.share({
        message: 'Shared from My Bodwell App.',
        url: fileUrl
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  async shareVideo(imgs, index) {
    await this.downloadFile(imgs[index]);
    this.onShare()
  }

  render() {
    const index = this.param.index;
    const data = this.param.data;

    return (
      <Block flex>
        <GallerySwiper
          images={data}
          initialPage={index}
          sensitiveScroll={false}
          styles={{ flex: 0.9 }}
          initialNumToRender={index + 1}
        />
        <TouchableHighlight onPress={() => this.shareVideo(data, index)} style={styles.footer}>
          <MaterialIcons name="share" size={24} color={"white"} />
        </TouchableHighlight>
      </Block>

    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    flexDirection: "row"
  },
  footer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "black",
    paddingHorizontal: 20
  }
});
