import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  master: {
    padding: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    fontSize: 32,
    marginBottom: 18,
    alignSelf: 'center',
  },
  headerBlack: {
    color: 'black',
    fontSize: 32,
    marginBottom: 18,
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  textWarning: {
    color: 'gray',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  textLink: {
    fontSize: 16,
    marginTop: 16,
    color: 'blue',
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  box: {
    height: 200,
    width: '96%',
    borderWidth: 2,
    borderRadius: 10,
    margin: '2%',
  },
  flex1: {
    flex: 1,
  },
  histo: {
    flexDirection: 'row',
    fontSize: 18,
    marginTop: 16,
    color: 'grey',
  },
  histoChoice: {
    fontSize: 18,
    marginTop: 16,
    color: 'grey',
    textDecorationLine: 'underline',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const gradientColors = {begin: '#9f01ff', end: 'purple'};

export const buttonColors = [
  '#f301ff',
  '#ce00d8',
  '#a400ad',
  '#78007e',
  '#550059',
];
