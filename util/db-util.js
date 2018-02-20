'use strict';

// use the environment var from Heroku if set
const IS_DEBUG = process.env.NODE_ENV != "production";

const pg = require("pg");
pg.defaults.ssl = true; // doesn't work for many local installations
const url = require('url');
const squelGeneric = require("squel");
const squel = squelGeneric.useFlavour("postgres");

const DB_SCHEMA = "salesforce"; // default schema name for Heroku Connect
const DB_ROOM_TABLE = "battle_station__c";

const dbUtil = {};
var currentPool;

dbUtil.getPool = function() {
  if (!currentPool) {
    currentPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL
    });
  }
  return currentPool;
};

dbUtil.closePool = function() {
  if (currentPool) {
    currentPool.end();
  }
};

dbUtil.updateStationQuery = function() {
  return squel.update()
    .table(DB_SCHEMA + "." + DB_ROOM_TABLE)
    .set("alexa_is_ready__c", true)
    .where("name = $1")
    .toString();
};

dbUtil.getStationQuery = function() {
  return dbUtil.getBaseStationQuery()
    .where("name = $1")
    .toString();
};

dbUtil.getStationsToActivateQuery = function() {
  return dbUtil.getBaseStationQuery()
    .where("project_status__c = ?", "Green")
    .where("name = $1")
    .order("name")
    .limit(5)
    .toString();
};

dbUtil.getBaseStationQuery = function() {
  return squel.select()
    .from(DB_SCHEMA + "." + DB_ROOM_TABLE)
    .field("project_status__c")
    .field("alexa_is_ready__c")
    .field("name")
    .field("sfid");
};

dbUtil.getStations = function(newName) {
  return new Promise(function(resolve, reject) {
    const queryToRun = {
      text: dbUtil.getStationQuery(),
      values: [newName]
    };

    dbUtil.getPool().query(queryToRun)
      .then( res => {
        resolve(res.rows);
      })
      .catch( e => console.error(e.stack) );
  });
};

dbUtil.updateStation = function(newName) {
  return new Promise(function(resolve, reject) {
    const queryToRun = {
      text: dbUtil.updateStationQuery(),
      values: [newName]
    };

    dbUtil.getPool().query(queryToRun)
      .then( res => {
        resolve(res.rows);
      })
      .catch( e => console.error(e.stack) );
  });
};

dbUtil.getStationsToActivate = function() {
  return new Promise(function(resolve, reject) {
    const queryToRun = {
      text: dbUtil.getStationsToActivateQuery()
    };

    dbUtil.getPool().query(queryToRun)
      .then( res => {
        resolve(res.rows);
      })
      .catch( e => console.error(e.stack) );
  });
};

dbUtil.getStationListResponse = function(rows) {
  var response = "";
  var addedText = false;
  rows.forEach((row) => {
    var nm = row.name;
    if (!addedText) {
      response += nm;
    } else {
      response += ", " + nm;
    }
  });

  if (IS_DEBUG) {
    console.log("getListResponse: " + response);
  }

  return response;
};

module.exports = dbUtil;
