import React from "react";
import { DrawerItems } from "react-navigation";
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { Drawer } from "../components/";
import { Block, Text, theme } from "galio-framework";
import * as SecureStore from "expo-secure-store";

import { Icon } from "../components/";
import { Images, materialTheme } from "../constants/";

const { width } = Dimensions.get("screen");

const CustomDrawer = props =>
  <Block
    style={styles.container}
    forceInset={{ top: "always", horizontal: "never" }}
  >
    <Block flex>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.scrollview}>
        <DrawerItems {...props} />
        <TouchableOpacity onPress={() => this._clearStorage(props)} style={styles.logoutContainer}>
          <Drawer title={'logout_title'} />
        </TouchableOpacity>
      </ScrollView>
    </Block>
  </Block>;


_clearStorage = async (props) => {
  this.rememberLang();
  await AsyncStorage.clear();
  props.navigation.navigate("AuthLoading");
};

rememberLang = async () => {
  // const { id, password, saveID } = this.state;
  // const credentials = { id, password, saveID };
  try {
    var LanguageAsync = await AsyncStorage.getItem("language");
    await SecureStore.setItemAsync("langInfo", JSON.stringify(LanguageAsync));
  } catch (e) {
    console.log(e);
  }
};

const Menu = {
  contentComponent: props => <CustomDrawer {...props} />,
  drawerBackgroundColor: "#dfe4ea",
  drawerWidth: width * 0.75,
  contentOptions: {
    activeTintColor: "white",
    inactiveTintColor: "#000",
    activeBackgroundColor: "transparent",
    itemStyle: {
      width: width * 0.7,
      backgroundColor: "transparent"
    },
    labelStyle: {
      fontSize: 16,
      marginLeft: 12,
      fontWeight: "normal"
    },
    itemsContainerStyle: {
      // paddingVertical: 46,
      paddingTop: 46,
      paddingBottom: 0,
      paddingHorizonal: 12,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      overflow: "hidden"
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2
  },
  logoutContainer: {
    width: width * 0.7,
    paddingLeft: 1
  },
  scrollview: {
    alignItems: "center"
  }
});

export default Menu;
