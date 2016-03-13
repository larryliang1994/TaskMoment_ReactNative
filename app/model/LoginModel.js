/**
 * Created by Leunghowell on 16/3/13.
 */

var RequestUtil = require('./../common/RequestUtil');
var Constants = require('./../common/Constants');
var Urls = require('./../common/Urls');
var Config = require('./../common/Config');

module.exports = {
    doGetVerifyCode(telephone, successCallback, failCallback) {
        const soapKey = ["param", "type", "table_name", "feedback_url", "return"];
        const soapValue = ["ajax", "sms_send_verifycode", Config.Random, "", "1"];

        RequestUtil.requestWithSoap(soapKey, soapValue, {"mobile": telephone},
            function (responseJSON) {
                successCallback(responseJSON);
            },
            function (err) {
                failCallback('短信发送失败');
            });
    },

    doLogin(telephone, verifyCode, successCallback, failCallback) {
        const soapKey = ["param", "type", "table_name", "feedback_url", "return"];
        const soapValue = ["ajax", "mobile_login", Config.Random, "", "1"];

        RequestUtil.requestWithSoap(soapKey, soapValue, {"mobile": telephone, "check_code": verifyCode},
            function (responseJSON) {
                if(responseJSON.status == Constants.Success){
                    Config.Cookie = responseJSON.memberCookie;

                    const decodeKey = ["param", "string", "operation"];
                    const decodeValue = ["authcode", Config.Cookie, "DECODE"];

                    RequestUtil.soap("soap_server", Urls.SoapTarget, decodeKey, decodeValue,
                        function (response) {
                            console.warn(response);

                            const Json = JSON.parse(response);
                            Config.Mid = Json.id;
                            Config.Nickname = Json.real_name;
                            Config.Portrait = Urls.MediaCenterPortrait + Config.Mid + '.jpg';
                            Config.Mobile = Json.mobile;

                            if(Config.Nickname == '' || Config.Nickname == 'null') {
                                Config.Nickname = '昵称'
                            }

                            successCallback('登录成功');
                        }, function (status) {
                            failCallback('登录失败');
                        });
                } else {
                    failCallback(responseJSON.info);
                }
            },
            function (err) {
                failCallback('登录失败');
            });
    }
};