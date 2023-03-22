import React, {useState} from 'react';
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

// Page pour créer une nouvelle histoire (titre, premier paragraphes et au moins 1 choix + option si histoire privée ou non)
const NewStory = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [listOfButtons, setListOfButtons] = useState([]);
  const [choice0, setChoice0] = useState(null);
  const [choice1, setChoice1] = useState(null);
  const [choice2, setChoice2] = useState(null);
  const [choice3, setChoice3] = useState(null);
  const [choice4, setChoice4] = useState(null);

  const validate = value => {
    let choices = [choice0, choice1, choice2, choice3, choice4];
    choices = choices.filter(choice => choice !== '');
    choices = choices.filter(choice => choice !== null);

    // On récupère le contexte
    const loginState = value.getData();

    if (title === '') {
      ToastAndroid.show(
        'Veuillez entrer un titre',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }
    if (paragraph === '') {
      ToastAndroid.show(
        'Veuillez entrer un paragraphe',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

    if (choices.length < 1) {
      ToastAndroid.show(
        'Veuillez entrer au moins une réponse',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

    fetch(BaseURLLogged + '/' + loginState.name + '/story/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: loginState.token,
      },
      body: JSON.stringify({
        data: {
          userId: parseFloat(loginState.userId),
          name: title,
          open: !isPrivate,
          text: paragraph,
          choices: choices,
        },
      }),
    })
      .then(response => {
        console.log(
          "POST à l'adresse ",
          BaseURLLogged + '/' + loginState.name + '/story/new',
          'avec data : ',
          {
            userId: parseFloat(loginState.userId),
            name: title,
            open: !isPrivate,
            text: paragraph,
            choices: choices,
          },
        );
        response
          .json()
          .then(data => {
            if (data.message === 'Story created.') {
              ToastAndroid.show(
                'Histoire créée',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              navigation.goBack();
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
          });
      })
      .catch(error => {
        console.log('error', error);
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
      console.log('Erreur, on ne peut pas ajouter plus de 5 choix');
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
          <Input
            maxLength={40}
            placeholder="Titre"
            onChangeText={newTitle => setTitle(newTitle)}
          />
          <TextInput
            style={customStyles.textArea}
            multiline={true}
            placeholder="Contenu du premier paragraphe"
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
              <Text style={styles.text}>Histoire privée ?</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch value={isPrivate} onValueChange={setIsPrivate} />
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

export default NewStory;
