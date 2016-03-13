/**
 * Created by Leunghowell on 16/3/10.
 */

var React = require('react-native');
var Dimensions = require('Dimensions');

var {
    PixelRatio,
    ActivityIndicatorIOS
    } = React;

module.exports = {
    /*最小线宽*/
    pixel: 1 / PixelRatio.get(),

    color: {
        colorPrimary: '#2B2C30',
        gray: '#bdbdbd'
    },

    /*屏幕尺寸*/
    size: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },

    /*loading效果*/
    loading: <ActivityIndicatorIOS color="#3E00FF" style={{marginTop:40,marginLeft:Dimensions.get('window').width/2-10}}/>,

    getRandomNum(Min , Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    },

    isTelephone(telephone) {
        if(/^[1][35789][0-9]{9}$/.test(telephone)) {
            return true;
        } else {
            return false;
        }
    }
};