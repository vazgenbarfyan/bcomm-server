const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET users listing. */
router.get('/', (req, res, next) => {
  const location = req.body.location;
  User.find({location: location})
    .then(users => {
      res.send(JSON.stringify({
        users: users
      }));
    }).catch(err => res.status(400).send(err));

});
// router.post('/', async (req, res, next) => {
//     const data = req.body;
//     const user = new User(data);
//     const result = await user.save();
//     console.log('user add/update result: ', result);
//     res.send(JSON.stringify({
//         status: result
//     }));
// });
// router.delete('/:user', async (req, res, next) => {
//     const id = req.params.user;
//     const user = await User.find({ _id: id});
//     const result = await user.remove();
//     console.log('user delete result: ', result);
//     res.send(JSON.stringify({
//         status: result
//     }));
// });


module.exports = router;