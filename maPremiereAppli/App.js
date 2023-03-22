import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityIndicator, View, ToastAndroid} from 'react-native';
import {Icon} from 'react-native-elements';
import SInfo from 'react-native-sensitive-info';
import 'react-native-gesture-handler';

// Toutes les pages de l'application à mettre dans les navigateurs
import Signin from './src/screens/Signin';
import Signup from './src/screens/Signup';
import MyStories from './src/screens/MyStories';
import LogoutPage from './src/screens/LogoutPage';
import HomeScreen from './src/screens/HomeScreen';
import ShowEditableStories from './src/screens/ShowEditableStories';
import NewStory from './src/screens/NewStory';
import ReadParagraphScreen from './src/screens/ReadParagraphScreen';
import {AuthContext} from './src/context/context';
import {BaseURLUnlogged} from './src/utilities/backend';
import ListMyStories from './src/screens/ListMyStories';
import EditMyStories from './src/screens/EditMyStories';
import EditParagraphScreen from './src/screens/EditParagraphScreen';
import NewParagraph from './src/screens/NewParagraph';
import PublicReadScreen from './src/screens/PublicReadScreen';
import PublicReadParagraphScreen from './src/screens/PublicReadParagraphScreen';

// Les pages qui seront affichées pour se connecter
const AuthStack = createStackNavigator();
function AuthFlow() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Signin"
        component={Signin}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Signup"
        component={Signup}
      />
    </AuthStack.Navigator>
  );
}

// Les pages qui seront affichées pour lire les histoires publiques
function PublicReadFlow() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{headerShown: false}}
        name="PublicReadScreen"
        component={PublicReadScreen}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="PublicReadParagraphScreen"
        component={PublicReadParagraphScreen}
      />
    </AuthStack.Navigator>
  );
}

// Le tab navigator lorsqu'on est pas connecté
const TabAuth = createBottomTabNavigator();
function TabAuthFlow() {
  return (
    <TabAuth.Navigator
      key={'tabAuth'}
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#4a0073',
        },
        tabBarOptions: {
          activeTintColor: 'white',
          inactiveTintColor: '#fff',
        },
        tabBarActiveBackgroundColor: '#af52d5',
        headerShown: false,
        swipeEnabled: true,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let type;
          switch (route.name) {
            case 'Histoires publiques':
              iconName = 'book-sharp';
              type = 'ionicon';
              break;
            case 'Connexion':
              iconName = 'login';
              type = 'material-community';
              break;
          }
          if (focused) {
            color = '#4a0073';
          } else {
            color = '#af52d5';
          }
          return <Icon name={iconName} type={type} size={size} color={color} />;
        },
      })}>
      <TabAuth.Screen name="Connexion" component={AuthFlow} />
      <TabAuth.Screen name="Histoires publiques" component={PublicReadFlow} />
    </TabAuth.Navigator>
  );
}

// Les pages qui seront affichées pour éditer les histoires qu'on a créé
const MyStoriesStack = createStackNavigator();
function MyStoriesFLow() {
  return (
    <MyStoriesStack.Navigator>
      <MyStoriesStack.Screen
        options={{headerShown: false}}
        name="MyStoriesHome"
        component={MyStories}
      />
      <MyStoriesStack.Screen
        options={{headerShown: false}}
        name="CreateNewStory"
        component={NewStory}
      />
      <MyStoriesStack.Screen
        options={{headerShown: false}}
        name="ListMyStories"
        component={ListMyStories}
      />
      <MyStoriesStack.Screen
        options={{headerShown: false}}
        name="EditMyStories"
        component={EditMyStories}
      />
    </MyStoriesStack.Navigator>
  );
}

// Les pages pour lire les histoires quand on est connecté
const ReadStack = createStackNavigator();
function ReadFlow() {
  return (
    <ReadStack.Navigator>
      <ReadStack.Screen
        options={{headerShown: false}}
        name="HomeScreen"
        component={HomeScreen}
      />
      <ReadStack.Screen
        options={{headerShown: false}}
        name="ReadParagraphScreen"
        component={ReadParagraphScreen}
      />
    </ReadStack.Navigator>
  );
}

// Les pages pour éditer les paragraphes quand on est connecté
const EditableStack = createStackNavigator();
function EditableFlow() {
  const {unlockParagraph} = React.useContext(AuthContext);
  return (
    <AuthContext.Consumer>
      {value => {
        if (value.getData().isEditing) {
          // Ici on fige un écran pour que l'on ne n'ai pas à rechercher partout quel est le paragraphe en cours de rédaction.
          return <NewParagraph />;
        } else {
          return (
            <EditableStack.Navigator>
              <EditableStack.Screen
                options={{headerShown: false}}
                name="ShowEditableStories"
                component={ShowEditableStories}
              />
              <EditableStack.Screen
                options={{headerShown: false}}
                name="EditParagraphScreen"
                component={EditParagraphScreen}
              />
              <EditableStack.Screen
                options={{headerShown: false}}
                name="NewParagraph"
                component={NewParagraph}
              />
            </EditableStack.Navigator>
          );
        }
      }}
    </AuthContext.Consumer>
  );
}

