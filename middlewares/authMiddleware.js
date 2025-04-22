const passport = require('passport');

function authorize(roles = []) {
    roles = [1, 2, 3, 4, 5, 6]; // default to Admin and Supervisor roles
    // roles param can be a single role string (e.g. 'Admin') or an array of roles (e.g. ['Admin', 'Supervisor'])
    if (typeof roles === 'string') {
        roles = [roles];
    } else if(Array.isArray(roles) && roles.length == 0) {
        
    }
    return [
        // authenticate JWT token and attach user to request object (req.user)
        passport.authenticate('jwt', { session: false }),

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role_id)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

module.exports = {
    authorize
};