import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.registerLoginHandler(function(loginRequest) {
    if (!loginRequest.admin) {
        return undefined;
    }

    if (loginRequest.password != 'admin-password') {
        return {
          error: new Meteor.Error(403, 'Incorrect Admin Password')
        };
    }

    var userId = null;
    var user = Meteor.users.findOne({
        username: 'admin'
    });
    if (!user) {
        userId = Meteor.users.insert({
            username: 'admin'
        });
    } else {
        userId = user._id;
    }

    //creating the token and adding to the user
    var stampedToken = Accounts._generateStampedLoginToken();
    Meteor.users.update(userId, {
        $push: {
            'services.resume.loginTokens': stampedToken
        }
    });

    //sending token along with the userId
    return {
        userId: userId,
        token: stampedToken.token
    }
});
