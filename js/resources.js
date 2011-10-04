function SiteResources() {
	var opt = {
		date: new Date
	}
	var data = {
		key1: {
			string: "John Daker",
			number: 123.456,
			object: opt.date,
			array: ["abc", 123, opt.date]
		},
		key2: {
			string: "Leeroy Jenkins",
			number: 234.567,
			object: new Date,
			array: ["abc", 123, opt.date]
		},
		key3: {
			string: "Rebecca Black",
			number: 345.678,
			object: opt.date,
			array: ["abc", 123, opt.date]
		},
		key4: {
			string: "Antoine Dodson",
			number: 456.789,
			object: opt.date,
			array: ["abc", 123, opt.date]
		},
		key5: {
			string: "Star Wars Boy",
			number: 567.890,
			object: opt.date,
			array: ["abc", 123, opt.date]
		}
	};
	var state = {};
	
	(function init() {
		initDatabase();
		initLocalStorage();
		initSessionStorage();
		initCookies();
	})();
	
	function initDatabase() {
		if (window.openDatabase) {
	        state.db = window.openDatabase(
				"BrowserTools", 
				"1.0", 
				"Database for Browser Tools Presentation", 
				2 * 1024 * 1024
			);

	        if (state.db) {
				console.log("Database initialized");
	        } else {
	            console.log("Unable to open database");
	        }
		}
	}
	
	function initLocalStorage() {
		for (var i in data) {
			window.localStorage.setItem(i, JSON.stringify(data[i]));
		}
	}
	
	function initSessionStorage() {
		for (var i in data) {
			window.sessionStorage.setItem(i, JSON.stringify(data[i]));
		}
	}
	
	function initCookies() {
		var exp = new Date;
		exp.setDate(exp.getDate() + 14);

		for (var i in data) {
			var val = escape(JSON.stringify(data[i])) + ";" + "expires=" + exp.toUTCString();
			document.cookie = i + "=" + val;
		}
	}
	
	return {
		webSQL: {
			createTable: function() {
		        state.db.transaction(function(tx) {
					var sqlCreate = 'CREATE TABLE IF NOT EXISTS map (id VARCHAR PRIMARY KEY, str TEXT, num REAL, obj BLOB, arr BLOB)';
		            tx.executeSql(sqlCreate, [], 
						function(tx, results) {
							console.log(results);
			            }, 
						function(tx, er) {
			                console.log(er);
			            }
					);
		        });
			},
			dropTable: function() {
		        state.db.transaction(function(tx) {
					var sqlCreate = 'DROP TABLE map';
		            tx.executeSql(sqlCreate, [], 
						function(tx, results) {
							console.log(results);
			            }, 
						function(tx, er) {
			                console.log(er);
			            }
					);
		        });
			},
			loadTable: function() {
				state.db.transaction(function(tx) {
				    var sqlInsert = 'INSERT OR REPLACE INTO map (id, str, num, obj, arr) VALUES (?, ?, ?, ?, ?)';
					for (var i in data) {
						var d = data[i];
			            tx.executeSql(sqlInsert, [i, d.string, d.number, d.object, d.array], 
							function(tx, results) {
				                console.log(results);
				            }, 
							function(tx, error) {
				                console.log(error);
			            	}
						);
					}
		        });
			},
			emptyTable: function() {
				state.db.transaction(function(tx) {
				    var sqlDelete = 'DELETE from map';
		            tx.executeSql(sqlDelete, [], 
						function(tx, results) {
			                console.log(results);
			            }, 
						function(tx, error) {
			                console.log(error);
		            	}
					);
		        });
			},
			findByKey: function(key) {
				state.db.transaction(function(tx) {
				    var sqlInsert = 'SELECT * FROM map WHERE id = ?';
		            tx.executeSql(sqlInsert, [key], 
						function(tx, results) {
			                console.log(results.rows.item(0));
			            }, 
						function(tx, error) {
			                console.log(error);
		            	}
					);
		        });
			}
		}
	}
};