#!/bin/bash

curl -XDELETE localhost:9200/demo?pretty

curl -XPUT localhost:9200/demo?pretty -d '{
  "settings" : {
    "analysis" : {
      "char_filter" : {
        "mapper_demo" : {
          "type" : "mapping",
          "mappings" : [
            "@ => a",
            "3 => e"
          ]
        }
      },
      "analyzer" : {
        "title_analyzer" : {
          "type" : "custom",
          "char_filter" : [ "mapper_demo" ],
          "tokenizer" : "whitespace"
        }
      }
    }
  },
  "mappings" : {
    "book" : {
      "dynamic" : true,
      "properties" : {
        "suggest" : {
          "type" : "completion"
        },
        "title" : {
          "type" : "text",
          "analyzer" : "title_analyzer"
        },
        "year" : {
          "type" : "integer"
        },
        "author" : {
          "type" : "text"
        }
      }
    }
  }
}'

curl -XPUT localhost:9200/_bulk?pretty -d '
{ "index" : { "_index" : "demo", "_type" : "book", "_id" : 1 } }
{ "suggest" : [ { "input" : "Brothers Karamazov", "weight" : 10 }, { "input" : "Fyodor Dostoyevsky", "weight" : 5 }], "author" : "Fyodor Dostoyevsky", "title" : "Th3Broth3rsK@r@m@zov", "year" : 1880, "quote" : "I love mankind, he said, but I find to my amazement that the more I love mankind as a whole, the less I love man in particular."  }
{ "index" : { "_index" : "demo", "_type" : "book", "_id" : 2 } }
{ "author" : "Fyodor Dostoyevsky", "title" : "Crim3AndPunishm3nt", "year" : 1866, "quote" : "The darker the night, the brighter the stars, the deeper the grief, the closer is God!" }
{ "index" : { "_index" : "demo", "_type" : "book", "_id" : 3 } }
{ "author" : "Yukio Mishima", "title" : "Th3D3c@yOfTh3Ang3l", "year" : 1971 }
{ "index" : { "_index" : "demo", "_type" : "book", "_id" : 4 } }
{ "author" : "Alistair MacLeod", "title" : "Isl@nd" }
'
