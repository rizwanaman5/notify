var express = require('express');
var router = express.Router();
const webpush = require('web-push');
const db = require('../models/index');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// =======================================

const PublicVapidKey =
  'BDbrhofwfXZqk5C1_ogIjix1Io5sNXOxi1ZqBj8USvjWH_beH_moEkXgnu14qeI0RNMEkCAng-xjc7107T_o7aQ';
const PrivateVapidKey = 'kj6SKVfx46K6C2kGcj5IKMxtycjArghPq9B2amYjDZE';

// =======================================

webpush.setVapidDetails('mailto:rizwanaman5@gmail.com', PublicVapidKey, PrivateVapidKey);

// Subscribe Route
router.post('/subscribe', (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  console.log(subscription);

  db.User.create(subscription)
    .then((data) => {
      res.send(data);
      console.log(data);

      // Create payload
      const payload = JSON.stringify({
        title:
          'If you are seeing this notification, you have successfully subscribed to notifications.',
      });

      // Pass object into sendNotification
      webpush.sendNotification(subscription, payload).catch((err) => console.error(err));
    })
    .catch((err) => res.send(err));
});

router.post('/push', (req, res) => {
  const payload = {
    title: req.body.title,
    message: req.body.message,
    url: req.body.url,
    ttl: req.body.ttl,
    icon: req.body.icon,
    image: req.body.image,
    badge: req.body.badge,
    tag: req.body.tag,
  };

  // all the subscription users
  db.User.find({})
    .then((users) => {
      let messages = users.map((user) => {
        return new Promise((resolve, reject) => {
          const pushObj = {
            endpoint: user.endpoint,
            keys: {
              p256dh: user.keys.p256dh,
              auth: user.keys.auth,
            },
          };

          const pushPayload = JSON.stringify(payload);

          const pushOptions = {
            vapidDetails: {
              subject: 'http://example.com',
              privateKey: PrivateVapidKey,
              publicKey: PublicVapidKey,
            },
            TTL: payload.ttl,
            headers: {},
          };

          webpush
            .sendNotification(pushObj, pushPayload, pushOptions)
            .then((value) => {
              resolve({
                status: true,
                endpoint: user.endpoint,
                data: value,
              });
            })
            .catch((err) => {
              reject({
                status: false,
                endpoint: user.endpoint,
                data: err,
              });
            });
        });
      });

      res.send('sent data');
    })
    .catch((err) => res.send(err));
});

module.exports = router;
