import React, {useState} from 'react';
import {Text, ScrollView, View, StyleSheet, ToastAndroid} from 'react-native';
import {BaseURLLogged} from '../utilities/backend';
import {Button, Switch, ActivityIndicator} from 'react-native-paper';
import {Input} from 'galio-framework';
import {styles, gradientColors, buttonColors} from '../utilities/constants';
import LinearGradient from 'react-native-linear-gradient';

// Ecran qui doit permettre d'inviter des gens à l'histoire, la rendre privée ou publique, et la publier si possible.
const ListMyStories = ({route, navigation}) => {
  // On set les valeurs par défaut avec les valeur qu'on a envoyé depuis la page précédente :)
  const [isPrivate, setIsPrivate] = useState(Boolean(!route.params.open));
  const [isReadable, setIsReadable] = useState(Boolean(route.params.readable));
  const [isReadableDisabled] = useState(!route.params.endings > 0);
  const [nameToInvite, setNameToInvite] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Des hooks pour update automatiquement au changement d'état dans l'app

  // Fait la requete pour mettre à jours si l'histoire est privée ou non
  const updateIsPrivate = () => {
    // On commence par mettre une indication de chargement
    setIsUpdating(true);

    // On fait la requete, si succès alors on met à jour l'état de l'histoire
    if (isPrivate) {
      fetch(
        BaseURLLogged +
          '/' +
          route.params.username +
          '/' +
          route.params.storyName +
          '/public',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: route.params.token,
          },
          body: JSON.stringify({
            data: {},
          }),
        },
      )
        .then(response => {
          console.log(
            "PUT à l'adresse : " +
              BaseURLLogged +
              '/' +
              route.params.username +
              '/' +
              route.params.storyName +
              '/public',
          );
          response
            .json()
            .then(data => {
              if (
                data.message === 'Story made public.' ||
                data.message === 'Story is already public.'
              ) {
                setIsPrivate(false);
                ToastAndroid.show(
                  'Histoire mise en publique !',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else {
                ToastAndroid.show(
                  'Une erreur est survenue, veuillez réessayer.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              }
              // On retire ensuite l'annimation de chargement
              setIsUpdating(false);
            })
            .catch(error => {
              console.log('error', error);
              setIsUpdating(false);
              ToastAndroid.show(
                'Une erreur est survenue !',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            });
        })
        .catch(error => {
          console.log('error', error);
          setIsUpdating(false);
          ToastAndroid.show(
            'Une erreur est survenue !',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        });
    } else {
      fetch(
        BaseURLLogged +
          '/' +
          route.params.username +
          '/' +
          route.params.storyName +
          '/private',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: route.params.token,
          },
          body: JSON.stringify({
            data: {},
          }),
        },
      )
        .then(response => {
          console.log(
            "PUT à l'adresse : " +
              BaseURLLogged +
              '/' +
              route.params.username +
              '/' +
              route.params.storyName +
              '/private',
          );
          response
            .json()
            .then(data => {
              if (
                data.message ===
                  'Story made private. Current authors have been automatically invited.' ||
                data.message === 'Story is already private.'
              ) {
                setIsPrivate(true);
                ToastAndroid.show(
                  'Histoire mise en privée !',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else {
                ToastAndroid.show(
                  'Une erreur est survenue, veuillez réessayer.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              }

              // On retire ensuite l'annimation de chargement
              setIsUpdating(false);
            })
            .catch(error => {
              console.log('error', error);
              setIsUpdating(false);
              ToastAndroid.show(
                'Une erreur est survenue !',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            });
        })
        .catch(error => {
          console.log('error', error);
          setIsUpdating(false);
          ToastAndroid.show(
            'Une erreur est survenue !',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        });
    }
  };

  // Vérifie si l'histoire est publiable ou non (est ce qu'il y a une fin ou non) et fait la requete
  const updateIsReadable = () => {
    // On commence par mettre une indication de chargement
    setIsUpdating(true);

    // On fait la requete, si succès alors on met à jour l'état de l'histoire
    if (isReadable) {
      fetch(
        BaseURLLogged +
          '/' +
          route.params.username +
          '/' +
          route.params.storyName +
          '/unpublish',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: route.params.token,
          },
          body: JSON.stringify({
            data: {},
          }),
        },
      )
        .then(response => {
          console.log(
            "PUT à l'adresse : " +
              BaseURLLogged +
              '/' +
              route.params.username +
              '/' +
              route.params.storyName +
              '/unpublish',
          );
          response
            .json()
            .then(data => {
              if (data.message === 'Story unpublished.') {
                setIsReadable(false);
                ToastAndroid.show(
                  'Histoire masquée au public !',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else {
                ToastAndroid.show(
                  'Une erreur est survenue, veuillez réessayer.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              }
              // On retire ensuite l'annimation de chargement
              setIsUpdating(false);
            })
            .catch(error => {
              console.log('error', error);
              setIsUpdating(false);
              ToastAndroid.show(
                'Une erreur est survenue !',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            });
        })
        .catch(error => {
          console.log('error', error);
          setIsUpdating(false);
          ToastAndroid.show(
            'Une erreur est survenue !',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        });
    } else {
      fetch(
        BaseURLLogged +
          '/' +
          route.params.username +
          '/' +
          route.params.storyName +
          '/publish',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: route.params.token,
          },
          body: JSON.stringify({
            data: {},
          }),
        },
      )
        .then(response => {
          console.log(
            "PUT à l'adresse : " +
              BaseURLLogged +
              '/' +
              route.params.username +
              '/' +
              route.params.storyName +
              '/publish',
          );
          response
            .json()
            .then(data => {
              if (data.message === 'Story published.') {
                setIsReadable(true);
                ToastAndroid.show(
                  'Histoire disponible au public !',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else {
                ToastAndroid.show(
                  'Une erreur est survenue, veuillez réessayer.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              }

              // On retire ensuite l'annimation de chargement
              setIsUpdating(false);
            })
            .catch(error => {
              console.log('error', error);
              setIsUpdating(false);
              ToastAndroid.show(
                'Une erreur est survenue !',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            });
        })
        .catch(error => {
          console.log('error', error);
          setIsUpdating(false);
          ToastAndroid.show(
            'Une erreur est survenue !',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        });
    }
  };

  const invite = () => {
    // On commence par mettre une indication de chargement
    setIsUpdating(true);

    fetch(
      BaseURLLogged +
        '/' +
        route.params.username +
        '/' +
        route.params.storyName +
        '/invite',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: route.params.token,
        },
        body: JSON.stringify({
          data: {
            name: nameToInvite,
          },
        }),
      },
    )
      .then(response => {
        console.log(
          "POST à l'adresse : " +
            BaseURLLogged +
            '/' +
            route.params.username +
            '/' +
            route.params.storyName +
            '/invite',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Guest invited.') {
              setIsUpdating(false);
              ToastAndroid.show(
                "L'invitation a bien été envoyée.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            } else {
              if (data.message === 'Cannot invite guests to a public story.') {
                ToastAndroid.show(
                  "L'histoire est publique, vous ne pouvez pas l'inviter.",
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else {
                if (data.message === 'User does not exist.') {
                  ToastAndroid.show(
                    "L'utilisateur n'existe pas.",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                } else {
                  ToastAndroid.show(
                    'Une erreur est survenue, veuillez réessayer.',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                }
              }
              setIsUpdating(false);
            }
          })
          .catch(err => {
            setIsUpdating(false);
            ToastAndroid.show(
              'Une erreur est survenue, veuillez réessayer.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            console.log('err', err);
          });
      })
      .catch(error => {
        setIsUpdating(false);
        console.log('error', error);
        ToastAndroid.show(
          'Une erreur est survenue, veuillez réessayer.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
  };
  return (
    <View style={styles.flex1}>
      <LinearGradient
        colors={[gradientColors.begin, gradientColors.end]}
        style={styles.flex1}>
        <ScrollView style={customStyles.struct}>
          <View backgroundColor={buttonColors[4]} borderRadius={30}>
            <Text style={[styles.header, {textAlign: 'center', margin: 10}]}>
              Edition de : {route.params.storyName}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>Histoire privée ?</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch value={isPrivate} onValueChange={updateIsPrivate} />
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>Publier l'histoire ?</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                value={isReadable}
                onValueChange={updateIsReadable}
                disabled={isReadableDisabled}
              />
            </View>
          </View>

          <Input
            placeholder="Nom de l'utilisateur à inviter"
            onChangeText={setNameToInvite}
          />
          <Button
            color={buttonColors[0]}
            size="small"
            type="clear"
            onPress={() => {
              invite();
            }}>
            Inviter
          </Button>
        </ScrollView>

        {isUpdating ? (
          <ActivityIndicator
            animating={isUpdating}
            hidesWhenStopped={true}
            color="white"
            size="large"
            style={customStyles.activityIndicator}
          />
        ) : null}
      </LinearGradient>
    </View>
  );
};

const customStyles = StyleSheet.create({
  struct: {
    align: 'right',
  },
  textArea: {
    backgroundColor: 'white',
    color: 'black',
    height: 200,
    width: '100%',
    borderWidth: 2,
    borderRadius: 10,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListMyStories;
