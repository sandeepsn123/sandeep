import {Image, View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import {useState} from 'react';
import axios from 'axios';

const App = () => {
  const [inputValue, setInputValue] = useState<any>()
  const [countrtInfoPage, setCountryInfoPage] = useState<boolean>(true)
  const [buttonShow, setButtonShow] = useState<boolean>(false)
  //country
  const [capitalName, setCapitalName] = useState<any>()
  const [countryPopulation, setCountryPopulation] = useState<any>()
  const [countryLatitude, setCountryLatitude] = useState<any>()
  const [countryLongitude, setCountryLongitude] = useState<any>()
  const [countryFalg, setCountryFlag] = useState<any>()
  //weather
  const [temperature, setTemparature] = useState<any>()
  const [weatherIcons, setWeatherIcons] = useState<any>()
  const [windSpeed, setWindSpeed] = useState<any>()
  const [precipitation, setPrecipitation] = useState<any>()
  const [weatherToggle, setWeatherToggle] = useState<boolean>(true)
  const [city, setCity] = useState<any>()

  let responseCountry = [];
  let countryInfo : any
  let access_key = '333f9f3b608a264a10967c37f6591381'
  let backButton = `< Back`

  if(inputValue && !buttonShow){
    setButtonShow(true)
  }else if(!inputValue && buttonShow){
    setButtonShow(false)
  }

  const afterResponse = () => {
    console.log(responseCountry[0].name.common,'testing',inputValue)
    if(responseCountry.length > 1){
      for(let i = 0; i < responseCountry.length; i++){
        if(responseCountry[i].name.common.toLowerCase() == inputValue.toLowerCase()){
          setCity(responseCountry[i].name.common)
          setCapitalName(responseCountry[i].capital[0])
          setCountryPopulation(responseCountry[i].population)
          setCountryLatitude(responseCountry[i].capitalInfo.latlng[0])
          setCountryLongitude(responseCountry[i].capitalInfo.latlng[1])
          setCountryFlag(responseCountry[i].flags.png)
          setCountryInfoPage(false)
          break;
        }
      }
    } else {
    setCity(responseCountry[0].name.common)
    setCapitalName(responseCountry[0].capital[0])
    setCountryPopulation(responseCountry[0].population)
    setCountryLatitude(responseCountry[0].capitalInfo.latlng[0])
    setCountryLongitude(responseCountry[0].capitalInfo.latlng[1])
    setCountryFlag(responseCountry[0].flags.png)
    setCountryInfoPage(false)
  }
  }

  const handleSubmit = () =>{
    axios.get(`https://restcountries.com/v3.1/name/${inputValue}`).then((response) => {
    console.log('ressssss',response.data)  
    if(response.data.length > 1){
        for(let i = 0; i < response.data.length; i++){
          responseCountry.push(response.data[i]) 
        }
        afterResponse();
      }else{
        responseCountry.push(response.data[0])
        afterResponse();
      }
    });
    setInputValue('')
  }

  const handleWeather = () => {
    axios.get(`http://api.weatherstack.com/current?access_key=${access_key}&query=${city}`).then((response) => {
      setWindSpeed(response.data.current.wind_speed)
      setTemparature(response.data.current.temperature)
      setPrecipitation(response.data.current.precip)
      setWeatherIcons(response.data.current.weather_icons[0])
    })
    setWeatherToggle(false)
  }

  const handleBackButton = () => {
    setCountryInfoPage(true)
  }

    return( countrtInfoPage ? 
      (<View>
        <View style={styles.inputTextBoxView}>
          <TextInput value={inputValue} style={styles.inputTextBox} placeholder="Enter Country" onChangeText={newText => setInputValue(newText)} />
        </View>
        <View style={styles.buttonView}>
          {
            buttonShow ? 
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyles}>
            <Text style={styles.buttonText}>submit</Text>
          </TouchableOpacity>
          :
          null
          }          
        </View>
      </View> ) : (
      weatherToggle ? (
        <View>
        <View>
          <TouchableOpacity onPress={handleBackButton}>
            <Text style={styles.backButtonText}>{backButton}</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center',marginTop : '25%'}}>
          <Text style={styles.countryInfoText}>Capital - {capitalName}</Text>
          <Text style={styles.countryInfoText}>Population - {countryPopulation}</Text>
          <Text style={styles.countryInfoText}>latitude - {countryLatitude}, longitude - {countryLongitude}</Text>
          <Image
            style={{width: 250, height: 250,resizeMode: 'contain',}}
            source={{
              uri: `${countryFalg}`,
            }}
            />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={handleWeather} style={styles.buttonStyles}>
            <Text style={styles.buttonText}>Capital Weather</Text>
          </TouchableOpacity>
        </View>
      </View>
      ):(
        <View>
          <View style={styles.inputTextBoxView}>
            <Text style={styles.countryInfoText}>Wind Speed - {windSpeed}</Text>
            <Text style={styles.countryInfoText}>temperature - {temperature}</Text>
            <Text style={styles.countryInfoText}>precipitation - {precipitation}</Text>
            <Image
            style={{width: 250, height: 250,padding : '5%'}}
            source={{
              uri: `${weatherIcons}`,
              // uri : 'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png',
            }}
            />
          </View>
        </View>
      )
      )
    )
}

const styles = StyleSheet.create({
    inputTextBox: {
      borderWidth : 2,
      borderColor : 'red',
      borderRadius  : 5,
      width : '80%',
      marginLeft : '10%',
      height : 50,
      fontWeight : 'bold',
      fontSize : 20,      
    },
    inputTextBoxView : {
      alignItems : 'center',
      marginTop : '15%'
    },
    buttonStyles : {
      borderWidth : 3,
      borderRadius : 5,
      width : "50%"
    },
    buttonText : {
      textAlign : 'center',
      fontSize : 25
    },
    buttonView : {
      marginTop : '5%',
      alignItems : 'center'
    },
    countryInfoText : {
      fontSize : 20,
      fontWeight : 'bold',
      padding : '0.5%'
    },
    backButtonText : {
      fontSize : 18,
      fontWeight : 'bold',
      color : 'black',
      padding : '3%'
    }

})
export default App