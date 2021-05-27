import React from "react";
import { Easing, Animated, Platform, Alert, AsyncStorage } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

import { Block, Text, theme } from "galio-framework";

import Academic from "../screens/Academic";
import AcademicDetail from "../screens/AcademicDetail";
import Account from "../screens/Account";
import ActivityDetailTop from "../screens/ActivityDetailTop";
import ActivityPayments from "../screens/ActivityPayments";
import AgreementScreen from "../screens/AgreementScreen";
import AllActivity from "../screens/AllActivity";
import Attendance from "../screens/Attendance";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import BodwellinVideo from "../screens/BodwellinVideo";
import BruinsGallery from "../screens/BruinsGallery";
import Calendar from "../screens/Calendar";
import CampusGallery from "../screens/CampusGallery";
import Community from "../screens/Community";
import DashboardScreen from "../screens/DashboardScreen";
import Documents from "../screens/Documents";
import DocumentsView from "../screens/DocumentsView";
import Explain from "../screens/Explained";
import ExplainList from "../screens/ExplainedList";
import FeeReminders from "../screens/FeeReminders";
import FeeRemindersPDF from "../screens/FeeRemindersPDF";
import GalleryDetail from "../screens/GalleryDetail";
import LetterOfAcceptance from "../screens/LetterOfAcceptance";
import LoginScreen from "../screens/LoginScreen";
import Message from "../screens/Message";
import MessageDetail from "../screens/MessageDetail";
import MyChildActivity from "../screens/MyChildActivity";
import OutstandingBalance from "../screens/OutstandingBalance";
import ParticipationGraph from "../screens/ParticipationGraph";
import PaymentHistory from "../screens/PaymentHistory";
import PictureGalleryMenu from "../screens/PictureGalleryMenu";
import SettingsScreen from "../screens/SettingsScreen";
import StaffInvolved from "../screens/StaffInvolved";
import StudentGallery from "../screens/StudentGallery";
import StudentLife from "../screens/StudentLife";
import StudentLifeDetail from "../screens/StudentLifeDetail";
import StudentLifeVLWE from "../screens/StudentLifeVLWE";
import VideoDetail from "../screens/VideoDetail";
import WeeklyGallery from "../screens/WeeklyGallery";
import WeeklyVideo from "../screens/WeeklyVideo";


import Menu from "./Menu";
import { CustomHeader, Drawer } from "../components/";

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = "Search";

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

const HomeStack = createStackNavigator(
  {
    home: {
      screen: DashboardScreen,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader title={'home_header'} navigation={navigation} />
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#FFFFFF" //this is the backgroundColor for the app
    },
    transitionConfig
  }
);

const MessageStack = createStackNavigator(
  {
    message: {
      screen: Message,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader title={'message_header'} navigation={navigation} />
      })
    },
    messageDetail: {
      screen: MessageDetail,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title={'message_header'} navigation={navigation} />
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const AcademicStack = createStackNavigator(
  {
    academics: {
      screen: Academic,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader title={'academics_header'} navigation={navigation} />
      })
    },
    academicDetail: {
      screen: AcademicDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'academicdetail_header'} navigation={navigation} />
        )
      })
    },
    attendance: {
      screen: Attendance,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title={'attendance_header'} navigation={navigation} />
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#FFFFFF" //this is the backgroundColor for the app
    },
    transitionConfig
  }
);

const AllActivityStack = createStackNavigator(
  {
    allActivity: {
      screen: AllActivity,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'allactivities_header'} navigation={navigation} />
        )
      })
    },
    activityDetailTop: {
      screen: ActivityDetailTop,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'activitydetail_header'} navigation={navigation} />
        )
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#FFFFFF" //this is the backgroundColor for the app
    },
    transitionConfig
  }
);

const MyChildsActivityStack = createStackNavigator(
  {
    myChildsActivity: {
      screen: MyChildActivity,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'mychildsactivities_header'}
            navigation={navigation}
          />
        )
      })
    },
    activityDetailTop: {
      screen: ActivityDetailTop,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'activitydetail_header'} navigation={navigation} />
        )
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#FFFFFF" //this is the backgroundColor for the app
    },
    transitionConfig
  }
);

