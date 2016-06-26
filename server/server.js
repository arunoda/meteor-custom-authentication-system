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

    //sending token along with the userId
    return {
        userId: userId
    }
});
