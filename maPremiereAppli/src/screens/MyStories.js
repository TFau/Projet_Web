import React from 'react';
import {View} from 'react-native';
import {Button} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors, buttonColors} from '../utilities/constants';

// Page d'acceuil qui laisse le choix entre voire ses histoire et en creer une autre
const MyStories = ({navigation}) => {
  return (
    <LinearGradient
      colors={[gradientColors.begin, gradientColors.end]}
      style={styles.flex1}>
      <View style={styles.master}>
        <Button
          color={buttonColors[0]}
          size="large"
          type="clear"
          onPress={() => {
            navigation.navigate('ListMyStories');
          }}>
          Voir mes histoires
        </Button>
        <Button
          color={buttonColors[4]}
          size="large"
          type="clear"
          onPress={() => {
            navigation.navigate('CreateNewStory');
          }}>
          Créer une nouvelle histoire
        </Button>
      </View>
    </LinearGradient>
  );
};

export default MyStories;
