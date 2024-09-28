"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db
    .createTable("subjects", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", length: 100, notNull: true, unique: true },
      created_at: {
        type: "timestamp",
        notNull: true,
        defaultValue: new String("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        defaultValue: new String("CURRENT_TIMESTAMP"),
      },
    })
    .then(function () {
      return db.createTable("questions", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        subject_id: {
          type: "int",
          notNull: true,
          foreignKey: {
            name: "questions_subject_id_fk",
            table: "subjects",
            mapping: "id",
            rules: {
              onDelete: "CASCADE",
              onUpdate: "RESTRICT",
            },
          },
        },
        question_text: { type: "text", notNull: true },
        answer1: { type: "text", notNull: true },
        answer2: { type: "text", notNull: true },
        answer3: { type: "text", notNull: true },
        answer4: { type: "text", notNull: true },
        correct_answer: { type: "int", notNull: true }, // Stores the index of the correct answer (1-4)
        created_at: {
          type: "timestamp",
          notNull: true,
          defaultValue: new String("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: "timestamp",
          notNull: true,
          defaultValue: new String("CURRENT_TIMESTAMP"),
        },
      });
    });
};

exports.down = function (db) {
  return db.dropTable("questions").then(function () {
    return db.dropTable("subjects");
  });
};

exports._meta = {
  version: 1,
};
