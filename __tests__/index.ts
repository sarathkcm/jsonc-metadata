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

    expect(metadata).toEqual({
        name: ["this is the name"],
        tags: ["this is tags"],
        "versions": ["these are versions"],
        "versions.alpha": ["alpha version is released"],
        "versions.beta": ["Beta version is", "still in progress"],
        "nestedObjects": ["test for nested objects"],
        "nestedObjects.level1": ["nested object level1", "level1 has two comments"],
        "nestedObjects.level1.level2": ["level 2 here"],
        "nestedObjects.level1.level2.level3": ["level 3 here"],
    })
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

    expect(metadata).toEqual({
        name: { message: "this is name field" },
        tags: { message: "these are tags" },
        "versions": { name: "JSONC-METADATA", list: [2, 3], boolean: true, number: 6, null: null, nestedObject: { level1: { level2: "value" } } },
        "versions.alpha": { name: "JSONC-METADATA", list: [2, 3], boolean: true, number: 7, null: null, nestedObject: { level1: { level2: "value" } } },
        "nestedObjects": { name: "JSONC-METADATA", list: [2, 3], boolean: true, number: 8, null: null, nestedObject: { level1: { level2: "value" } } }, 
        "nestedObjects.level1": { message: "nested level1" },
        "nestedObjects.level1.level2": { message: "nested level2" },
        "nestedObjects.level1.level2.level3": { message: "nested level3" },
    })
});