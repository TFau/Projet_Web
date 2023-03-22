import React, {useState} from 'react';
import {Text, ScrollView, ToastAndroid} from 'react-native';
import Paragraph from '../utilities/Paragraph';
import {styles, gradientColors} from '../utilities/constants';
import {BaseURLUnlogged} from '../utilities/backend';

// Lecture d'un paragraphe pour un utilisateur non connecté
const PublicReadParagraphScreen = ({route, navigation}) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authorizedParagraphs, setAuthorizedParagraphs] = useState([]);

  const {paragraphId, storyName} = route.params;
  let history = []; // History est une liste d'id de paragraphes qui ont été lus avant d'arriver ici
  for (let e of route.params.history) {
    // On ne veut pas une reférence qu'on se passe entre page mais bien une copie de l'état actuel, pour que si on fait un navigation.goback, on retrouve l'état qu'on a laissé
    history.push(e);
  }

  const getAllParagraph = () => {
    // Remarque, si history vaut [], alors on est sur la première page de l'histoire, c'est à dire qu'il va falloir récupérer tous les paragraphes et stocker ceux qui sont à afficher ou non.
    if (history.length === 0) {
      console.log(
        "On est sur la première page de l'histoire, on recupère tous les paragraphes",
      );
      fetch(BaseURLUnlogged + '/' + storyName + '/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log(
            "GET à l'adresse ",
            BaseURLUnlogged + '/' + storyName + '/get',
          );
          response
            .json()
            .then(data => {
              if (data.message === 'Paragraphs found.') {
                let authorizedParagraphsLocal = [];
                data.data.forEach(paragraph => {
                  if (paragraph.leadsToEnd) {
                    // Si le paragraphe est à la fin de l'histoire, on le met dans la liste
                    authorizedParagraphsLocal.push(paragraph.paraNum);
                  }
                });
                setAuthorizedParagraphs(authorizedParagraphsLocal);
                makeFetch(authorizedParagraphsLocal);
              }
            })
            .catch(error => {
              console.log('error', error);
            });
        })
        .catch(error => {
          console.log('error', error);
        });
    } else {
      // Sinon, on récupère les paragraphes autorisés dans la route
      makeFetch(route.params.authorizedParagraphs);
    }
  };

  function clickHisto(indice) {
    if (history.length > 0) {
      let i = history.length - 1;
      let nbGB = 0;
      while (i >= 0 && history[i][0] !== indice) {
        history.pop();
        nbGB++;
        i--;
      }
      if (i === 0) {
        nbGB++;
      }
      navigation.pop(nbGB);
    } else {
      console.log('Already at begin');
    }
  }

  const makeFetch = authorizedParagraphs => {
    fetch(BaseURLUnlogged + '/' + storyName + '/' + paragraphId + '/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(
          "GET à l'adresse ",
          BaseURLUnlogged + '/' + storyName + '/' + paragraphId + '/get',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Paragraph selected.') {
              let choices = [];
              let jumpParagraphId = [];
              data.data[0].choices.forEach(element => {
                // Si element.paraNum2 est dans authorizedParagraph, alors il faut l'afficher
                if (authorizedParagraphs.includes(element.paraNum2)) {
                  choices.push(element.text);
                  jumpParagraphId.push(element.paraNum2);
                }
              });

              setContent(
                <Paragraph
                  style={styles.master}
                  edition={false}
                  title=""
                  content={data.data[0].text}
                  choices={choices}
                  navigation={navigation}
                  jumpParagraphId={jumpParagraphId}
                  storyName={storyName}
                  history={history}
                  authorizedParagraphs={authorizedParagraphs}
                />,
              );
              history.push([paragraphId, data.data[0].text]);
            } else {
              ToastAndroid.show(
                'Une erreur est survenue, veuillez réessayer.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(err => {
            ToastAndroid.show(
              'Une erreur est survenue, veuillez réessayer.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            console.log('err', err);
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Une erreur est survenue, veuillez réessayer.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  if (isLoading) {
    setIsLoading(false);
    getAllParagraph();
  }

  let stringHistory = [
    <Text
      style={styles.histoChoice}
      onPress={() => {
        clickHisto(1, history.length);
      }}>
      Debut Histoire
    </Text>,
  ];
  for (let i = 0; i < history.length; i++) {
    stringHistory.push(<Text style={styles.histo}> &gt; </Text>);
    stringHistory.push(
      <Text
        style={styles.histoChoice}
        onPress={() => {
          clickHisto(history[i][0], history.length);
        }}>
        {history[i][1]}
      </Text>,
    );
  }
  stringHistory = React.Children.toArray(stringHistory);
  return (
    <ScrollView style={{backgroundColor: gradientColors.end}}>
      {content}
      <ScrollView horizontal={true} style={styles.histo}>
        {stringHistory}
      </ScrollView>
    </ScrollView>
  );
};

export default PublicReadParagraphScreen;
