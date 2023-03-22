import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors, buttonColors} from '../utilities/constants';

/**
 * @class Paragraph
 * @extends Component
 * @description Component to display a paragraph
 * @param {string} title - The title to display
 * @param {string} content - The content to display
 * @param {boolean} edition - If the paragraph is in edition mode
 * @param {string} author - The author of the paragraph
 * @param {string[]} choices - The choices to display
 * @param {string} username - The username of the user
 * @param {Object} navigation - The navigation object
 * @param {int[]} jumpParagraphId - The id of the paragraph to jump to for each choice
 * @param {string} storyName - The name of the story
 * @param {int} userId - The id of the user
 * @param {int} token - The token of the user
 * @param {int[]} authorizedParagraphs - The id of the paragraph that are authorized to be displayed (have an end)
 * @param {Object} history - The history object
 */
export default class Paragraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const edition = this.props.edition;

    // If username is not defined, the paragraph is being displayed in public mode, so the page to navigate into is different

    // List of buttons that are the possible choices
    var buttons;
    if (this.props.choices.length > 0) {
      buttons = [<Text style={styles.text}>Que faire ?</Text>];
      for (let i = 0; i < this.props.choices.length; i++) {
        buttons.push(
          <Button
            color={buttonColors[i % 5]}
            round
            size="large"
            onPress={() => {
              console.log(
                'Navigation au paragraphe : ' + this.props.jumpParagraphId[i],
              );
              if (this.props.username !== undefined) {
                if (edition) {
                  this.props.navigation.push('EditParagraphScreen', {
                    paragraphId: this.props.jumpParagraphId[i],
                    username: this.props.username,
                    storyName: this.props.storyName,
                    token: this.props.token,
                    history: this.props.history,
                    userId: this.props.userId,
                  });
                } else {
                  this.props.navigation.push('ReadParagraphScreen', {
                    paragraphId: this.props.jumpParagraphId[i],
                    username: this.props.username,
                    storyName: this.props.storyName,
                    token: this.props.token,
                    history: this.props.history,
                    userId: this.props.userId,
                    authorizedParagraphs: this.props.authorizedParagraphs,
                  });
                }
              } else {
                this.props.navigation.push('PublicReadParagraphScreen', {
                  paragraphId: this.props.jumpParagraphId[i],
                  storyName: this.props.storyName,
                  history: this.props.history,
                  authorizedParagraphs: this.props.authorizedParagraphs,
                });
              }
            }}>
            {this.props.choices[i]}
          </Button>,
        );
      }
    } else {
      // On triche un peu, on utilise la variable bouton pour afficher du texte, disant soit qu'il n'y a pas de choix actuelement (en mode édition), soit qu'il s'agit d'une conclusion (en mode lecture6)
      if (edition) {
        buttons = [
          <Text style={styles.textWarning}>
            Il n'y a actuelement pas de choix créés pour ce paragraphe
          </Text>,
        ];
      } else {
        buttons = [
          <Text style={styles.textWarning}>
            Bravo, vous avez fini l'histoire !!
          </Text>,
        ];
      }
    }
    buttons = React.Children.toArray(buttons); // Permet de regler le problème machin unique key

    if (!edition) {
      return (
        <View>
          <LinearGradient
            colors={[gradientColors.begin, gradientColors.end]}
            style={styles.flex1}>
            <View style={styles.master}>
              <Text h3 style={styles.header}>
                {this.props.title}
              </Text>
              {this.props.text !== '' ? (
                <Text style={styles.text}>{this.props.content}</Text>
              ) : (
                <Text style={styles.textWarning}>
                  Paragraphe en cours de rédaction
                </Text>
              )}
              {buttons}
            </View>
          </LinearGradient>
        </View>
      );
    } else {
      return (
        <View>
          <LinearGradient
            colors={[gradientColors.begin, gradientColors.end]}
            style={styles.flex1}>
            <View style={styles.master}>
              <Text h3 style={styles.header}>
                {this.props.title}
              </Text>
              {this.props.content !== null ? (
                <Text style={styles.text}>{this.props.content}</Text>
              ) : (
                <Text style={styles.textWarning}>
                  Paragraphe en cours de rédaction
                </Text>
              )}
              {buttons}
              <Text style={styles.text} muted>
                Auteur: {this.props.author}
              </Text>
            </View>
          </LinearGradient>
        </View>
      );
    }
  }
}
