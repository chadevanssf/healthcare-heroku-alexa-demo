'use strict';

// use the environment var from Heroku if set
const IS_DEBUG = process.env.NODE_ENV != "production";

const violet = require('../lib/violet_mod/lib/violet.js').script();
const dbUtil = require("../util/db-util");

// must match the input types
const STATION_NAME = 'targetName';

violet.addInputTypes({
  'targetName': 'AMAZON.LocalBusiness',
});

//common across multiple goals
violet.addPhraseEquivalents([
]);

violet.respondTo({
  expecting: ['Stations to Activate', 'List of stations to activate', 'What are the stations to activate'],
  resolve: (response) => {
    response.addGoal('list');
  }});

violet.respondTo({
  expecting: ['Update station', 'Finish station', 'Activate station'],
  resolve: (response) => {
    response.addGoal('activate');
}});

violet.respondTo({
  expecting: ['Set my station'],
  resolve: (response) => {
    response.addGoal('targetName');
}});

violet.defineGoal({
  goal: 'list',
  resolve: function (response) {
    // make sure to return the promise so that the async call resolves
    return dbUtil.getStationsToActivate()
      .then((rows) => {
        var reponse = dbUtil.getStationListResponse(rows);
        response.say(`The list of stations to activate are ${reponse}`);
      });
}});


violet.defineGoal({
  goal: 'activate',
  resolve: function (response) {
    if (!response.ensureGoalFilled('targetName')) {
      return false; // dependent goals not met
    }

    var tName = response.get(STATION_NAME);

    var resp1 = `Got it. I am updating station ${tName} now`;
    var resp1 = `I will update station ${tName} right away`;

    response.say([resp1,resp2]);

    return dbUtil.updateStation(tName)
      .then((rows) => {
        response.say(`Succesfully updated station ${tName} to active.`);

        response.clear(STATION_NAME);
      });
}});

violet.defineGoal({
  goal: 'targetName',
  prompt: 'What station?',
  respondTo: [{
    expecting: [`[[${STATION_NAME}]]`],
    resolve: (response) => {
      var tName = response.get(STATION_NAME);
      if (IS_DEBUG) {
        response.say(`Got it, station ${tName}}`);
      }
      response.set(STATION_NAME, tName);
  }}]
});

module.exports = violet;
