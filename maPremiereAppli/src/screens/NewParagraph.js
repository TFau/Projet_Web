import React, {useContext, useState} from 'react';
import {
  ScrollView,
  View,
  TextInput,
  StyleSheet,
  Text,
  ToastAndroid,
} from 'react-native';
import {Button, Input} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors, buttonColors} from '../utilities/constants';
import {BaseURLLogged} from '../utilities/backend';
import {AuthContext} from '../context/context';
import {Switch} from 'react-native-paper';

// Page pour creer un nouveau paragraphe (après avoir lock le paragraphe)
const NewParagraph = () => {
  const [paragraph, setParagraph] = useState('');
  const [listOfButtons, setListOfButtons] = useState([]);
  const [choice0, setChoice0] = useState(null);
  const [choice1, setChoice1] = useState(null);
  const [choice2, setChoice2] = useState(null);
  const [choice3, setChoice3] = useState(null);
  const [choice4, setChoice4] = useState(null);
  const [isConclusion, setIsConclusion] = useState(false);
  const {unlockParagraph} = useContext(AuthContext);

  const validate = value => {
    let choices = [choice0, choice1, choice2, choice3, choice4];
    choices = choices.filter(choice => choice !== '');
    choices = choices.filter(choice => choice !== null);

    // On récupère le contexte
    const loginState = value.getData();

    if (paragraph === '') {
      ToastAndroid.show(
        'Veuillez entrer un paragraphe',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

    fetch(
      BaseURLLogged +
        '/' +
        loginState.name +
        '/' +
        loginState.storyName +
        '/' +
        loginState.paragraphId +
        '/validate',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: loginState.token,
        },
        body: JSON.stringify({
          data: {
            userId: parseFloat(loginState.userId),
            text: paragraph,
            choices: choices,
            conclusion: isConclusion,
          },
        }),
      },
    )
      .then(response => {
        console.log(
          "PUT à l'adresse ",
          BaseURLLogged +
            '/' +
            loginState.name +
            '/' +
            loginState.storyName +
            '/' +
            loginState.paragraphId +
            '/validate',
          'avec body = ',
          {
            userId: parseFloat(loginState.userId),
            text: paragraph,
            choices: choices,
            conclusion: isConclusion,
          },
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Paragraph validated.') {
              ToastAndroid.show(
                'Histoire créée',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              unlockParagraph();
            } else {
              ToastAndroid.show(
                'Echec de la création.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch(err => {
            console.log('err', err);
            ToastAndroid.show(
              'Echec de la création.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          });
      })
      .catch(error => {
        console.log('error', error);
        ToastAndroid.show(
          'Echec de la création.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
  };

  const genFunction = i => {
    return newChoice => {
      switch (i) {
        case 0:
          setChoice0(newChoice);
          break;
        case 1:
          setChoice1(newChoice);
          break;
        case 2:
          setChoice2(newChoice);
          break;
        case 3:
          setChoice3(newChoice);
          break;
        case 4:
          setChoice4(newChoice);
          break;
        default:
          break;
      }
    };
  };

  const addChoice = () => {
    if (listOfButtons.length >= 5) {
      ToastAndroid.show(
        'Vous ne pouvez pas ajouter plus de 5 réponses',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      console.log('Vous ne pouvez pas ajouter plus de 5 choix');
      return;
    }
    console.log('Choix ajouté');
    const newButton = (
      <Input
        maxLength={40}
        key={listOfButtons.length}
        placeholder={'Choix numéro ' + listOfButtons.length}
        onChangeText={genFunction(listOfButtons.length)}
      />
    );
    setListOfButtons(listOfButtons.concat(newButton));

    if (listOfButtons.length === 0) {
      setChoice0('');
    } else if (listOfButtons.length === 1) {
      setChoice1('');
    } else if (listOfButtons.length === 2) {
      setChoice2('');
    } else if (listOfButtons.length === 3) {
      setChoice3('');
    } else if (listOfButtons.length === 4) {
      setChoice4('');
    }
  };

  return (
    <View style={styles.flex1}>
      <LinearGradient
        colors={[gradientColors.begin, gradientColors.end]}
        style={styles.flex1}>
        <ScrollView style={customStyles.struct}>
          <Text style={styles.header}>Vous rédigez un nouveau paragraphe</Text>
          <TextInput
            style={customStyles.textArea}
            multiline={true}
            placeholder="Contenu du paragraphe"
            onChangeText={newParagraph => setParagraph(newParagraph)}
          />
          <View>{listOfButtons}</View>
          <Button
            color={buttonColors[0]}
            size="small"
            type="clear"
            onPress={() => {
              addChoice();
            }}>
            Ajouter un choix
          </Button>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>
                Ce paragraphe peut être une conclusion ?
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Switch value={isConclusion} onValueChange={setIsConclusion} />
            </View>
          </View>
          <AuthContext.Consumer>
            {value => {
              return (
                <Button
                  color={buttonColors[0]}
                  style={{alignSelf: 'center'}}
                  size="small"
                  type="clear"
                  onPress={() => {
                    validate(value);
                  }}>
                  Valider
                </Button>
              );
            }}
          </AuthContext.Consumer>
          <Button
            color={buttonColors[0]}
            style={{alignSelf: 'center'}}
            size="small"
            type="clear"
            onPress={() => {
              unlockParagraph();
            }}>
            Abandonner la rédaction
          </Button>
        </ScrollView>
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
});

export default NewParagraph;
