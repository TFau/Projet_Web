import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors} from '../utilities/constants';

/**
 * @class Preview
 * @extends Component
 * @description Component to display a preview of a paragraph
 * @param {string} title - The title to display
 * @param {string} contentPreview - The preview of the 1st paragraph to display
 * @param {string[]} authors - The list of all the authors of the story
 * @param {function touchFunction()} - The function to call when the preview is touched {
 }}
 */
export default class Preview extends Component {
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

    // On génère le string pour afficher les auteurs
    let authors = 'Auteurs :';
    for (let i = 0; i < this.props.authors.length; i++) {
      authors += ' ' + this.props.authors[i] + ',';
    }
    authors = authors.substring(0, authors.length - 1);

    return (
      <TouchableOpacity style={customStyles.preview} onPress={_onPressButton}>
        <LinearGradient
          colors={[gradientColors.begin, gradientColors.end]}
          style={styles.flex1}>
          <View style={{padding: 15}}>
            <Text h3 style={styles.header}>
              {this.props.title}
            </Text>
            <Text style={styles.text}>
              {this.props.contentPreview.substring(0, 50) + ' ...'}
            </Text>
            <Text style={styles.text}>{authors}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const customStyles = StyleSheet.create({
  preview: {
    minHeight: 200,
    width: '96%',
    borderWidth: 2,
    borderRadius: 10,
    margin: '2%',
  },
});
