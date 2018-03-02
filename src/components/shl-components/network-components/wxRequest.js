// import toast from '../example/toast';
import wepy from 'wepy';
import CryptoJS from 'crypto-js';

const wxRequest = async (config = {}) => {
    var finalDomin = 'https://center.api.sanhaolou.cn';
    let debugDomin = 'http://api.dev.geehao.com';
    let testDomin = 'http://api.test.geehao.com';
    let releaseDomin = 'https://center.api.sanhaolou.cn';
    finalDomin = debugDomin;
    console.log('wxRequest started');
    wx.showLoading({
        title: '加载中...'
    });
    let method = config.method;
    let uri = config.uri;
    let params = config.params;
    if (!method) {
        console.log('request 参数错误，method不能为空');
    }
    if (!uri) {
        console.log('request 参数错误，url不能为空');
    }
    var uriUnionApiVersion = '/v1/' + config.uri;
    let url = finalDomin + uriUnionApiVersion;
    let header = {};
    let user = {};
    user.secret = wx.getStorageSync('user').secret ? wx.getStorageSync('user').secret : '';
    user.token = wx.getStorageSync('user').token ? wx.getStorageSync('user').token : '';
    user.uid = wx.getStorageSync('user').uid ? wx.getStorageSync('user').uid : '';
    let time = new Date().getTime();
    let str = method + '\n' +
        uriUnionApiVersion + '\n' +
        user.token + '\n' +
        'x-sanhaolou-uid:' + user.uid + '\n' +
        'x-sanhaolou-time:' + time + '\n' +
        'x-sanhaolou-terminal:' + 'iOS' + '\n' +
        'x-sanhaolou-version:' + '1.0' + '\n';
    var paramsArray = [];
    if (params && Object.keys(params).length > 0) {
        for (var key in params) {
            var value = params[key];
            if (Array.isArray(value)) {
                for (var _v in value) {
                    paramsArray.push(key + '=' + encodeURIComponent(_v));
                }
            } else if (value !== undefined) {
                paramsArray.push(key + '=' + encodeURIComponent(value));
            }
        }
    }
    if (paramsArray.length > 0) {
        str += paramsArray.sort().join('&');
    }
    str += '\n';
    str = str.replace(/[~!'()]/g, escape);
    console.log('加密str' + str);
    let signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(str, user.secret)));
    let authorization = 'Basic ' + user.token + ':' + signature;
    header['Authorization'] = authorization;
    header['x-sanhaolou-uid'] = user.uid;
    header['x-sanhaolou-time'] = time;

    header['x-sanhaolou-terminal'] = 'iOS';
    header['x-sanhaolou-version'] = '1.0';
    header['Content-Type'] = 'application/x-www-form-urlencoded';
    console.log('authorization' + authorization);
    let res = await wepy.request({
        url: url,
        method: method,
        data: params,
        header: header,
    });
    wx.hideLoading();
    if (res && !res.error) {
        if (typeof config.success === 'function') {
            config.success(res);
        }
    }
    if (typeof config.fail === 'function') {
        config.fail(res);
    }
    return res;
};
module.exports = {
    wxRequest
};
