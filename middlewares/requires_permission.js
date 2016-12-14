function permissionFactory(level) {
    return function(req, res, next) {
        if (req.permission_level >= level) {
            next();
        } else {
            console.log("Rejected user with permisson level: " + req.permission_level)
            res.status(403).send();
        }
    }
}


module.exports = permissionFactory;
