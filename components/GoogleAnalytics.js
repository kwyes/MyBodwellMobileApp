import React, { Component } from "react";
import { Analytics, PageHit, ScreenHit, Event } from "expo-analytics";

//admin.google@bodwell.edu (for TEST)
// const analytics = new Analytics("UA-154379248-1");

//online@bodwell.edu
const analytics = new Analytics("UA-11541432-8");

export default class GoogleAnalytics extends Component {
  _pageHit = screenName => {
    analytics.hit(new ScreenHit(screenName))
      .catch(e => console.log(e.message));
  };

  _videoPlayEvent = videoCategory => {
    analytics.event(new Event('Video', 'Play', videoCategory, 123))
      .catch(e => console.log(e.message));
  };
}