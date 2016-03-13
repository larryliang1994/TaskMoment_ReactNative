/**
 * Created by Leunghowell on 16/3/6.
 */
'use strict';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator
} from 'react-native';

var Login = require('./view/login');
var Util = require('./common/Util');
var Config = require('./common/Config');

class Entry extends Component {
    render() {
        return (
            <Navigator
                initialRoute= {{
                    component: Main
                }}
                configureScene={() => {
                    return Navigator.SceneConfigs.FloatFromBottom;
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    if(route.component) {
                        return <Component {...route.params} navigator={navigator} />
                    }
                }} >

            </Navigator>
        );
    }
}

var Main = React.createClass({
    render: function () {
        Config.Random = Util.getRandomNum(10000, 99999);

        setTimeout(this.show, 3000);

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}/>

                <View style={styles.item}>
                    <Image
                        style={styles.img}
                        source={require('./image/icon_round.png')}
                        resizeMode="contain"/>
                </View>

                <View style={styles.item}>
                    <Text style={styles.appName}>任务圈</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.desc}>简洁, 不简单</Text>
                </View>

                <View style={{flex: 1}}/>

                <View style={styles.bottomItem}>
                    <Text style={styles.copyRight}>©2015-2016. JIUBAI.</Text>
                </View>
            </View>
        );
    },

    show: function () {
        this.props.navigator.replace({
            component: Login
        });
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },

    item: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8
    },

    img: {
        width: 80,
        height: 80
    },

    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212121'
    },

    desc: {
        color: '#767676',
        height: 200
    },

    bottomItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16
    },

    copyRight: {
        color: '#767676',
        fontSize: 12
    }
});

module.exports = Entry;