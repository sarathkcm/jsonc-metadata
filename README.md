## JSONC-METADATA
Extract field metadata from comments in JSONC files.

JSONC is JSON with comments. This library helps in extracting metadata for each field from comments.

>Depends on `jsonc-parser` library from microsoft for parsing jsonc.

### Usage
```js
import { parse, yamlCommentParser }  from "jsonc-metadata";


const jsonc = `{
        // this is the name
        "name": "JSONC",

        // this is tags
        "tags" : [
            "library",
            "node",
            "comments"
        ],
    }`;

    const metadata = parse(jsonc); 
    /*
        {
            "name": ["this is the name"],
            "tags": ["this is tags"]
        }
    */


    const jsoncWithYamlComments = `{
        // message: this is name field
        "name": "JSONC",

        // message: these are tags
        "tags" : [
            "library",
            "node",
            "comments"
        ],
    }`;

    const metadata2 = parse(jsonc, yamlCommentParser); 
    
    /* 
        { 
            "name": {
                "message": "this is the name"
            }, 
            "tags": {
                "message" : "these are tags" 
            }
        }
    */

```