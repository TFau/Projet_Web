import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors} from '../utilities/constants';

/**
 * @class Title
 * @extends Component
 * @description Component to display a preview of a paragraph
 * @param {string} title - The title to display
 * @param {function touchFunction()} - The function to call when the preview is touched {
 }}
 */
export default class Title extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _onPressButton = () => {
      try {
        this.props.touchFunction();
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <TouchableOpacity style={customStyles.preview} onPress={_onPressButton}>
        <LinearGradient
          colors={[gradientColors.begin, gradientColors.end]}
          style={styles.flex1}>
          <View style={{padding: 15}}>
            <Text h3 style={styles.header}>
              {this.props.title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const customStyles = StyleSheet.create({
  preview: {
    width: '96%',
    borderWidth: 2,
    borderRadius: 10,
    margin: '2%',
  },
});
