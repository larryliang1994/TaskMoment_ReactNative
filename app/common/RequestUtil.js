/**
 * Created by Leunghowell on 16/3/12.
 */

var React = require('react-native');
var Urls = require('./Urls');

var RequestUtil = {
    requestWithCookie: function () {

    },

    requestWithSoap: function (soapKey, soapValue, params, successCallback, failCallback) {
        this.soap("soap_server", Urls.SoapTarget, soapKey, soapValue,
            function (response) {
                RequestUtil.request(Urls.ServerUrl + "/act/ajax.php?a=" + response + "&is_app=1", params,
                    function (responseJSON) {
                        successCallback(responseJSON);
                    },
                    function (err) {
                        failCallback(err);
                    });
            }, function (err) {
                failCallback(err);
            });
    },

    request: function (url, params, successCallback, failCallback) {

        fetch(url, {
            method: "POST",
            body: this.toQueryString(params)
        })
            .then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            })
            .catch(function (err) {
                failCallback(err);
            });
    },

    soap: function (functionName, target, key, value, successCallback, failCallback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', target, true);

        var soapMessage =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soapenv:Envelope ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xmlns:api="http://127.0.0.1/Integrics/Enswitch/API" ' +
            'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
            'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soapenv:Body>' +
            '<api:' + functionName + ' soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';

        for (var i = 0; i < key.length; i++) {
            soapMessage += '<' + key[i] + ' xsi:type="xsd:string">' + value[i] + '</' + key[i] + '>';
        }

        soapMessage += '</api:' + functionName + '>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4)
                if (xmlhttp.status == 200) {
                    var str = xmlhttp.responseText.substring(
                        xmlhttp.responseText.indexOf('<return xsi:type="xsd:string">') + 30,
                        xmlhttp.responseText.indexOf('</return>'));

                    successCallback(str);
                } else {
                    failCallback(xmlhttp.status)
                }
        };

        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(soapMessage);
    },

    toQueryString(obj) {
        return obj ? Object.keys(obj).sort().map(function (key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                return val.sort().map(function (val2) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                }).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }).join('&') : '';
    }
};

module.exports = RequestUtil;