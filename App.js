import React from 'react';
import { Platform, StatusBar, Image } from 'react-native';
import { AppLoading, Asset } from 'expo';
import { Block, GalioProvider } from 'galio-framework';
import * as Font from 'expo-font'

import Screens from './navigation/Screens';
import { Images, materialTheme } from './constants/';
import { FontAwesome } from '@expo/vector-icons';
import { Style } from 'victory-native';
import { lang } from 'moment';

// const assetImages = [
//   Images.Profile,
//   Images.Avatar,
//   Images.Onboarding,
//   Images.Products.Auto,
//   Images.Products.Motocycle,
//   Images.Products.Watches,
//   Images.Products.Makeup,
//   Images.Products.Accessories,
//   Images.Products.Fragrance,
//   Images.Products.BMW,
//   Images.Products.Mustang,
//   Images.Products['Harley-Davidson'],
// ];

// cache product images
// products.map(product => assetImages.push(product.image));

// cache categories images
// Object.keys(categories).map(key => {
//   categories[key].map(category => assetImages.push(category.image));
// });



function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fontLoaded: false }
  }

  async componentDidMount() {
    await Font.loadAsync({
      Black: require('./assets/fonts/Avenir95Black.otf'),
      BlackOblique: require('./assets/fonts/Avenir95BlackOblique.otf'),
      Light: require('./assets/fonts/Avenir35Light.otf'),
      LightOblique: require('./assets/fonts/Avenir35LightOblique.otf'),
      Book: require('./assets/fonts/Avenir45Book.otf'),
      BookOblique: require('./assets/fonts/Avenir45BookOblique.otf'),
      Oblique: require('./assets/fonts/Avenir55Oblique.otf'),
      Roman: require('./assets/fonts/Avenir55Roman.otf'),
      Medium: require('./assets/fonts/Avenir65Medium.otf'),
      MediumOblique: require('./assets/fonts/Avenir65MediumOblique.otf'),
      Heavy: require('./assets/fonts/Avenir85Heavy.otf'),
      HeavyOblique: require('./assets/fonts/Avenir85HeavyOblique.otf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    if (!this.state.fontLoaded) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={materialTheme}>
          <Block flex>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <Screens />
          </Block>
        </GalioProvider>
      );
    }
  }

  // _loadResourcesAsync = async () => {
  //   return Promise.all([
  //     ...cacheImages(assetImages),
  //   ]);
  // };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
