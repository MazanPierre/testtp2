var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var UserRepository = require('../../../src/repository/UserRepository');


describe("UserRepository", function() {
    describe("create", function() {
        it("should call db.write", function(){
            var mockDb = jasmine.createSpyObj('db', ['get', 'push', 'write']);
            mockDb.get.and.returnValue(mockDb);
            mockDb.push.and.returnValue(mockDb);

            var value = {
                id : 1,
                firstname: 'John',
                lastname : 'Doe',
                birthday : '2000-01-01'
            };

            var repository = new UserRepository(mockDb);
            repository.create(value);

            expect(mockDb.push).toHaveBeenCalledWith(value);
            expect(mockDb.write).toHaveBeenCalledTimes(1);
        });

        it("should throw exception undefined", function(){
            var repository = new UserRepository({});
            var f = function(){
                repository.create();
            };

            expect(f).toThrow('User object is undefined')
        });

        it("should throw exception missing information", function(){
            var repository = new UserRepository({});
            var f = function(){
                repository.create({
                    'id' : 1
                });
            };

            expect(f).toThrow('User object is missing information')
        });
    });

    describe("findOneById", function() {
        it("should call db.find", function(){
            var mockDb = jasmine.createSpyObj('db', ['get', 'find', 'value']);
            mockDb.get.and.returnValue(mockDb);        
            mockDb.find.and.returnValue(mockDb);
            mockDb.value.and.returnValue('defined');


            var repository = new UserRepository(mockDb);
            var result = repository.findOneById(1);

            expect(mockDb.find).toHaveBeenCalledWith({
                id : 1
            });

            expect(mockDb.value).toHaveBeenCalledTimes(1);
        });

        it("should throw exception find undefined id", function(){
            const db = low(new FileSync('dbtest.json'));

            // Defaults
            db.defaults({})

            var repository = new UserRepository(db);
            var f = function(){
                repository.findOneById();
            };

            expect(f).toThrow('id not defined')
        });

        it("should throw exception find missing id", function(){
            const db = low(new FileSync('dbtest.json'));

            // Defaults
            db.defaults({})

            var repository = new UserRepository(db);
            var f = function(){
                repository.findOneById("coucou");
            };

            expect(f).toThrow('User id not found')
        });
    });

    describe("update", function() {
        it("should call db.set", function(){
            var mockDb = jasmine.createSpyObj('db', ['get', 'find', 'value', 'assign', 'write']);
            mockDb.get.and.returnValue(mockDb);        
            mockDb.find.and.returnValue(mockDb);
            mockDb.value.and.returnValue('defined');
            mockDb.assign.and.returnValue(mockDb);

            var value = {
                id : 1,
                firstname: 'Johanna',
                lastname : 'Doe',
                birthday : '2018-02-12'
            };

            var repository = new UserRepository(mockDb);
            repository.update(1, value);

            expect(mockDb.find).toHaveBeenCalledWith({id : 1});
            expect(mockDb.assign).toHaveBeenCalledWith(value);
            expect(mockDb.write).toHaveBeenCalledTimes(1);
        });

        it("should throw exception set missing id/user", function(){
            var repository = new UserRepository({});
            var f = function() {repository.update();};
            var g = function() {repository.update('ok');};
            var h = function() {repository.update(undefined, 'ok');};

            expect(f).toThrow('id and/or user are not defined')
            expect(g).toThrow('id and/or user are not defined')
            expect(h).toThrow('id and/or user are not defined')
        });

        it("should throw exception missing information about user", function(){
            var repository = new UserRepository({});
            var f = function(){
                repository.update(1, {
                    'id' : 1
                });
            };

            expect(f).toThrow('User object is missing information')
        });

        it("should throw exception user to update not find", function(){
            const db = low(new FileSync('dbtest.json'));

            // Defaults
            db.defaults({})

            var repository = new UserRepository(db);
            var f = function(){
                repository.update("c", {'id' : 1, 'firstname' : 1, 'lastname' : 1, 'birthday' : 1});
            };

            expect(f).toThrow('User id not found')
        });
    });

    describe("delete", function() {
        it("should call db.remove", function(){
            var mockDb = jasmine.createSpyObj('db', ['get', 'remove', 'write']);
            mockDb.get.and.returnValue(mockDb);        
            mockDb.remove.and.returnValue(mockDb);

            var repository = new UserRepository(mockDb);
            repository.delete(1);

            expect(mockDb.remove).toHaveBeenCalledWith({id:1});
            expect(mockDb.write).toHaveBeenCalledTimes(1);
        });

        it("should throw exception delete undefined id", function(){
            const db = low(new FileSync('dbtest.json'));

            // Defaults
            db.defaults({})

            var repository = new UserRepository(db);
            var f = function(){
                repository.delete();
            };

            expect(f).toThrow('id not defined')
        });
    });
});