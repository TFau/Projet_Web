import React, {useState, useContext} from 'react';
import {View, Text} from 'react-native';
import {Input, Button} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors} from '../utilities/constants';
import {AuthContext} from '../context/context';

// La page d'inscription à l'application
const Signup = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {signUp} = useContext(AuthContext);

  return (
    <View style={styles.flex1}>
      <LinearGradient
        colors={[gradientColors.begin, gradientColors.end]}
        style={styles.flex1}>
        <View style={styles.master}>
          <Text style={styles.header}>S'inscrire</Text>
          <Input
            placeholder="Username"
            onChangeText={setName}
            value={name}
            left
            icon="user"
            family="antdesign"
            iconSize={14}
            iconColor="red"
          />
          <Input
            placeholder="Mot de passe"
            password
            viewPass
            onChangeText={setPassword}
            value={password}
            left
            icon="lock"
            family="antdesign"
            iconSize={14}
            iconColor="red"
          />
          {/* Ceci est un essai d'icones à afficher pour chaque user, mais l'idée n'a pas été pousée jusqu'au bout*/}
          {/* <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.text}>Select an Icon : </Text>
            <Icon name="dribbble" family="AntDesign" color="orange" size={50} />
            <Icon name="flower" family="Entypo" color="red" size={50} />
            <Icon
              name="smile-circle"
              family="AntDesign"
              color="lightgreen"
              size={50}
            />
            <Icon
              name="game-controller"
              family="Entypo"
              color="pink"
              size={50}
            />
          </View> */}
          <Button
            size="large"
            type="clear"
            onPress={() => {
              signUp(name, password);
            }}>
            S'inscrire
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Signup;
