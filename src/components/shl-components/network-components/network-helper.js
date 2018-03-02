import {
    wxRequest
} from './wxRequest';

const getAuthCode = function (para = {}) {
    var config = {
        method: 'GET',
        uri: 'vcode/login',
        params: para
    };
    return wxRequest(config);
};

const postLogin = function (para = {}) {
    var config = {
        method: 'POST',
        uri: 'user/sms-login',
        params: para
    };
    return wxRequest(config);
};

module.exports = {
    getAuthCode,
    postLogin
};
