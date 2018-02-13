/**
 *
 * @param db
 * @constructor
 */
var UserRepository = function (db) {
    if (!db) {
        throw 'db not defined';
    }

    this.db = db;
};

/**
 *
 * @param {User} user
 */
UserRepository.prototype.create = function (user) {
    if (!user) {
        throw 'User object is undefined';
    }

    if (!user.id || !user.firstname || !user.lastname || !user.birthday) {
        throw 'User object is missing information';
    }

    var userData = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday
    };
    
    this.db
        .get('users')
        .push(userData)
        .write()
};

/**
 *
 * @param {number} id
 * @return User
 */
UserRepository.prototype.findOneById = function (id) {

    if(!id) {
        throw 'id not defined';
    }

    var userData = {
        id: id
    };

    result = this.db
        .get('users')
        .find(userData)
        .value();

    if(result == undefined) {
        throw 'User id not found';
    }

    return result;
};

/**
 *
 * @param {User} user
 */
UserRepository.prototype.update = function (id, user) {

    if (!id || !user) {
        throw 'id and/or user are not defined';
    }

    if (!user.id || !user.firstname || !user.lastname || !user.birthday) {
        throw 'User object is missing information';
    }

    var findUserData = {
        id: id
    };

    var assignUserData = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday
    };

    var result = this.db
        .get('users')
        .find(findUserData)

    if(result.value() == undefined) {
        throw 'User id not found';
    }

    result
        .assign(assignUserData)
        .write()
        
};

/**
 *
 * @param {number} id
 */
UserRepository.prototype.delete = function (id) {

    if (!id) {
        throw 'id not defined';
    }

    var deleteUserData = {
        id: id
    };

    this.db
        .get('users')
        .remove(deleteUserData)
        .write()
};


module.exports = UserRepository;


