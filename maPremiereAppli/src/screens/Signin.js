import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Input, Button} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {styles, gradientColors, buttonColors} from '../utilities/constants';

import {AuthContext} from '../context/context';

// La page de connection à l'application
const Signin = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useContext(AuthContext);

  return (
    <View style={styles.flex1}>
      <LinearGradient
        colors={[gradientColors.begin, gradientColors.end]}
        style={styles.flex1}>
        <View style={styles.master}>
          <Text style={styles.header}>Se connecter</Text>
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
          <Button
            color={buttonColors[0]}
            size="large"
            type="clear"
            onPress={() => {
              signIn(name, password);
            }}>
            Login
          </Button>
          <View style={styles.link}>
            <Text style={styles.text}>Pas encore inscrit? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text style={styles.textLink}>Cliquez ici.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Signin;
