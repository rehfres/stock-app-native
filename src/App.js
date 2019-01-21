import React from 'react';
import { StyleSheet, Text, TextInput, FlatList, View } from 'react-native';
import Stock from './Stock';
// import { tryToGetUserId, signIn, signOut, getSymbolsFromDb, addSymbolToDb, deleteSymbolFromDb, reorderSymbolsInDb } from './firebase';
// // import { Container, Draggable } from 'react-smooth-dnd';
import { initCanvasSize } from './draw'
// import SignInOut from './SignInOut'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '123',
      symbolsListActive: ['TSTT'],
      symbolsList: [],
      searchList: ['TST', 'QEG', 'BWBWE'],
      canvasSize: {
        height: 35,
        width: 100
      },
      counter: 0,
      signedIn: null
    };
    // this.search = this.search.bind(this);
    // this.reorderCharts = this.reorderCharts.bind(this);
    this.initCanvasSizes = this.initCanvasSizes.bind(this);
    // this.signInOut = this.signInOut.bind(this);
  }
  getSymbolsList() {
    return fetch('https://api.iextrading.com/1.0/ref-data/symbols?filter=symbol')
      .then(response => response.json())
      .then(r => {
        const symbolsList = r.map(el => el.symbol)
        this.setState(state => ({...state, symbolsList, searchList: state.symbolsList}));
      })
  }
  async getSymbolsListActive() {
    const symbolsListActive = await getSymbolsFromDb();
    console.log('%c⧭', 'color: #2516c7', symbolsListActive);
    this.setState(state => ({...state, symbolsListActive}));
    console.log('%c⧭', 'color: #c76f16', this.state.symbolsListActive);
  }
  search(event) {
    const search = (event.target ? event.target.value : event).toUpperCase();
    const searchList = this.state.symbolsList.filter(el => el.startsWith(search)) || [];
    this.setState(state => ({...state, searchList: searchList, search}));
  }
  tryToAddSymbolChart(symbol) {
    if (!this.state.symbolsListActive.some(el => el === symbol)) {
      this.setState(state => ({...state, symbolsListActive: state.symbolsListActive.concat([symbol])}));
      return this.state.signedIn ? addSymbolToDb(symbol) : null;
    }
  }
  initCanvasSizes() {
    console.log('%c⧭', 'color: #16c72e', window.devicePixelRatio);
    this.setState(state => ({...state, canvasSize: {
      height: 35,
      width: 100
    }}), () => initCanvasSize(this.state.canvasSize));
  }
  signInOut() {
    if (!this.state.signedIn) {
      signIn().then(() => {
        this.setState(state => ({...state, signedIn: true}));
        this.getSymbolsListActive()
      });
    } else {
      signOut().then(() => {
        this.setState(state => ({...state, signedIn: false, symbolsListActive: []}));
      });
    }
  }
  componentDidMount() {
    this.initCanvasSizes();
    // tryToGetUserId().then(signedIn => {
    //   console.log('%c⧭s', 'color: #16c7a1', signedIn);
    //   this.setState(state => ({...state, signedIn}));
    //   if (signedIn) {
    //     this.getSymbolsListActive()
    //   }
    // });
    // this.getSymbolsList().then(() => this.search(this.state.search));
  }
  render() {
    console.log('%c⧭', 'color: #c7166f', this.state.searchList);
    return (
      <View style={styles.App}>
      {/* <Text>Open up App.js to start woOOrking on your app!</Text> */}
        {/* <p>{window.devicePixelRatio}</p> */}
        <TextInput style={styles.searchBar} placeholder="Search" value={this.state.search} onChangeText={(text) => this.search(text)}/>
        <FlatList
          data={this.state.searchList.slice(0, 28)}
          renderItem={({item}) => <Text onPress={() => this.tryToAddSymbolChart(item)}>{item}</Text>}
        />
        <View style={styles.chartsContainer}>
          {this.state.symbolsListActive.map(symbol => (
            // <Text>{symbol}</Text>
            <Stock symbol={'symbol'} canvasSize={this.state.canvasSize}/>
          ))}
        </View>
        {/* {this.state.signedIn !== null && <SignInOut atClick={this.signInOut} signedIn={this.state.signedIn}/>} */}
      </View>
    );
  }
}

{/* <View style={styles.container}>
<Text>Open up App.js to start woOOrking on your app!</Text>
</View> */}

const styles = StyleSheet.create({
  App: {},
  searchBar: {
    marginTop: 30
  },
  cont: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartsContainer: {}
});
