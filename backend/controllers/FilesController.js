const Files = require('../models/storage')

class FilesController {
    getFiles(req, res, next) {
        // Get all files from database and return them
        console.log(req.query.userId)
        if (req.query.userId){
            Files.find()
            .then((files) => {
                res.json({success: true, files: files});
            })
            .catch((err) => {
                console.log(err)
                res.json({ success: false, message: err.message })
            })}
        else res.json({success: false, message: 'No files found'})
    }
    uploadFiles(req, res) {
        console.log(req.body);
        console.log(req.files);
        res.json({ message: "Successfully uploaded files" });
    }
}

module.exports = new FilesController;