// Le tab navigator quand on est connecté
const Tab = createBottomTabNavigator();
function HomeFlow() {
  return (
    <Tab.Navigator
      key={'tab'}
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#4a0073',
        },
        tabBarOptions: {
          activeTintColor: 'white',
          inactiveTintColor: '#fff',
        },
        tabBarActiveBackgroundColor: '#af52d5',
        headerShown: false,
        swipeEnabled: true,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let type;
          switch (route.name) {
            case 'Lire':
              iconName = 'book-sharp';
              type = 'ionicon';
              break;
            case 'Editer':
              iconName = 'draw-pen';
              type = 'material-community';
              break;
            case 'Mes histoires':
              iconName = 'bookshelf';
              type = 'material-community';
              break;
            case 'Déconnexion':
              iconName = 'logout';
              type = 'material-community';
              break;
          }
          if (focused) {
            color = '#4a0073';
          } else {
            color = '#af52d5';
          }
          return <Icon name={iconName} type={type} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Lire" component={ReadFlow} />
      <Tab.Screen name="Editer" component={EditableFlow} />
      <Tab.Screen name="Mes histoires" component={MyStoriesFLow} />
      <Tab.Screen name="Déconnexion" component={LogoutPage} />
    </Tab.Navigator>
  );
}

// Partie gestion du login inspirée de ce tuto : https://www.youtube.com/watch?v=gvF6sFIPfsQ&t=50s
const Stack = createStackNavigator();
function App() {
  const initialLoginState = {
    isLoading: true,
    userId: null,
    token: null,
    isEditing: false,
    paragraphId: null,
    storyName: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          isLoading: false,
          token: action.token,
          name: action.name,
          userId: action.userId,
        };
      case 'LOGIN':
        return {
          ...prevState,
          isLoading: false,
          token: action.token,
          name: action.name,
          userId: action.userId,
          isEditing: action.isEditing,
          storyName: action.storyName,
          paragraphId: action.paragraphId,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isLoading: false,
          token: null,
          name: null,
          userId: null,
          isEditing: null,
          storyName: null,
          paragraphId: null,
        };
      case 'REGISTER':
        return {
          ...prevState,
          isLoading: false,
          token: action.token,
          name: action.name,
          userId: action.userId,
        };
      case 'EDIT':
        return {
          ...prevState,
          isEditing: action.isEditing,
          storyName: action.storyName,
          paragraphId: action.paragraphId,
        };
      default:
        return prevState;
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(() => ({
    getData: () => {
      return loginState;
    },
    signIn: async (name, password) => {
      console.log(
        'Essais de connection avec name: ' +
          name +
          ' and password: ' +
          password,
      );
      let token = null; // Valeur par défaut, au cas ou
      let userId = null; // Valeur par défaut, au cas ou
      let isEditing = null; // Est ce que cet user a lock un paragraphe ou non
      let storyName = null; // Si c'est le cas, alors il s'agit de l'histoire nommée storyName
      let paragraphId = null; // Et du paragraphe nommé paragraphId

      // La requete
      fetch(BaseURLUnlogged + '/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: {name: name, password: password}}),
      })
        .then(res => {
          res
            .json()
            .then(async res => {
              if (res.message === 'Successfully logged in.') {
                token = res.data.token;
                userId = res.data.userId.toString();
                if (res.data.userStatus !== null) {
                  // Il y a bien un paragraphe locké
                  isEditing = true;
                  storyName = res.data.userStatus.storyName;
                  paragraphId = res.data.userStatus.paraNum;
                }
                // Sinon on laisse à null

                // On stocke en local les variables à garder en mémoire
                try {
                  await SInfo.setItem('token', token, {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                  });
                  await SInfo.setItem('name', name, {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                  });
                  await SInfo.setItem('userId', userId, {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                  });
                } catch (error) {
                  console.log(error);
                }

                // On dispatch les valeurs qu'on veut utiliser par la suite, ie le token et le name. Cela va actualiser la page et nous ammener sur la page d'accueil
                dispatch({
                  type: 'LOGIN',
                  name: name,
                  token: token,
                  userId: userId,
                  isEditing: isEditing,
                  storyName: storyName,
                  paragraphId: paragraphId,
                });
                console.log(
                  'LOGIN EFFECTUÉ AVEC : username : ' + name,
                  ' token : ',
                  token,
                  ' userId : ',
                  userId,
                  ' isEditing : ',
                  isEditing,
                  ' storyName : ',
                  storyName,
                  ' paragraphId : ',
                  paragraphId,
                );
              } else {
                if (res.message === 'Incorrect login information.') {
                  console.log('Login failed');
                  ToastAndroid.show(
                    'Identifiants incorrects',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                } else {
                  console.log('Registeration failed');
                  ToastAndroid.show(
                    'Erreur lors de la connexion',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                }
              }
            })
            .catch(error => {
              console.log(error);
              ToastAndroid.show(
                'Erreur lors de la connexion',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            });
        })
        .catch(err => {
          console.log(err);
          ToastAndroid.show(
            'Erreur lors de la connexion',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        });
    },
    signOut: async () => {
      try {
        await SInfo.deleteItem('token', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        await SInfo.deleteItem('name', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        await SInfo.deleteItem('userId', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        dispatch({type: 'LOGOUT'});
      } catch (error) {
        console.log(error);
      }
    },
    signUp: async (name, password) => {
      console.log(
        'Essais d inscription avec name: ' +
          name +
          ' and password: ' +
          password,
      );
      let token = null; // Valeur par défaut, au cas ou
      let userId = null;
      let isEditing = null; // Est ce que cet user a lock un paragraphe ou non
      let storyName = null; // Si c'est le cas, alors il s'agit de l'histoire nommée storyName
      let paragraphId = null; // Et du paragraphe nommé paragraphId

      // La requete
      fetch(BaseURLUnlogged + '/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: {name: name, password: password}}),
      })
        .then(res => {
          res
            .json()
            .then(async res => {
              if (
                res.message ===
                'Successfully signed in. Successfully logged in.'
              ) {
                console.log(
                  "Succès de l'inscription, token = " + res.data.token,
                );
                token = res.data.token;
                userId = res.data.userId;
                isEditing = false;

                // On stocke en local les variables à garder en mémoire
                try {
                  await SInfo.setItem('token', token, {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                  });
                  await SInfo.setItem('name', name, {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                  });
                  await SInfo.setItem('userId', userId.toString(), {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                  });
                } catch (error) {
                  console.log(error);
                }

                // On dispatch les valeurs qu'on veut utiliser par la suite, ie le token et le name. Cela va actualiser la page et nous ammener sur la page d'accueil
                dispatch({
                  type: 'LOGIN',
                  name: name,
                  token: token,
                  userId: userId,
                  isEditing: isEditing,
                  storyName: storyName,
                  paragraphId: paragraphId,
                });
              } else {
                if (res.message === 'Incorrect login information.') {
                  console.log('Login failed');
                  ToastAndroid.show(
                    'Identifiants incorrects',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                } else {
                  console.log('Registeration failed');
                  ToastAndroid.show(
                    "Erreur lors de l'inscription",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                }
              }
            })
            .catch(error => {
              console.log(error);
              ToastAndroid.show(
                "Erreur lors de l'inscription",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            });
        })
        .catch(err => {
          console.log(err);
          ToastAndroid.show(
            "Erreur lors de l'inscription",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        });
    },
    lockParagraph: async (paragraphId, storyName) => {
      console.log('Vérouillage de la rédaction');
      try {
        dispatch({
          type: 'EDIT',
          isEditing: true,
          paragraphId: paragraphId,
          storyName: storyName,
        });
      } catch (error) {
        console.log(error);
      }
    },
    unlockParagraph: async () => {
      console.log('\nAbandon de la rédaction');
      try {
        fetch(
          BaseURLUnlogged +
            '/' +
            loginState.name +
            '/' +
            loginState.storyName +
            '/' +
            loginState.paragraphId +
            '/unwrite',
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              token: loginState.token,
            },
          },
        ).then(res => {
          console.log(
            "DELETE à l'adresse ",
            BaseURLUnlogged +
              '/' +
              loginState.name +
              '/' +
              loginState.storyName +
              '/' +
              loginState.paragraphId +
              '/unwrite',
          );
          res.json().then(res => {
            dispatch({
              type: 'EDIT',
              isEditing: false,
              paragraphId: null,
              storyName: null,
            });
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
  }));

  React.useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let token = null;
      let name = null;
      let userId = null;
      try {
        token = await SInfo.getItem('token', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        name = await SInfo.getItem('name', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        userId = await SInfo.getItem('userId', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
      } catch (error) {
        console.log(error);
      }

      dispatch({
        type: 'RETRIEVE_TOKEN',
        token: token,
        name: name,
        userId: userId,
      });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {loginState.token === null ? (
            <>
              <Stack.Screen
                options={{headerShown: false}}
                name="Auth"
                component={TabAuthFlow}
              />
            </>
          ) : (
            <Stack.Screen
              options={{headerShown: false}}
              name="Home"
              component={HomeFlow}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default () => {
  return <App />;
};
