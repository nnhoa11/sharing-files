
const AuthUser = require('./user')
const FileRoute = require('./files')

function route(app){
    app.use(AuthUser);
    app.use(FileRoute);
}

module.exports = route