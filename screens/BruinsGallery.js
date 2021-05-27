import React, { Component } from "react";
import { StyleSheet, Dimensions, TouchableOpacity, ScrollView, AsyncStorage } from "react-native";
import { Block } from "galio-framework";
import { LoadingScreen } from "../components";
import { Image } from "react-native-expo-image-cache";

const { width } = Dimensions.get("screen");

export default class BruinsGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        };
    }

    async componentDidMount() {
        var cantoFldr = await AsyncStorage.getItem("Canto-BruinsGallery");
        this._getMedia(cantoFldr);
    }

    redirectStudentGalleryDetail = (images, key) => {
        const { navigation } = this.props;
        if (key != null) {
            navigation.navigate("bruinsGalleryDetail", {
                data: images,
                index: key
            });
        } else {
            Alert.alert("Sign Out and Try Again");
        }
    };

    _getMedia(cantoFldr) {
        fetch(`https://api-m.bodwell.edu/api/cantoApi/album/${cantoFldr}/50`)
            .then(response => response.json())
            .then(json => {
                if (json.found > 0) {
                    var tmp_img = json["results"]
                    var imgs = [];
                    for (let i = 0; i < tmp_img.length; i++) {
                        var height = 0;
                        var width = 0;

                        if (parseInt(tmp_img[i].width) >= parseInt(tmp_img[i].heigth)) {
                            width = 1920;
                            height = 1080;
                        } else {
                            width = 1080;
                            height = 1920;
                        }

                        imgs.push({
                            uri: "https://bodwell.canto.com/preview/image/" + tmp_img[i].id + "/840",
                            width: width,
                            height: height,
                            name: tmp_img[i].name
                        })
                    }
                    this.setState({
                        images: imgs
                    });
                } else {
                    Alert.alert(translate('error_text_nodata'));
                }
            });
    }

    render() {
        const { images } = this.state;

        if (images[0]) {
            return (
                <ScrollView
                    contentContainerStyle={styles.scrollview}
                    onContentSizeChange={this.onContentSizeChange}
                    showsVerticalScrollIndicator={false}
                >
                    <Block flex row style={{ flexWrap: "wrap" }}>
                        {images.map((data, key) =>
                            <TouchableOpacity
                                onPress={() => this.redirectStudentGalleryDetail(images, key)}
                                style={styles.image}
                                key={key}
                            >
                                <Image style={{ flex: 1 }} {...{ uri: data.uri }} />

                            </TouchableOpacity>
                        )}
                    </Block>
                </ScrollView>
            );
        } else {
            return (
                <LoadingScreen />
            );
        }
    }
}

const styles = StyleSheet.create({
    scrollview: {
        flexGrow: 1
    },
    image: {
        maxWidth: width / 4,
        height: width / 4,
        flexBasis: "25%",
        marginVertical: 0.5,
        padding: 1
    }
});
