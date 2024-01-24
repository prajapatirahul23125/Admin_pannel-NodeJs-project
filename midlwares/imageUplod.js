
const multer=require('multer');
const storage=multer.diskStorage({
    destination:function (req, file, cb) {
        cb(null, './views/img')
    },
    filename: function (req, file, cb) {
        const imguplod = 'imageUplod'+Date.now() + '-' + file.originalname
        cb(null,imguplod)
      }
})
const imageUplod = multer({storage});
// module.exports=imageUplod;

module.exports=imageUplod;