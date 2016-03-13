/**
 * Created by Leunghowell on 16/3/6.
 */
'use strict';

import React, {
    Text,
    View,
    Component,
    ScrollView,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

var Util = require('./../common/Util');
var Config = require('./../common/Config');
var CountDown = require('./../widget/CountDown');
var TimerMixin = require('react-timer-mixin');
var LoginModel = require('./../model/LoginModel');

var telephone = '';
var verifyCode = '';

class TopView extends Component {
    render() {
        return (
            <View
                style={styles.imgBg}>
                <Image
                    style={styles.img}
                    source={require('./../image/portrait_default.jpg')}
                    resizeMode="contain"/>
            </View>
        );
    }
}

var TelephoneView = React.createClass({
    mixins: [TimerMixin],

    getInitialState() {
        return {
            time: 60,
            text: '获 取',
            enable: false,
            backgroundColor: Util.color.gray
        };
    },

    handleInput(text) {
        telephone = text;

        this.updateState(false);

        if (!Util.isTelephone(telephone)) {
            this.props.updateChange('login', false);
        } else if (verifyCode.length == 6) {
            this.props.updateChange('login', true);
        }
    },

    updateState(finishedCountdown) {
        if (this.state.time != 60) {
            if (finishedCountdown) {
                if (Util.isTelephone(telephone)) {
                    this.setState({
                        time: 60,
                        text: '获 取',
                        enable: true,
                        backgroundColor: Util.color.colorPrimary
                    });
                } else {
                    this.setState({
                        time: 60,
                        text: '获 取',
                        enable: false,
                        backgroundColor: Util.color.gray
                    });
                }

            } else {
                this.setState({
                    text: this.state.time + ' 秒',
                    enable: false,
                    backgroundColor: Util.color.gray
                });
            }
        } else {
            if (Util.isTelephone(telephone)) {
                this.setState({
                    time: 60,
                    text: '获 取',
                    enable: true,
                    backgroundColor: Util.color.colorPrimary
                });
            } else {
                this.setState({
                    time: 60,
                    text: '获 取',
                    enable: false,
                    backgroundColor: Util.color.gray
                });
            }
        }
    },

    doGetVerifyCode() {

        if (!Util.isTelephone(telephone) || !this.state.enable) {
            return;
        }

        this.countdown();

        LoginModel.doGetVerifyCode(telephone,
            function (responseJSON) {
                alert(responseJSON.info);
            },
            function (err) {
                alert(err);
            });
    },

    countdown(){
        var timer = function () {
            var time = this.state.time - 1;
            this.setState({
                time: time,
                text: time + ' 秒',
                enable: false,
                backgroundColor: Util.color.gray
            });
            if (time > 0) {
                this.setTimeout(timer, 1000);
            } else {
                this.updateState(true);
            }
        };
        this.setTimeout(timer.bind(this), 1000);
    },

    render() {
        return (
            <View style={styles.subContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="手机号"
                    keyboardType="numeric"
                    maxLength={11}
                    numberOfLines={1}
                    onChangeText={(text) => {
                        this.handleInput(text)
                        }}/>

                <TouchableOpacity
                    style={[styles.verifyBtn, {backgroundColor:this.state.backgroundColor}]}
                    onPress={this.doGetVerifyCode}>
                    <Text style={styles.fontFFF}>{this.state.text}</Text>
                </TouchableOpacity>

            </View>
        );
    }
});

class VerifyCodeInput extends Component {
    handleUpdateChange(text) {
        verifyCode = text;

        if (text.length == 6) {
            this.props.updateChange('login', true);

            if (Util.isTelephone(telephone)) {
                this.props.updateChange('verify', true);
            }
        } else {
            this.props.updateChange('login', false);
        }
    }

    render() {
        return (
            <View style={styles.subContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="验证码"
                    keyboardType="numeric"
                    maxLength={6}
                    numberOfLines={1}
                    onChangeText={(text) => {
                        this.handleUpdateChange(text)
                        }}/>
            </View>
        );
    }
}

class LoginBtn extends Component {
    doLogin() {
        if (!Util.isTelephone(telephone) || verifyCode.length != 6) {
            return;
        }

        LoginModel.doLogin(telephone, verifyCode,
            function (response) {
                alert(response)
            },
            function (err) {
                alert(err);
            });
    }

    render() {
        return (
            <View style={styles.subContainer}>
                <TouchableOpacity
                    style={[styles.loginBtn, {backgroundColor:this.props.background}]}
                    onPress={this.doLogin}>
                    <Text style={styles.fontFFF}>登 录</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

var Login = React.createClass({
    getInitialState() {
        return {
            getVerifyBtnBackground: Util.color.gray,
            loginBtnBackground: Util.color.gray
        };
    },

    enableBtn(which, enable) {
        if (which === 'login') {
            this.setState({
                loginBtnBackground: (enable ? Util.color.colorPrimary : Util.color.gray)
            });
        }
    },

    render() {
        return (
            <ScrollView bounces={false} >
                <View style={styles.container}>
                    <TopView/>

                    <TelephoneView updateChange={this.enableBtn}/>

                    <VerifyCodeInput updateChange={this.enableBtn}/>

                    <LoginBtn background={this.state.loginBtnBackground}/>

                </View>
            </ScrollView>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },

    imgBg: {
        backgroundColor: Util.color.colorPrimary,
        height: 150,
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'center'
    },

    img: {
        width: 70,
        height: 70,
        borderRadius: 35
    },

    subContainer: {
        flexDirection: 'row',
        width: Util.size.width,
        marginTop: 16,
        paddingLeft: 16,
        paddingRight: 16
    },

    input: {
        flex: 1,
        borderWidth: Util.pixel,
        height: 40,
        borderColor: '#DDDDDD',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15
    },

    verifyBtn: {
        width: 70,
        height: 40,
        marginLeft: 16,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    loginBtn: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    fontFFF: {
        color: '#ffffff',
        fontSize: 15
    }

});

module.exports = Login;