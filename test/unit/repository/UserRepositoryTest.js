var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var UserRepository = require('../../../src/repository/UserRepository');


describe("UserRepository", function() {
    it("should call db.write", function(){
        var mockDb = jasmine.createSpyObj('db', ['get', 'push', 'write']);
        mockDb.get.and.returnValue(mockDb);
        mockDb.push.and.returnValue(mockDb);

        var repository = new UserRepository(mockDb);
        repository.create({
            id : 1,
            firstname: 'John',
            lastname : 'Doe',
            birthday : '2000-01-01'
        });

        expect(mockDb.push).toHaveBeenCalledWith({
            id : 1,
            firstname: 'John',
            lastname : 'Doe',
            birthday : '2000-01-01'
        });
        expect(mockDb.write).toHaveBeenCalledTimes(1);
    });

    it("should call db.value", function(){
        var mockDb = jasmine.createSpyObj('db', ['get', 'find', 'value']);
        mockDb.get.and.returnValue(mockDb);        
        mockDb.find.and.returnValue(mockDb);
        mockDb.value.and.returnValue('test');


        var repository = new UserRepository(mockDb);
        var result = repository.findOneById(1);

        expect(mockDb.find).toHaveBeenCalledWith({
            id : 1
        });

        expect(mockDb.value).toHaveBeenCalledTimes(1);
    });

    
    it("should throw exception missing id object", function(){
        const db = low(new FileSync('dbtest.json'));

        // Defaults
        db.defaults({
          "users": [
            {
              "id": "d02eeb72-d2a3-4f14-a709-b65ed5e5bb9b",
              "firstname": "John",
              "lastname": "doe",
              "birthday": "2001-01-10"
            }
          ]
        }).write()

        var repository = new UserRepository(db);
        var f = function(){
            repository.findOneById("coucou");
        };

        expect(f).toThrow('User object doesn\'t exist')
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