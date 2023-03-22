import React, {useState} from 'react';
import {ToastAndroid, ScrollView, RefreshControl} from 'react-native';
import Preview from '../utilities/Preview';
import {styles} from '../utilities/constants';
import {BaseURLLogged} from '../utilities/backend';
import {AuthContext} from '../context/context';

// Le home screen fait une liste de preview des histoires qu'on peut lire.
const HomeScreen = ({navigation}) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

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
    let previews = []; // Liste de previews qui sera affichée à l'écran
    let storiesId = []; // Liste des id des histoires associées à previews

    const loginState = value.getData();

    // Requete pour récupérer les histoires : titre + premier paragraphe + ID de l'histoire
    fetch(BaseURLLogged + '/' + loginState.name + '/story/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: loginState.token,
      },
    })
      .then(response => {
        console.log(
          "GET à l'adresse ",
          BaseURLLogged + '/' + loginState.name + '/story/get',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Stories found.') {
              // data.data est une liste d'objet "histoire" de type {liste de choix, nom, ouvert?, id du paragraphe, lisible?, id, 1er paragraphe, id_créateur}
              data.data.forEach(story => {
                // On ajoute une preview à la liste seulement si l'histoire est publiée (readable = true)
                if (story.readable) {
                  let authors = [];
                  story.authors.forEach(object =>
                    authors.push(object.username),
                  );
                  previews.push(
                    <Preview
                      key={story.story_storyId}
                      title={story.name}
                      contentPreview={story.firstParagraph[0].text}
                      authors={authors}
                      touchFunction={() => {
                        navigation.navigate('ReadParagraphScreen', {
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
                }
              });
              previews = React.Children.toArray(previews);
              setContent(previews);
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
          <ScrollView
            style={styles.struct}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {content}
          </ScrollView>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default HomeScreen;
