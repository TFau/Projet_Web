import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {styles, gradientColors} from '../utilities/constants';
import {AuthContext} from '../context/context';
import LinearGradient from 'react-native-linear-gradient';

// Page de déconnection
const LogoutPage = ({navigation}) => {
  const {signOut} = useContext(AuthContext);

  return (
    <LinearGradient
      colors={[gradientColors.begin, gradientColors.end]}
      style={styles.flex1}>
      <View style={styles.master}>
        <Text h3 style={styles.header}>
          Se déconnecter
        </Text>
        <Button
          onPress={() => {
            signOut();
          }}
          title="Cliquer ici pour vous deconnecter"
          type="clear"
        />
      </View>
    </LinearGradient>
  );
};

export default LogoutPage;