const ParticipationGraphStack = createStackNavigator(
  {
    participationGraph: {
      screen: ParticipationGraph,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'participationgraph_header'}
            navigation={navigation}
          />
        )
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#FFFFFF" //this is the backgroundColor for the app
    },
    transitionConfig
  }
);

const StudentLifeStack = createStackNavigator(
  {
    studentLife: {
      screen: StudentLife,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader title={'studentlife_header'} navigation={navigation} />
      })
    },
    studentLifeDetail: {
      screen: StudentLifeDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'studentlifedetail_header'}
            navigation={navigation}
          />
        )
      })
    },
    studentLifeVLWE: {
      screen: StudentLifeVLWE,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'volunteerhours_header'} navigation={navigation} />
        )
      })
    },
    childsActivity: {
      screen: MyChildsActivityStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    allActivity: {
      screen: AllActivityStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    participationGraph: {
      screen: ParticipationGraphStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#FFFFFF" //this is the backgroundColor for the app
    },
    transitionConfig
  }
);

const ExplainStack = createStackNavigator(
  {
    explain: {
      screen: Explain,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader title={'bodwellexplained_header'} navigation={navigation} />
        )
      })
    },
    explainList: {
      screen: ExplainList,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'bodwellexplained_header'}
            navigation={navigation}
          />
        )
      })
    },
    explainDetail: {
      screen: VideoDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'bodwellexplained_header'}
            navigation={navigation}
          />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const CalendarStack = createStackNavigator(
  {
    calendar: {
      screen: Calendar,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title={'calendar_header'} navigation={navigation} />
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const studentGalleryStack = createStackNavigator(
  {
    studentGallery: {
      screen: StudentGallery,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'studentlifegallery_header'}
            navigation={navigation}
          />
        )
      })
    },
    studentGalleryDetail: {
      screen: GalleryDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'studentlifegallery_header'}
            navigation={navigation}
          />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const campusGalleryStack = createStackNavigator(
  {
    campusGallery: {
      screen: CampusGallery,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'campusphotogallery_header'}
            navigation={navigation}
          />
        )
      })
    },
    campusGalleryDetail: {
      screen: GalleryDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'campusphotogallery_header'}
            navigation={navigation}
          />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const weeklyGalleryStack = createStackNavigator(
  {
    weeklyGallery: {
      screen: WeeklyGallery,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'bodwellthisweekgallery_header'}
            navigation={navigation}
          />
        )
      })
    },
    weeklyGalleryDetail: {
      screen: GalleryDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'bodwellthisweekgallery_header'}
            navigation={navigation}
          />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const bruinsGalleryStack = createStackNavigator(
  {
    bruinsGallery: {
      screen: BruinsGallery,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'bodwellbruinsgallery_header'}
            navigation={navigation}
          />
        )
      })
    },
    bruinsGalleryDetail: {
      screen: GalleryDetail,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title={'bodwellbruinsgallery_header'}
            navigation={navigation}
          />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const pictureGalleryStack = createStackNavigator(
  {
    pictureGalleryMenu: {
      screen: PictureGalleryMenu,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'picturegallery_header'} navigation={navigation} />
        )
      })
    },
    studentGalleryStack: {
      screen: studentGalleryStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    campusGalleryStack: {
      screen: campusGalleryStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    weeklyGalleryStack: {
      screen: weeklyGalleryStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    bruinsGalleryStack: {
      screen: bruinsGalleryStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const bodwellinVideoStack = createStackNavigator(
  {
    bodwellinVideo: {
      screen: BodwellinVideo,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'bodwellinvideo_header'} navigation={navigation} />
        )
      })
    },
    bodwellinVideoDetail: {
      screen: VideoDetail,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title="" navigation={navigation} />
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const weeklyVideoStack = createStackNavigator(
  {
    weeklyVideo: {
      screen: WeeklyVideo,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'weeklyvideomessages_header'} navigation={navigation} />
        )
      })
    },
    weeklyVideoDetail: {
      screen: VideoDetail,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title="" navigation={navigation} />
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const DocumentsStack = createStackNavigator(
  {
    documents: {
      screen: Documents,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title={'importantdocuments_header'} navigation={navigation} />
      })
    },
    documentsView: {
      screen: DocumentsView,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'importantdocuments_header'} navigation={navigation} />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const CommunityStack = createStackNavigator(
  {
    community: {
      screen: Community,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader title={'schoolcommunity_header'} navigation={navigation} />
        )
      })
    },
    calendar: {
      screen: CalendarStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    staffInvolved: {
      screen: StaffInvolved,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title={'staffinvolved_header'} navigation={navigation} />
        )
      })
    },
    pictureGalleryStack: {
      screen: pictureGalleryStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    bodwellinVideoStack: {
      screen: bodwellinVideoStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    weeklyVideoStack: {
      screen: weeklyVideoStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    documents: {
      screen: DocumentsStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" }
  }
);

const FeeRemindersStack = createStackNavigator(
  {
    feeReminders: {
      screen: FeeReminders,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader back title="Fee Reminders" navigation={navigation} />
      })
    },
    feeRemindersPDF: {
      screen: FeeRemindersPDF,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title="Fee Reminders (View PDF)" navigation={navigation} />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const AccountStack = createStackNavigator(
  {
    account: {
      screen: Account,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader title="My Account" navigation={navigation} />
      })
    },
    paymentHistory: {
      screen: PaymentHistory,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title="Payment History" navigation={navigation} />
        )
      })
    },
    feeReminders: {
      screen: FeeRemindersStack,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    outstandingBalance: {
      screen: OutstandingBalance,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader
            back
            title="Outstanding Balance"
            navigation={navigation}
          />
        )
      })
    },
    activityPayments: {
      screen: ActivityPayments,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title="Activity Payments" navigation={navigation} />
        )
      })
    },
    letterOfAcceptance: {
      screen: LetterOfAcceptance,
      navigationOptions: ({ navigation }) => ({
        header: (
          <CustomHeader back title="Letter of Acceptance" navigation={navigation} />
        )
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const SettingsStack = createStackNavigator(
  {
    settings: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }) => ({
        header: <CustomHeader title={'setting_title'} navigation={navigation} />
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

const LoginStack = createStackNavigator({
  login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: "locked-closed"
    })
  }
});

const AppStack = createDrawerNavigator(
  {
    home: {
      screen: HomeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer focused={focused} screen="Home" title={'home_title'} />
      })
    },
    message: {
      screen: MessageStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer focused={focused} screen="Messages" title={'message_title'} />
      })
    },
    academics: {
      screen: AcademicStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer focused={focused} screen="Academics" title={'academics_title'} />
      })
    },
    studentLife: {
      screen: StudentLifeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer
            focused={focused}
            screen="Student Life"
            title={'studentlife_title'}
          />
      })
    },
    bodwellExplained: {
      screen: ExplainStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer
            focused={focused}
            screen="Bodwell Explained"
            title={'bodwellexplained_title'}
          />
      })
    },
    schoolCommunity: {
      screen: CommunityStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer
            focused={focused}
            screen="School Community"
            title={'schoolcommunity_title'}
          />
      })
    },
    // myAccount: {
    //   screen: AccountStack,
    //   navigationOptions: navOpt => ({
    //     drawerLabel: ({ focused }) =>
    //       <Drawer focused={focused} screen="My Account" title="My Account" />
    //   })
    // },

    menuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () =>
          <Block style={{ marginVertical: 8 }}>
            <Text>{` `}</Text>
          </Block>
      }
    },
    settings: {
      screen: SettingsStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) =>
          <Drawer focused={focused} screen="Settings" title={'setting_title'} />
      })
    }
  },
  Menu
);

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    // agreement: AgreementScreen,
    login: LoginStack,
    app: AppStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);

export default createAppContainer(AppNavigator);
