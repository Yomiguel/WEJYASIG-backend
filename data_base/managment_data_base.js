//Actualización base de datos
const db = require("./dbconexion");

const updateDb = (
    tableName,
    columnName2Change,
    newValue,
    columnCondition,
    conditionValue
  ) => {
    db.none(
      `UPDATE ${tableName} SET ${columnName2Change} = ${newValue} WHERE ${columnCondition} = '${conditionValue}';`
    );
  };
  
  //updateDb("estaciones", "pm25", 93, "cod", `'D29TTGOT7D4D7A'`);
  
  //Consulta base de datos
  
  const queryDb = (
    columnName2Query,
    tableName,
    columnCondition,
    conditionValue
  ) => {
    db.any(`SELECT ${columnName2Query} FROM ${tableName} WHERE ${columnCondition} = '${conditionValue}' ;`)
      .then(function (data) {
        console.log("DATA:", data);
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  };
  
  //queryDb("pm25", "estaciones", "cod", `'D29TTGOT7D4D7A'`);

module.exports = { queryDb, updateDb };