import { parse, yamlCommentParser } from "../src";
test("parse should be able to parse jsonc with default comment parser", () => {

    const jsonc = `{
        // this is the name
        "name": "JSONC",

        // this is tags
        "tags" : [
            "library",
            "node",
            "comments"
        ],

        // these are versions
        "versions" :{
            // alpha version is released
            "alpha": "released",
            /*
                Beta version is
                still in progress 
            */
            "beta": "in progress"
        },
        // test for nested objects
        "nestedObjects":{
            // nested object level1
            // level1 has two comments
            "level1":{
                // level 2 here
                "level2": {
                    /* level 3 here */ "level3": 4
                }
            }
        }
    }`;

    const metadata = parse(jsonc);

    expect(metadata).toEqual([
      {
        "path": [
          "name"
        ],
        "metadata": [
          "this is the name"
        ]
      },
      {
        "path": [
          "tags"
        ],
        "metadata": [
          "this is tags"
        ]
      },
      {
        "path": [
          "versions"
        ],
        "metadata": [
          "these are versions"
        ]
      },
      {
        "path": [
          "versions",
          "alpha"
        ],
        "metadata": [
          "alpha version is released"
        ]
      },
      {
        "path": [
          "versions",
          "beta"
        ],
        "metadata": [
          "Beta version is",
          "still in progress"
        ]
      },
      {
        "path": [
          "nestedObjects"
        ],
        "metadata": [
          "test for nested objects"
        ]
      },
      {
        "path": [
          "nestedObjects",
          "level1"
        ],
        "metadata": [
          "nested object level1",
          "level1 has two comments"
        ]
      },
      {
        "path": [
          "nestedObjects",
          "level1",
          "level2"
        ],
        "metadata": [
          "level 2 here"
        ]
      },
      {
        "path": [
          "nestedObjects",
          "level1",
          "level2",
          "level3"
        ],
        "metadata": [
          "level 3 here"
        ]
      }
    ])
});

test("parse should be able to parse jsonc with yaml comment parser", () => {

    const jsonc = `{
        // message: this is name field
        "name": "JSONC",

        // message: these are tags
        "tags" : [
            "library",
            "node",
            "comments"
        ],

        /* name: JSONC-METADATA
         * list:
         *   - 2
         *   - 3
         * boolean: true
         * number: 6
         * null: null
         * nestedObject:
         *   level1: 
         *     level2: value
        */
        "versions" :{
         // name: JSONC-METADATA
         // list:
         //   - 2
         //   - 3
         // boolean: true
         // number: 7
         // null: null
         // nestedObject:
         //   level1: 
         //     level2: value
            "alpha": "released",
            "beta": "in progress"
        },

       /* name: JSONC-METADATA
        * list:
        *   - 2
        *   - 3
        * boolean: true
        * number: 8
        * null: null
        * nestedObject:
        *   level1: 
        *     level2: value
       */
        "nestedObjects":{
            // message: nested level1
            "level1":{
                // message: nested level2
                "level2": {
                    // message: nested level3
                    "level3": 4
                }
            }
        }
    }`;

    const metadata = parse(jsonc, yamlCommentParser);

    expect(metadata).toEqual([
      {
        "path": [
          "name"
        ],
        "metadata": {
          "message": "this is name field"
        }
      },
      {
        "path": [
          "tags"
        ],
        "metadata": {
          "message": "these are tags"
        }
      },
      {
        "path": [
          "versions"
        ],
        "metadata": {
          "name": "JSONC-METADATA",
          "list": [
            2,
            3
          ],
          "boolean": true,
          "number": 6,
          "null": null,
          "nestedObject": {
            "level1": {
              "level2": "value"
            }
          }
        }
      },
      {
        "path": [
          "versions",
          "alpha"
        ],
        "metadata": {
          "name": "JSONC-METADATA",
          "list": [
            2,
            3
          ],
          "boolean": true,
          "number": 7,
          "null": null,
          "nestedObject": {
            "level1": {
              "level2": "value"
            }
          }
        }
      },
      {
        "path": [
          "nestedObjects"
        ],
        "metadata": {
          "name": "JSONC-METADATA",
          "list": [
            2,
            3
          ],
          "boolean": true,
          "number": 8,
          "null": null,
          "nestedObject": {
            "level1": {
              "level2": "value"
            }
          }
        }
      },
      {
        "path": [
          "nestedObjects",
          "level1"
        ],
        "metadata": {
          "message": "nested level1"
        }
      },
      {
        "path": [
          "nestedObjects",
          "level1",
          "level2"
        ],
        "metadata": {
          "message": "nested level2"
        }
      },
      {
        "path": [
          "nestedObjects",
          "level1",
          "level2",
          "level3"
        ],
        "metadata": {
          "message": "nested level3"
        }
      }
    ])
});