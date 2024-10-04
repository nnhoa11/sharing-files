const Files = require('../models/storage')

class FilesController {
    getFiles(req, res, next) {
        // Get all files from database and return them
        if (req.query.userId){
            Files.find({projectId: req.query.projectId})
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
        if (req.file){
            Files.create({
                project: req.body.userId,
                fileName: req.file.filename,
                originName: req.file.originalname,
            })
            res.json({ message: "Successfully uploaded files" });
        }
    }
}

module.exports = new FilesController;