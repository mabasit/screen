define({ "api": [
  {
    "type": "get",
    "url": "/actors",
    "title": "Show actors",
    "group": "Actors",
    "description": "<p>Get all the actors (actors and org)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "paginate",
            "defaultValue": "20",
            "description": "<p>Number of results per page.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"ASC\"",
              "\"DESC\""
            ],
            "optional": false,
            "field": "sort",
            "defaultValue": "ASC",
            "description": "<p>Sort as.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"actor\"",
              "\"org\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Type of the actor.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/actors/index.js",
    "groupTitle": "Actors",
    "name": "GetActors"
  },
  {
    "type": "get",
    "url": "/actors/{login}",
    "title": "Show actor",
    "group": "Actors",
    "description": "<p>Get user along with its details and repositories contributed to.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>Users login id.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The login of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": true,\n\t\t \"message\": \"The requested user does not exist\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/api/actors/index.js",
    "groupTitle": "Actors",
    "name": "GetActorsLogin"
  },
  {
    "type": "get",
    "url": "/actors/{login}/repositories/popular",
    "title": "Show repository with most events",
    "group": "Actors",
    "description": "<p>Show the repository with highest number of events based on actor's login. If multiple repositories have same number of events, th eone with latest event is shown.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>Users login id.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The login of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": true,\n\t\t \"message\": \"The requested user does not exist\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/api/actors/index.js",
    "groupTitle": "Actors",
    "name": "GetActorsLoginRepositoriesPopular"
  },
  {
    "type": "delete",
    "url": "/actors/{login}/events/{eventId}",
    "title": "Delete event",
    "group": "Events",
    "description": "<p>Delete event user based on user login and event id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "login",
            "description": "<p>Users login id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "eventId",
            "description": "<p>Events id.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The login of the User was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EventNotFound",
            "description": "<p>The event was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": true,\n\t\t \"message\": \"The requested resource does not exist\"\n    }\n    HTTP/1.1 422 Unprocessible Entity\n    {\n      \"error\": true,\n\t\t \"message\": \"The user login is invalid\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 202 OK\n{'success': true, 'message': \"Event deleted successfully.\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/api/actors/index.js",
    "groupTitle": "Events",
    "name": "DeleteActorsLoginEventsEventid"
  },
  {
    "type": "get",
    "url": "/repositories",
    "title": "Show repositories",
    "group": "Repositories",
    "description": "<p>Get all the repositories along with the most contributing actor</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"user_name\"",
              "\"repo_name\"",
              "\"user_events\""
            ],
            "optional": false,
            "field": "sort_by",
            "defaultValue": "user_events",
            "description": "<p>Sort by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"ASC\"",
              "\"DESC\""
            ],
            "optional": false,
            "field": "sort",
            "defaultValue": "DESC",
            "description": "<p>Sort as.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "paginate",
            "defaultValue": "20",
            "description": "<p>Number of results per page.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/api/repositories/index.js",
    "groupTitle": "Repositories",
    "name": "GetRepositories"
  },
  {
    "type": "get",
    "url": "/repositories/{id}",
    "title": "Show repository",
    "group": "Repositories",
    "description": "<p>Get repository based on its id along with its events .</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Repository's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the event.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "RepoNotFound",
            "description": "<p>The id of the repository was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": true,\n\t\t \"message\": \"The requested repo does not exist\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/api/repositories/index.js",
    "groupTitle": "Repositories",
    "name": "GetRepositoriesId"
  },
  {
    "type": "post",
    "url": "/utils/data",
    "title": "Process Data",
    "group": "Utils",
    "description": "<p>Process the data and save it in the database. The file is picked from the app root.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file",
            "defaultValue": "data.json",
            "description": "<p>The name of the file to be inserted.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"file\": \"data.json\"\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{'success': true, 'message': \"The file is being added to database\"}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FileNotFound",
            "description": "<p>The data file was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": true,\n\t\t \"message\": \"The data file does not exist\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/api/utils/index.js",
    "groupTitle": "Utils",
    "name": "PostUtilsData"
  }
] });
