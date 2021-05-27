import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from "prop-types";

function SemesterInfo({sDate,eDate,semesterName})  {
  return (
    <Text>{sDate}</Text>
  )
}
SemesterInfo.propTypes = {
  sDate:PropTypes.string,
  eDate:PropTypes.string,
  semesterName:PropTypes.string,
}

export default SemesterInfo;

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})
