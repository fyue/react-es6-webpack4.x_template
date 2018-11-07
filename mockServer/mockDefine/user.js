module.exports = {
    '/user': function(req, res) {
        return {
            name: 'heha',
            age: 55,
        }
    },
    '/detail': function(req, res) {
        return {
            home: 'china',
            address: '四川',
        }
    }
}