
const AuthUser = require('./user')
const FileRoute = require('./files')
const ProjectRoute = require('./project')
function route(app){
    app.use(AuthUser);
    app.use(FileRoute);
    app.use(ProjectRoute);
}

module.exports = route