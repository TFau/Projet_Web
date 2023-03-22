import React, {useState} from 'react';
import {ScrollView, RefreshControl, ToastAndroid} from 'react-native';
import Preview from '../utilities/Preview';
import {styles} from '../utilities/constants';
import {BaseURLLogged} from '../utilities/backend';
import {AuthContext} from '../context/context';

// Liste de toutes les histoires qu'on a crée (1er auteur).
const ListMyStories = ({navigation}) => {
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
                // On ajoute une preview à la liste
                if (parseInt(loginState.userId) === story.userId) {
                  let authors = [];
                  story.authors.forEach(object =>
                    authors.push(object.username),
                  );
                  previews.push(
                    <Preview
                      key={story.story_storyId}
                      title={story.name}
                      contentPreview={story.firstParagraph[0].text}
                      touchFunction={() => {
                        navigation.navigate('EditMyStories', {
                          paragraphId: story.paraNum,
                          username: loginState.name,
                          storyName: story.name,
                          token: loginState.token,
                          story_storyId: story.story_storyId,
                          readable: story.readable,
                          open: story.open,
                          endings: story.endings,
                        });
                      }}
                      authors={authors}
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
                'Une erreur est survenue, veuillez réessayer.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      })
      .catch(error => {
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

export default ListMyStories;
