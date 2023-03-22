import React, {useState, useContext} from 'react';
import {
  ToastAndroid,
  Alert,
  View,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Title from '../utilities/Title';
import {styles} from '../utilities/constants';
import {BaseURLLogged} from '../utilities/backend';
import {Icon} from 'galio-framework';
import {AuthContext} from '../context/context';

// Cette page liste tous les titre des histoires qu'on peut éditer (publiques et celles auquelles on a été invité)
const ShowEditableStories = ({navigation}) => {
  // Content va etre la liste des histoires
  const [content, setContent] = useState(null);

  // Gestion du chargement de la page et de l'actualisation
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const {unlockParagraph} = useContext(AuthContext);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  // Petit morceau de code qu'on utilise pour implémenter le "scroll down to refresh"
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsLoading(true); // Va actualiser la page
    wait(2000).then(() => setRefreshing(false)); // Pour une belle animation
  }, []);

  const getPreviews = (value, navigation) => {
    let title = []; // Liste de titre qui sera affichée à l'écran
    let storiesId = []; // Liste des id des histoires associées à previews

    const loginState = value.getData();

    fetch(BaseURLLogged + '/' + loginState.name + '/story/edit/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: loginState.token,
      },
    })
      .then(response => {
        console.log(
          "\nGET à l'adresse ",
          BaseURLLogged + '/' + loginState.name + '/story/edit/get',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Stories found.') {
              // data.data est une liste d'objet "histoire" de type {liste de choix, nom, ouvert?, id du paragraphe, lisible?, id, 1er paragraphe, id_créateur}
              data.data.forEach(story => {
                // On ajoute une preview à la liste
                title.push(
                  <Title
                    key={story.story_storyId}
                    title={story.name}
                    touchFunction={() => {
                      navigation.navigate('EditParagraphScreen', {
                        paragraphId: 1,
                        username: loginState.name,
                        storyName: story.name,
                        token: loginState.token,
                        history: [],
                        userId: loginState.userId,
                      });
                    }}
                  />,
                );
                // On ajoute l'id de l'histoire à la liste
                storiesId.push(story.story_storyId);
              });
              console.log('Liste des titre à afficher : ', title);
              title = React.Children.toArray(title);
              setContent(title);
            } else {
              ToastAndroid.show(
                'Echec du chargement des histoires.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(err => {
            ToastAndroid.show(
              'Echec du chargement des histoires.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            console.log('err', err);
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Echec du chargement des histoires.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  return (
    <AuthContext.Consumer>
      {value => {
        if (isLoading) {
          setIsLoading(false);
          getPreviews(value, navigation);
        }
        return (
          <View style={styles.flex1}>
            <ScrollView
              style={(styles.struct, {marginTop: 30})}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              {content}
            </ScrollView>
            <TouchableHighlight
              style={{position: 'absolute', top: 10, right: 10}}
              onPress={() => {
                Alert.alert(
                  'Aide',
                  "Pour éditer, il suffit de parcourir l'histoire jusqu'à trouver le paragraphe que vous voulez éditer, et ensuite, pour ajouter des choix, cliquez sur ajouter un choix (max 5 choix). Pour créer un paragraphe après ce choix, cliquez sur le choix ajouté, et selectionnez demander l'écriture. Si vous avez rédigé un paragraphe, vous aurez accès à des fonctionnalités suplémentaires en étant dans la vue du paragraphe",
                );
              }}>
              <View>
                <Icon name="help-with-circle" family="Entypo" size={30} />
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={{position: 'absolute', bottom: 20, right: 10}}
              onPress={() => {
                Alert.alert(
                  'Aide',
                  "Si une rédaction est en cours mais que vous n'y avez pas accès, cliquez ici pour forcer l'abandon de la rédaction",
                  [
                    {
                      text: 'Annuler',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'Abandonner', onPress: () => unlockParagraph()},
                  ],
                );
              }}>
              <View>
                <Icon name="ccw" family="Entypo" size={30} />
              </View>
            </TouchableHighlight>
          </View>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default ShowEditableStories;
