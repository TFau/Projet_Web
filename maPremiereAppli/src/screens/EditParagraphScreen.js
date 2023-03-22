import React, {useState, useContext} from 'react';
import {
  ScrollView,
  ToastAndroid,
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import {AuthContext} from '../context/context';
import Paragraph from '../utilities/Paragraph';
import {styles, gradientColors} from '../utilities/constants';
import {BaseURLLogged} from '../utilities/backend';
import {Button, Input} from 'galio-framework';
import {buttonColors} from '../utilities/constants';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';

const EditParagraphScreen = ({route, navigation}) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfChoices, setNumberOfChoices] = useState(0);
  const [choice, setChoice] = useState('');
  const {lockParagraph} = useContext(AuthContext);
  const [showEditParagraph, setShowEditParagraph] = useState(false);
  const [newParagraphValue, setNewParagraphValue] = useState('');

  // Visiblilité du modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Pour le dropdownpicker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const {paragraphId, username, storyName, token, userId} = route.params;
  let history = []; // History est une liste d'id de paragraphes qui ont été lus avant d'arriver ici
  for (let e of route.params.history) {
    // On ne veut pas une reférence qu'on se passe entre page mais bien une copie de l'état actuel, pour que si on fait un navigation.goback, on retrouve l'état qu'on a laissé
    history.push(e);
  }
  history.push(paragraphId);

  const showModal = () => {
    if (choice.length > 0) {
      // Affiche à l'écran
      setIsModalVisible(true);

      // fetch la liste des paragraphes
      fetch(BaseURLLogged + '/' + username + '/' + storyName + '/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      })
        .then(response => {
          console.log(
            "GET à l'adresse ",
            BaseURLLogged + '/' + username + '/' + storyName + '/get',
          );
          response
            .json()
            .then(data => {
              if (data.message === 'Paragraphs found.') {
                let listOfParagraphs = [];
                data.data.forEach(e => {
                  listOfParagraphs.push({
                    label: e.text.substring(0, 100) + '...',
                    value: e.paraNum,
                  });
                });
                setItems(listOfParagraphs);
              } else {
                ToastAndroid.show(
                  'Une erreur est survenue',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              }
            })
            .catch(error => {
              ToastAndroid.show(
                'Une erreur est survenue',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              console.log('error', error);
            });
        })
        .catch(error => {
          ToastAndroid.show(
            'Une erreur est survenue',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
          console.log('error', error);
        });
    } else {
      ToastAndroid.show(
        'Veuillez entrer un nom de choix non vide',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      console.log("Aucun choix n'a été rentré, on ne fait rien");
    }
  };

  const addChoiceExistingParagraph = () => {
    setNumberOfChoices(numberOfChoices + 1);
    fetch(
      BaseURLLogged +
        '/' +
        username +
        '/' +
        storyName +
        '/' +
        paragraphId +
        '/addChoice',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          data: {
            choices: [choice],
            existingPara: [value],
          },
        }),
      },
    )
      .then(response => {
        console.log(
          "POST à l'adresse ",
          BaseURLLogged +
            '/' +
            username +
            '/' +
            storyName +
            '/' +
            paragraphId +
            '/addChoice',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Choices created.') {
              ToastAndroid.show(
                'Choix ajouté',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              UpdateParagraphData();
              setChoice('');
            }
          })
          .catch(error => {
            ToastAndroid.show(
              'Une erreur est survenue',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            console.log('error', error);
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Une erreur est survenue',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  const addChoiceNewParagraph = () => {
    setNumberOfChoices(numberOfChoices + 1);
    fetch(
      BaseURLLogged +
        '/' +
        username +
        '/' +
        storyName +
        '/' +
        paragraphId +
        '/addChoice',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          data: {
            choices: [choice],
          },
        }),
      },
    )
      .then(response => {
        console.log(
          "POST à l'adresse ",
          BaseURLLogged +
            '/' +
            username +
            '/' +
            storyName +
            '/' +
            paragraphId +
            '/addChoice',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Choices created.') {
              ToastAndroid.show(
                'Choix ajouté',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              UpdateParagraphData();
              setChoice('');
            }
          })
          .catch(error => {
            ToastAndroid.show(
              'Une erreur est survenue',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            console.log('error', error);
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Une erreur est survenue',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  const requestEditionRights = () => {
    console.log('demande de vérouillage du paragraphe ' + paragraphId);
    fetch(
      BaseURLLogged +
        '/' +
        username +
        '/' +
        storyName +
        '/' +
        paragraphId +
        '/write',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          data: {
            userId: parseFloat(userId),
          },
        }),
      },
    )
      .then(response => {
        console.log(
          "PUT à l'adresse ",
          BaseURLLogged +
            '/' +
            username +
            '/' +
            storyName +
            '/' +
            paragraphId +
            '/write',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Paragraph selected for writing.') {
              ToastAndroid.show(
                'Paragraphe sélectionné',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              lockParagraph(paragraphId, storyName);
            } else if (
              data.message === 'You have already selected a paragraph to write.'
            ) {
              console.log('error un paragraphe est déjà locked');
              ToastAndroid.show(
                'Vous ne pouvez pas sélectionner ce paragraphe, vous en avez déjà sélectionné un autre',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            } else {
              console.log('error');
              ToastAndroid.show(
                'Une erreur est survenue',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(error => {
            console.log('error', error);
            ToastAndroid.show(
              'Echec de la sélection du paragraphe',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Echec de la sélection du paragraphe',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  const UpdateParagraphData = () => {
    fetch(
      BaseURLLogged +
        '/' +
        username +
        '/' +
        storyName +
        '/' +
        paragraphId +
        '/get',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      },
    )
      .then(response => {
        console.log(
          "GET à l'adresse ",
          BaseURLLogged +
            '/' +
            username +
            '/' +
            storyName +
            '/' +
            paragraphId +
            '/get',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Paragraph does not exist.') {
              setContent(
                <View style={styles.modal}>
                  <Text style={styles.text}>
                    Ce paragraphe n'existe pas encore, demander l'édition ?
                  </Text>
                  <Button
                    style={styles.button}
                    color={buttonColors[0]}
                    size="large"
                    type="clear"
                    onPress={() => {
                      requestEditionRights();
                    }}>
                    Demander les droits d'édition
                  </Button>
                </View>,
              );
              setNumberOfChoices(5);
            } else if (data.message === 'Paragraph selected.') {
              let choices = [];
              let jumpParagraphId = [];
              data.data[0].choices.forEach(element => {
                choices.push(element.text);
                jumpParagraphId.push(element.paraNum2);
              });

              setContent(
                <Paragraph
                  style={styles.master}
                  edition={true}
                  title="Mode édition"
                  content={data.data[0].text}
                  choices={choices}
                  author={[data.data[0].author.username]}
                  navigation={navigation}
                  jumpParagraphId={jumpParagraphId}
                  username={username}
                  storyName={storyName}
                  token={token}
                  history={history}
                  userId={userId}
                />,
              );
              setNewParagraphValue(data.data[0].text);
              setNumberOfChoices(choices.length);
              if (data.data[0].userId === parseFloat(userId)) {
                setShowEditParagraph(true);
              }
            } else {
              console.log('error');
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

  const uploadNewParagraph = () => {
    fetch(
      BaseURLLogged +
        '/' +
        username +
        '/' +
        storyName +
        '/' +
        paragraphId +
        '/edit',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          data: {
            userId: parseFloat(userId),
            text: newParagraphValue,
          },
        }),
      },
    )
      .then(response => {
        console.log(
          "PUT à l'adresse ",
          BaseURLLogged +
            '/' +
            username +
            '/' +
            storyName +
            '/' +
            paragraphId +
            '/edit',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Paragraph successfully modified.') {
              ToastAndroid.show(
                'Paragraphe modifié',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              setIsLoading(true);
            } else {
              console.log('error');
              ToastAndroid.show(
                'Une erreur est survenue',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(error => {
            console.log('error', error);
            ToastAndroid.show(
              'Echec de la sélection du paragraphe',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Echec de la sélection du paragraphe',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  const deleteParagraph = () => {
    fetch(
      BaseURLLogged +
        '/' +
        username +
        '/' +
        storyName +
        '/' +
        paragraphId +
        '/del',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      },
    )
      .then(response => {
        console.log(
          "DELETE à l'adresse ",
          BaseURLLogged +
            '/' +
            username +
            '/' +
            storyName +
            '/' +
            paragraphId +
            '/del',
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Paragraph successfully deleted.') {
              ToastAndroid.show(
                'Paragraphe supprimé',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              setIsLoading(true);
            } else {
              ToastAndroid.show(
                'Vous ne pouvez pas le supprimer, désolé',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(error => {
            console.log('error', error);
            ToastAndroid.show(
              'Echec de la suppression',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Echec de la suppression',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        console.log('error', error);
      });
  };

  if (isLoading) {
    setIsLoading(false);
    UpdateParagraphData();
  }
  return (
    <ScrollView style={{backgroundColor: gradientColors.end}}>
      {content}
      {showEditParagraph ? (
        <View style={[styles.flex1, {marginHorizontal: 15, marginBottom: 40}]}>
          <Text style={[styles.textWarning, {textAlign: 'center'}]}>
            Vous êtes le propriétaire de ce paragraphe, vous pouvez le modifier
          </Text>
          <TextInput
            value={newParagraphValue}
            style={customStyles.textArea}
            multiline={true}
            placeholder="Nouveau texte du paragraphe"
            onChangeText={setNewParagraphValue}
          />
          <Button
            color={buttonColors[0]}
            size="large"
            onPress={() => {
              uploadNewParagraph();
            }}>
            Valider ce nouveau paragraphe
          </Button>
          <Button
            color={buttonColors[0]}
            size="large"
            onPress={() => {
              deleteParagraph();
            }}>
            Supprimer le paragraphe
          </Button>
        </View>
      ) : null}
      {numberOfChoices < 5 ? (
        <View style={[styles.flex1, {marginHorizontal: 15, marginBottom: 20}]}>
          <Input
            value={choice}
            style={styles.input}
            placeholder="Nom du choix à rajouter"
            onChangeText={setChoice}
          />
          {showEditParagraph ? (
            <Button
              color={buttonColors[2]}
              size="large"
              type="clear"
              onPress={() => {
                console.log("Ajout d'un choix nommé : " + choice);
                showModal();
              }}>
              Ajouter ce choix
            </Button>
          ) : (
            <Button
              color={buttonColors[0]}
              size="large"
              type="clear"
              onPress={() => {
                console.log("Ajout d'un choix nommé : " + choice);
                showModal();
              }}>
              Ajouter ce choix
            </Button>
          )}
        </View>
      ) : null}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={[styles.text, {textAlign: 'center'}]}>
            Souhaitez vous associer ce choix à un paragraphe existant ou à un
            paragraphe à créer ?
          </Text>
          <Text style={[styles.text, {textAlign: 'center'}]}>
            Choix existant :
          </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
          <Button
            color={buttonColors[0]}
            size="large"
            onPress={() => {
              addChoiceExistingParagraph();
              setIsModalVisible(false);
            }}>
            Valider le choix existant
          </Button>
          <Text style={[styles.text, {textAlign: 'center', marginTop: 30}]}>
            Ou sinon indiquer qu'il faut créer un nouveau paragraphe :
          </Text>
          <Button
            color={buttonColors[0]}
            size="large"
            onPress={() => {
              setIsModalVisible(false);
              addChoiceNewParagraph();
            }}>
            Nouveau paragraphe
          </Button>
        </View>
      </Modal>
    </ScrollView>
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
});

export default EditParagraphScreen;
